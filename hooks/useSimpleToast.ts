import { Alert, Platform } from 'react-native';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export const useSimpleToast = () => {
  const showToast = (type: ToastType, message: string, title?: string) => {
    const getTitle = () => {
      if (title) return title;
      
      switch (type) {
        case 'success':
          return 'Success';
        case 'error':
          return 'Error';
        case 'warning':
          return 'Warning';
        case 'info':
          return 'Info';
        default:
          return 'Notification';
      }
    };

    const getEmoji = () => {
      switch (type) {
        case 'success':
          return '✅';
        case 'error':
          return '❌';
        case 'warning':
          return '⚠️';
        case 'info':
          return 'ℹ️';
        default:
          return '📢';
      }
    };

    if (Platform.OS === 'web') {
      // For web, use alert with emoji
      alert(`${getEmoji()} ${getTitle()}\n\n${message}`);
    } else {
      // For mobile, use React Native Alert
      Alert.alert(`${getEmoji()} ${getTitle()}`, message);
    }
  };

  return {
    showToast
  };
}; 