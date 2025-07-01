import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  async requestPermissions() {
    if (Platform.OS === 'web') {
      return { status: 'granted' };
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return { status };
  }

  async scheduleNotification(title: string, body: string, trigger: any) {
    if (Platform.OS === 'web') {
      // Web notification fallback
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger,
    });
  }

  async sendImmediateNotification(title: string, body: string) {
    if (Platform.OS === 'web') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null,
    });
  }

  async cancelAllNotifications() {
    if (Platform.OS !== 'web') {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  }
}

export default new NotificationService();