import { act, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { DataServiceProvider, useDogLocation } from '../src/data';
import type { DataService } from '../src/data/DataService';

it('useDogLocation unsubscribes on dog change and unmount', async () => {
  const unsubs: string[] = [];
  const service = {
    subscribeToLocation: (id: string, cb: (u: any) => void) => {
      cb({ status: 'off_duty', nextStart: null, updatedAt: id });
      return () => unsubs.push(id);
    },
  } as unknown as DataService;
  const wrapper = ({ children }: { children: ReactNode }) => (
    <DataServiceProvider service={service}>{children}</DataServiceProvider>
  );
  const { result, rerender, unmount } = await renderHook(({ id }: { id: string }) => useDogLocation(id), {
    wrapper,
    initialProps: { id: 'a' },
  });
  expect(result.current).toMatchObject({ updatedAt: 'a' });
  await act(async () => rerender({ id: 'b' }));
  expect(unsubs).toEqual(['a']);
  expect(result.current).toMatchObject({ updatedAt: 'b' });
  await unmount();
  expect(unsubs).toEqual(['a', 'b']);
});
