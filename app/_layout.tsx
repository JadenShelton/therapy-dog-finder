import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DataServiceProvider } from '../src/data';
import { UniversityProvider } from '../src/state';
import { ThemeProvider, useTheme } from '../src/theme';

function ThemedStack() {
  const { colors, statusBarStyle } = useTheme();
  return (
    <>
      <StatusBar style={statusBarStyle} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.onPrimary,
          headerTitleStyle: { color: colors.onPrimary },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="select" options={{ title: 'Choose your university' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <UniversityProvider>
      <ThemeProvider>
        <DataServiceProvider>
          <ThemedStack />
        </DataServiceProvider>
      </ThemeProvider>
    </UniversityProvider>
  );
}
