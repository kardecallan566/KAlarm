import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import { colors } from '../src/theme';
import { migrate } from '../src/data/schema';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return <SQLiteProvider databaseName="kalarm.db" onInit={migrate} useSuspense>
    <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.background}}}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="medication/new" />
      <Stack.Screen name="medication/[id]" />
      <Stack.Screen name="alarm-test" options={{presentation:'modal'}}/>
      <Stack.Screen name="icon-gallery" options={{presentation:'card'}}/>
    </Stack>
  </SQLiteProvider>;
}
