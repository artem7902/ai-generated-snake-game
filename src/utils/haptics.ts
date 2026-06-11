import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function hapticFoodEaten(): void {
  if (Platform.OS === 'web') {
    return;
  }

  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticGameOver(): void {
  if (Platform.OS === 'web') {
    return;
  }

  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export function hapticDirection(): void {
  if (Platform.OS === 'web') {
    return;
  }

  void Haptics.selectionAsync();
}

export function hapticPause(): void {
  if (Platform.OS === 'web') {
    return;
  }

  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}
