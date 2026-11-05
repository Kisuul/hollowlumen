import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { DEFAULT_APPEARANCE, normalizeAppearance, readAppearance, writeAppearance } from './preferences.js';
import { presentationAt } from './presentation.js';

const AppearanceContext = createContext(null);

function loadPreferences() {
  try { return readAppearance(window.localStorage); }
  catch { return { ...DEFAULT_APPEARANCE }; }
}

function applyTheme(theme) {
  document.documentElement.dataset.uiTheme = theme;
  document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'night' ? '#1B182A' : '#FCF8FF');
}

// Called before React mounts: prevents the initial white flash for saved Dark preference.
export function bootstrapAppearance() {
  const appearance = loadPreferences();
  const { uiTheme } = presentationAt(new Date(), appearance);
  applyTheme(uiTheme);
}

export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState(loadPreferences);
  const [previewHour, setPreviewHour] = useState(null);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const refreshClock = () => setClock(new Date());
    const timer = window.setInterval(refreshClock, 60_000);
    const onVisibilityChange = () => { if (!document.hidden) refreshClock(); };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', refreshClock);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', refreshClock);
    };
  }, []);

  const presentation = useMemo(
    () => presentationAt(clock, appearance, previewHour),
    [clock, appearance, previewHour],
  );

  useLayoutEffect(() => applyTheme(presentation.uiTheme), [presentation.uiTheme]);

  function updateAppearance(patch) {
    setAppearance((previous) => {
      const next = normalizeAppearance({ ...previous, ...patch });
      // Persist separately from 'lumenette-hollow-save'; failure is nonfatal.
      try { writeAppearance(window.localStorage, next); } catch { /* Storage unavailable. */ }
      return next;
    });
  }

  const value = useMemo(() => ({
    ...presentation,
    clock,
    previewHour,
    setPreviewHour,
    updateAppearance,
  }), [presentation, clock, previewHour]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error('useAppearance requires AppearanceProvider');
  return context;
}
