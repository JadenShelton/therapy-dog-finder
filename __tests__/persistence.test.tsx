import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { UniversityProvider, useUniversity } from '../src/state';
import { STORAGE_KEY } from '../src/state/storage';

const wrapper = ({ children }: { children: React.ReactNode }) => <UniversityProvider>{children}</UniversityProvider>;

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('university persistence', () => {
  it('is loading while the saved value is read, then has no selection', async () => {
    let release!: (v: string | null) => void;
    (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() => new Promise((r) => (release = r)));
    const { result } = await renderHook(() => useUniversity(), { wrapper });
    expect(result.current.loading).toBe(true);
    await act(async () => release(null));
    expect(result.current.loading).toBe(false);
    expect(result.current.universityId).toBeNull();
  });

  it('restores a saved id', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'utah');
    const { result } = await renderHook(() => useUniversity(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.universityId).toBe('utah');
    expect(result.current.university?.shortName).toBe('Utah');
  });

  it('ignores an unknown saved id', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'nope');
    const { result } = await renderHook(() => useUniversity(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.universityId).toBeNull();
  });

  it('setUniversity saves only the id, clearUniversity resets it', async () => {
    const { result } = await renderHook(() => useUniversity(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.setUniversity('csu');
    });
    expect(result.current.universityId).toBe('csu');
    expect(await AsyncStorage.getItem(STORAGE_KEY)).toBe('csu');
    expect(await AsyncStorage.getAllKeys()).toEqual([STORAGE_KEY]);

    await act(async () => {
      await result.current.clearUniversity();
    });
    expect(result.current.universityId).toBeNull();
    expect(await AsyncStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
