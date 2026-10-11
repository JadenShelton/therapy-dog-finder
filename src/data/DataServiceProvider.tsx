import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createDataService } from './createDataService';
import type { DataService } from './DataService';

const Ctx = createContext<DataService | null>(null);

export function DataServiceProvider({ children, service }: { children: ReactNode; service?: DataService }) {
  const value = useMemo(() => service ?? createDataService(), [service]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDataService(): DataService {
  const s = useContext(Ctx);
  if (!s) throw new Error('useDataService must be used inside DataServiceProvider');
  return s;
}
