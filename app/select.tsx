import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { EmptyView } from '../src/components/EmptyView';
import { ThemedText } from '../src/components/ThemedText';
import { UniversityCard } from '../src/components/UniversityCard';
import { universities } from '../src/config/universities';
import { useUniversity } from '../src/state';
import { useTheme } from '../src/theme';

export default function Select() {
  const router = useRouter();
  const { universityId, setUniversity } = useUniversity();
  const { colors, spacing } = useTheme();

  if (universities.length === 0) {
    return <EmptyView title="No universities yet" message="No universities are available right now. Please check back later." />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
    >
      <ThemedText variant="heading" accessibilityRole="header">Choose your university</ThemedText>
      {universities.map((u) => (
        <UniversityCard
          key={u.id}
          university={u}
          selected={u.id === universityId}
          onPress={async () => {
            await setUniversity(u.id);
            router.replace('/(tabs)');
          }}
        />
      ))}
    </ScrollView>
  );
}
