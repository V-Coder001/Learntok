import { Redirect } from 'expo-router';

import { useSession } from '@/store/session';

// Einstieg: Onboarding → Login → Feed. Der Sitzungszustand entscheidet, wo man landet.
export default function Index() {
  const onboarded = useSession((s) => s.onboarded);
  const user = useSession((s) => s.user);
  if (!onboarded) return <Redirect href="/onboarding" />;
  if (!user) return <Redirect href="/login" />;
  return <Redirect href="/(tabs)/feed" />;
}
