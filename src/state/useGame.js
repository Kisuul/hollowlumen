import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  claimIdle, finishWander, newGame, purchaseColor, purchaseDecor,
  sanitizeSave, upgradeIdle,
} from './game.js';

const initial = newGame();
const fields = Object.keys(initial);

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
  setColor: (id) => set((state) => state.ownedColors.includes(id) ? { color: id } : {}),
  setName: (name) => set({ name: String(name).trim().slice(0, 20) || 'Pip' }),
  setFace: (face) => set(['smile', 'sleepy', 'bright'].includes(face) ? { face } : {}),
  setAccessory: (accessory) => set(['scarf', 'bow', 'flower', 'none'].includes(accessory) ? { accessory } : {}),
  setBattery: (battery) => set({ battery: Math.max(0, Math.min(100, Math.round(Number(battery) || 0))) }),
  toggleGate: () => set((state) => ({ gateOpen: !state.gateOpen })),
  finishWander: (id) => set((state) => finishWander(state, id)),
}), {
  name: 'lumenette-hollow-save',
  version: 1,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => Object.fromEntries(fields.map((key) => [key, state[key]])),
  merge: (persisted, current) => ({ ...current, ...sanitizeSave(persisted, Date.now()) }),
}));
