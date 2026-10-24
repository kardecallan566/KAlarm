// Módulo de diagnóstico para Expo Go (SDK 57).
// Não simula entrega nem finge conceder permissões reais.
const warning = 'Alarmes indisponíveis no modo Expo Go seguro. Para testar lembretes, instale a Development Build do KAlarm usando pnpm run android.';

export const IosAuthorizationStatus = { PROVISIONAL: 3 };
export const AndroidImportance = { HIGH: 4 };
export const AndroidNotificationPriority = { HIGH: 'high' };
export const SchedulableTriggerInputTypes = { DATE: 'date' };

export function setNotificationHandler(_handler) {}
export async function getPermissionsAsync() {
  return { granted: false, canAskAgain: false, expires: 'never', status: 'denied', ios: { status: 0 } };
}
export async function requestPermissionsAsync() {
  throw new Error(warning);
}
export async function setNotificationChannelAsync(_id, _channel) {
  throw new Error(warning);
}
export async function getAllScheduledNotificationsAsync() {
  return [];
}
export async function scheduleNotificationAsync(_input) {
  throw new Error(warning);
}
export async function cancelScheduledNotificationAsync(_id) {
  throw new Error(warning);
}
export function addNotificationResponseReceivedListener(_listener) {
  return { remove() {} };
}
export async function getLastNotificationResponseAsync() {
  return null;
}
