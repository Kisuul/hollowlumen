import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createCritter, editActiveCritter, selectCritter, selectFavorite } from './critters.js';
import {
  claimIdle, finishWander, newGame, purchaseColor, purchaseDecor,
  sanitizeSave, migratePersistedSave, upgradeIdle,
} from './game.js';

// Preserve saves written by a newer, incompatible app instead of overwriting
// them after this older build fails to hydrate. Unknown versions are read-only.
const jsonStorage = createJSONStorage(() => localStorage);
const guardedStorage = {
  ...jsonStorage,
  setItem(key, value) {
    let storedVersion = null;
    try {
      const previous = JSON.parse(localStorage.getItem(key) ?? 'null');
      storedVersion = previous?.version;
    } catch { /* Malformed input remains subject to the ordinary sanitizer. */ }
    if (Number.isInteger(storedVersion) && storedVersion > 2) {
      console.warn('A newer HollowLumen save is present; this build will not overwrite it.');
      return;
    }
    return jsonStorage.setItem(key, value);
  },
};

const initial = newGame();
// Old single-Pip UI aliases remain runtime projections; they are not persisted.
const aliases = new Set(['name', 'color', 'face', 'accessory']);
const fields = Object.keys(initial).filter((key) => !aliases.has(key));

function backUpVersionOneSave() {
  try {
    const storage = window.localStorage;
    const original = storage.getItem('lumenette-hollow-save');
    if (original && storage.getItem('lumenette-hollow-save-v1-backup') === null) {
      const parsed = JSON.parse(original);
      if (parsed?.version === 1) storage.setItem('lumenette-hollow-save-v1-backup', original);
    }
  } catch { /* Quota/security errors do not destroy an existing v1 save. */ }
}

export const useGame = create(persist((set) => ({
  ...initial,
  claim: () => {
    let earned = 0;
    set((state) => {
      const outcome = claimIdle(state);
      earned = outcome.earned;
      return outcome.state;
    });
    return earned;
  },
  upgrade: () => set((state) => upgradeIdle(state)),
  buyDecor: (id) => set((state) => purchaseDecor(state, id)),
  buyColor: (id) => set((state) => purchaseColor(state, id)),
  setColor: (id) => set((state) => editActiveCritter(state, { color: id })),
  setName: (name) => set((state) => editActiveCritter(state, { name })),
  setFace: (face) => set((state) => editActiveCritter(state, { face })),
  setAccessory: (accessory) => set((state) => editActiveCritter(state, { accessory })),
  createCritter: () => set((state) => createCritter(state)),
  selectCritter: (id) => set((state) => selectCritter(state, id)),
  setFavoriteCritter: (id) => set((state) => selectFavorite(state, id)),
  setBattery: (battery) => set({ battery: Math.max(0, Math.min(100, Math.round(Number(battery) || 0))) }),
  toggleGate: () => set((state) => ({ gateOpen: !state.gateOpen })),
  finishWander: (id) => set((state) => finishWander(state, id)),
}), {
  name: 'lumenette-hollow-save',
  version: 2,
  migrate: (persisted, fromVersion) => {
    if (fromVersion === 1) backUpVersionOneSave();
    return migratePersistedSave(persisted, fromVersion, Date.now());
  },
  storage: guardedStorage,
  partialize: (state) => Object.fromEntries(fields.map((key) => [key, state[key]])),
  merge: (persisted, current) => ({ ...current, ...sanitizeSave(persisted, Date.now()) }),
}));
