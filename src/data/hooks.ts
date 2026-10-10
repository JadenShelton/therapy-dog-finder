import { useEffect, useState } from 'react';
import type { Dog, LocationUpdate, WeeklySchedule } from '../domain/types';
import { useDataService } from './DataServiceProvider';

type Async<T, K extends string> = { [P in K]: T | null } & { loading: boolean; error: Error | null };

function useAsync<T>(load: (() => Promise<T>) | null, key: string | null) {
  const [state, setState] = useState<{ value: T | null; loading: boolean; error: Error | null }>({
    value: null,
    loading: key !== null,
    error: null,
  });
  useEffect(() => {
    if (!load) {
      setState({ value: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ value: null, loading: true, error: null });
    load().then(
      (value) => !cancelled && setState({ value, loading: false, error: null }),
      (e) => !cancelled && setState({ value: null, loading: false, error: e instanceof Error ? e : new Error(String(e)) }),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}

export function useDog(universityId: string | null | undefined): Async<Dog, 'dog'> {
  const service = useDataService();
  const s = useAsync(universityId ? () => service.getDog(universityId) : null, universityId ?? null);
  return { dog: s.value, loading: s.loading, error: s.error };
}

export function useSchedule(dogId: string | null | undefined): Async<WeeklySchedule, 'schedule'> {
  const service = useDataService();
  const s = useAsync(dogId ? () => service.getSchedule(dogId) : null, dogId ?? null);
  return { schedule: s.value, loading: s.loading, error: s.error };
}

/** Latest location update, or null before the first one. Unsubscribes on unmount or dog change. */
export function useDogLocation(dogId: string | null | undefined): LocationUpdate | null {
  const service = useDataService();
  const [update, setUpdate] = useState<LocationUpdate | null>(null);
  useEffect(() => {
    setUpdate(null);
    if (!dogId) return;
    return service.subscribeToLocation(dogId, setUpdate);
  }, [service, dogId]);
  return update;
}
