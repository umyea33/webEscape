import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppShell } from '../views/AppShell';

export function AppRoot() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}
