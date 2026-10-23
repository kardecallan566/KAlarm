import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import { colors } from '../src/theme';
import { migrate } from '../src/data/schema';
import { ReminderLifecycle } from '../src/components/ReminderLifecycle';

// Este módulo de notificações necessita de validação em uma Development Build.
// Algumas versões do Expo Go 57 Android encerram ao importar expo-notifications.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type BoundaryState = { error: Error | null };
class StartupErrorBoundary extends Component<{children: ReactNode}, BoundaryState> {
  state: BoundaryState = { error: null };
  static getDerivedStateFromError(error: Error): BoundaryState { return { error }; }
  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.error('[KAlarm] Falha na inicialização ou migração do banco:', error);
  }
  render() {
    if (this.state.error) {
      return <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background }}>
        <Text accessibilityRole="header" style={{ fontSize: 21, fontWeight: '800', color: colors.ink }}>Não foi possível iniciar o KAlarm</Text>
        <Text selectable style={{ color: colors.ink, fontSize: 15, lineHeight: 23, marginTop: 12 }}>
          Houve uma falha na inicialização do armazenamento local. Seus dados não foram apagados.
        </Text>
        {__DEV__ ? <Text selectable style={{ fontSize: 12, marginTop: 12, color: colors.muted }}>{this.state.error.message}</Text> : null}
      </View>;
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  return <StartupErrorBoundary>
    <Suspense fallback={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.ink, marginTop: 14, fontSize: 16 }}>Preparando seus medicamentos…</Text>
    </View>}>
      <SQLiteProvider databaseName="kalarm.db" onInit={migrate} useSuspense>
        <ReminderLifecycle />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="medication/new" />
          <Stack.Screen name="medication/[id]" />
          <Stack.Screen name="alarm-test" options={{ presentation: 'modal' }} />
          <Stack.Screen name="reminder-settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="icon-gallery" options={{ presentation: 'card' }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  </StartupErrorBoundary>;
}
