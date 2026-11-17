import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow } from '../../core/theme';

const ToastContext = createContext({ show: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  const show = useCallback(
    (message, type = 'success') => {
      clearTimeout(timer.current);
      setToast({ message, type });
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToast(null));
      }, 3200);
    },
    [opacity]
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  const isError = toast?.type === 'error';

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }]}>
          <View style={[styles.toast, isError ? styles.error : styles.success]}>
            <Text style={styles.icon}>{isError ? '!' : '✓'}</Text>
            <Text style={styles.text}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const top = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 58;

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top, left: 16, right: 16, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: 480,
    width: '100%',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    ...shadow,
  },
  success: { backgroundColor: colors.success },
  error: { backgroundColor: colors.danger },
  icon: { color: '#fff', fontWeight: '900', fontSize: 16 },
  text: { color: '#fff', fontWeight: '700', flex: 1, fontSize: 14 },
});
