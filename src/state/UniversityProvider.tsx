import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getUniversity, type UniversityConfig } from '../config/universities';
import { loadUniversityId, removeUniversityId, saveUniversityId } from './storage';

type UniversityState = {
  universityId: string | null;
  university: UniversityConfig | null;
  /** True while the saved value is being read. */
  loading: boolean;
  setUniversity: (id: string) => Promise<void>;
  clearUniversity: () => Promise<void>;
};

const UniversityContext = createContext<UniversityState | null>(null);

export function UniversityProvider({ children }: { children: React.ReactNode }) {
  const [universityId, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadUniversityId().then((saved) => {
      if (!active) return;
      // Ignore saved ids that are no longer in the registry.
      setId(getUniversity(saved) ? saved : null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const setUniversity = useCallback(async (id: string) => {
    if (!getUniversity(id)) throw new Error(`Unknown university: ${id}`);
    setId(id); // update UI first so re-theming is immediate
    await saveUniversityId(id);
  }, []);

  const clearUniversity = useCallback(async () => {
    setId(null);
    await removeUniversityId();
  }, []);

  const value = useMemo<UniversityState>(
    () => ({
      universityId,
      university: getUniversity(universityId),
      loading,
      setUniversity,
      clearUniversity,
    }),
    [universityId, loading, setUniversity, clearUniversity],
  );

  return <UniversityContext.Provider value={value}>{children}</UniversityContext.Provider>;
}

export function useUniversity(): UniversityState {
  const ctx = useContext(UniversityContext);
  if (!ctx) throw new Error('useUniversity must be used inside UniversityProvider');
  return ctx;
}
