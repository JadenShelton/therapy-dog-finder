import { Pressable } from 'react-native';
import { PlaceholderScreen } from '../../src/components/PlaceholderScreen';
import { ThemedText } from '../../src/components/ThemedText';
import { useUniversity } from '../../src/state';
import { useTheme } from '../../src/theme';
import { useRouter } from 'expo-router';

export default function About() {
  const { university, clearUniversity } = useUniversity();
  const { colors, spacing } = useTheme();
  const router = useRouter();
  return (
    <>
      <PlaceholderScreen title="About" note={university?.aboutText ?? 'About this app arrives in a later PR.'} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Change university"
        onPress={async () => {
          await clearUniversity();
          router.replace('/select');
        }}
        style={{ padding: spacing.md, minHeight: 48, justifyContent: 'center', backgroundColor: colors.background }}
      >
        <ThemedText style={{ color: colors.primary }}>Change university</ThemedText>
      </Pressable>
    </>
  );
}
