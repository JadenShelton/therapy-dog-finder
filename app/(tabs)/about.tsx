import { useRouter } from 'expo-router';
import { Linking, Pressable, ScrollView } from 'react-native';
import { DemoControls } from '../../src/components/about/DemoControls';
import { EmptyView } from '../../src/components/EmptyView';
import { ThemedText } from '../../src/components/ThemedText';
import { useDog } from '../../src/data';
import { useUniversity } from '../../src/state';
import { useTheme } from '../../src/theme';

export default function About() {
  const { university, clearUniversity } = useUniversity();
  const { dog } = useDog(university?.id);
  const { colors, spacing, radii } = useTheme();
  const router = useRouter();

  if (!university) {
    return (
      <EmptyView
        title="No university selected"
        message="Choose a university to learn about its therapy dog program."
        actionLabel="Choose university"
        onAction={() => router.replace('/select')}
      />
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
    >
      <ThemedText variant="heading" accessibilityRole="header">About</ThemedText>
      <ThemedText>
        {university.aboutText}
        {dog
          ? ` ${dog.name} is the therapy dog at ${university.name}, and ${dog.handler.firstName} is the handler. Say hello, but please ask before petting.`
          : ''}
      </ThemedText>
      <ThemedText variant="caption" muted>
        This is a prototype with placeholder names and sample data.
      </ThemedText>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Contact ${university.name}`}
        onPress={() => Linking.openURL(university.contactUrl)}
        style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}
      >
        <ThemedText style={{ color: colors.primary, textDecorationLine: 'underline' }}>
          {`Contact ${university.name}`}
        </ThemedText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Change university"
        onPress={async () => {
          await clearUniversity();
          router.replace('/select');
        }}
        style={{
          minHeight: 44,
          minWidth: 44,
          borderRadius: radii.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        }}
      >
        <ThemedText style={{ color: colors.onPrimary }}>Change university</ThemedText>
      </Pressable>

      {__DEV__ ? <DemoControls /> : null}
    </ScrollView>
  );
}
