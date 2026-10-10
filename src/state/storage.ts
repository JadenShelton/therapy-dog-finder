import AsyncStorage from '@react-native-async-storage/async-storage';

// Only the selected university id is persisted (D3).
export const STORAGE_KEY = 'pawsoncampus.universityId';

export async function loadUniversityId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function saveUniversityId(id: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, id);
}

export async function removeUniversityId(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
