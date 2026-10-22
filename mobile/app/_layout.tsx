import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { colors } from '../src/theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown:false, contentStyle:{backgroundColor:colors.background} }}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="alarm-test" options={{presentation:'modal'}}/>
    <Stack.Screen name="icon-gallery" options={{presentation:'card'}}/>
  </Stack>;
}
