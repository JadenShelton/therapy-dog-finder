import { PlaceholderScreen } from '../../src/components/PlaceholderScreen';
import { useUniversity } from '../../src/state';

export default function Home() {
  const { university } = useUniversity();
  return <PlaceholderScreen title={university?.shortName ?? 'Home'} note="Map and dog status arrive in a later PR." />;
}
