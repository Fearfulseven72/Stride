'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export const palettes = [
  { id: 'sepia', name: 'Sepia Skin', description: 'Warm clay, cream & sage', colors: ['#966548', '#c6b9aa', '#66796e'] },
  { id: 'storm', name: 'Storm Grey', description: 'Quiet slate & soft linen', colors: ['#6c777c', '#e2e8e7', '#554135'] },
  { id: 'congo', name: 'Congo Brown', description: 'Rich earth & warm sand', colors: ['#554135', '#c6b9aa', '#966548'] },
  { id: 'coral', name: 'Coral Reef', description: 'Soft sand & botanical green', colors: ['#c6b9aa', '#66796e', '#554135'] },
  { id: 'mirage', name: 'Mirage', description: 'Charcoal & understated stone', colors: ['#1a1a1e', '#6c777c', '#c6b9aa'] },
] as const;
type Preferences = { name: string; theme: 'light' | 'dark' | 'system'; palette: string };
const defaults: Preferences = { name: '', theme: 'light', palette: 'sepia' };
const storageKey = 'stride-preferences-v1';
const Context = createContext({ preferences: defaults, update: (_change: Partial<Preferences>) => { void _change; }, error: '' });

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved) setPreferences({
        name: typeof saved.name === 'string' ? saved.name.slice(0, 60) : '',
        theme: ['light', 'dark', 'system'].includes(saved.theme) ? saved.theme : 'light',
        palette: palettes.some(p => p.id === saved.palette) ? saved.palette : 'sepia',
      });
    } catch { setError('Preferences could not be loaded. Changes still apply to this visit.'); }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      document.documentElement.dataset.theme = preferences.theme === 'system' ? (media.matches ? 'dark' : 'light') : preferences.theme;
      document.documentElement.dataset.palette = preferences.palette;
    };
    apply();
    media.addEventListener('change', apply);
    try { localStorage.setItem(storageKey, JSON.stringify(preferences)); }
    catch { setError('Browser storage is unavailable. Preferences apply until you leave this page.'); }
    return () => media.removeEventListener('change', apply);
  }, [preferences, loaded]);
  return <Context.Provider value={{ preferences, update: change => setPreferences(p => ({ ...p, ...change })), error }}>{children}</Context.Provider>;
}
export function usePreferences() { return useContext(Context); }
