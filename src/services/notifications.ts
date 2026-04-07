import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Store } from '../data/stores';
import type { Product } from '../data/products';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Request permission to send notifications. Returns true if granted. */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    // Use the browser Notification API directly on web
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return true;
      const result = await Notification.requestPermission();
      return result === 'granted';
    }
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  // Android needs a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('transfers', {
      name: 'Transfer Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0050FF',
    });
  }

  return true;
}

/** Send a local push notification that a watched item is being transferred to a nearby store */
export async function sendTransferNotification(
  product: Product,
  store: Store
): Promise<string> {
  const title = 'Your item is on the way!';
  const body = `${product.name} is being shipped to ${store.name} (${store.city}, ${store.state}) — the store near you!`;

  if (Platform.OS === 'web') {
    return sendWebNotification(title, body);
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { productId: product.id, storeId: store.id },
      sound: true,
      ...(Platform.OS === 'android' && { channelId: 'transfers' }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
  return id;
}

/** Use the browser's native Notification API for web */
function sendWebNotification(title: string, body: string): string {
  const id = Date.now().toString();

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return id;
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      }
    });
  } else {
    // Small delay to mimic the native 2-second trigger
    setTimeout(() => {
      new Notification(title, { body, icon: '/favicon.ico' });
    }, 2000);
  }

  return id;
}
