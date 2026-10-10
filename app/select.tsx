import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ThemedText } from '../src/components/ThemedText';
import { universities } from '../src/config/universities';
import { useUniversity } from '../src/state';
import { useTheme } from '../src/theme';

// Minimal list; a later PR replaces this with the full select screen.
export default function Select() {
  const router = useRouter();
  const { universityId, setUniversity } = useUniversity();
  const { colors, spacing, radii } = useTheme();

  return (
    <View style={{ flex: 1, padding: spacing.md, gap: spacing.md, backgroundColor: colors.background }}>
      <ThemedText variant="heading" accessibilityRole="header">Choose your university</ThemedText>
      {universities.map((u) => (
        <Pressable
          key={u.id}
          accessibilityRole="button"
          accessibilityLabel={`${u.name}, ${u.city}`}
          accessibilityState={{ selected: u.id === universityId }}
          onPress={async () => {
            await setUniversity(u.id);
            router.replace('/(tabs)');
          }}
          style={{
            padding: spacing.md,
            minHeight: 48,
            borderRadius: radii.md,
            backgroundColor: u.theme.primary,
            justifyContent: 'center',
          }}
        >
          <ThemedText variant="title" style={{ color: u.theme.onPrimary }}>{u.name}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}
