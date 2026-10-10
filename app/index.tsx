import { Redirect } from 'expo-router';
import { LoadingView } from '../src/components/LoadingView';
import { useUniversity } from '../src/state';

export default function Index() {
  const { loading, universityId } = useUniversity();
  if (loading) return <LoadingView label="Loading your university" />;
  return <Redirect href={universityId ? '/(tabs)' : '/select'} />;
}
