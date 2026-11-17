import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, BackHandler, Easing, StyleSheet } from 'react-native';

const NavigationContext = createContext(null);

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation deve ser usado dentro de <Navigator>.');
  return ctx;
}

let keyCounter = 0;
const makeEntry = (name, params = {}) => ({ key: `r${keyCounter++}`, name, params });

/**
 * Navegador em pilha minimalista.
 * - navigate(tab): troca de aba (zera a pilha)
 * - push(name, params): abre uma tela por cima
 * - pop(): volta; replace(): troca a tela do topo; reset(name): zera e abre
 */
export function Navigator({ screens, initialRoute }) {
  const [stack, setStack] = useState(() => [makeEntry(initialRoute)]);

  const push = useCallback((name, params) => setStack((s) => [...s, makeEntry(name, params)]), []);
  const pop = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const replace = useCallback((name, params) => setStack((s) => [...s.slice(0, -1), makeEntry(name, params)]), []);
  const reset = useCallback((name, params) => setStack([makeEntry(name, params)]), []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        pop();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, pop]);

  const current = stack[stack.length - 1];
  const value = useMemo(
    () => ({ push, pop, replace, reset, navigate: reset, route: current, canGoBack: stack.length > 1 }),
    [push, pop, replace, reset, current, stack.length]
  );

  const Screen = screens[current.name];

  return (
    <NavigationContext.Provider value={value}>
      <ScreenTransition key={current.key}>
        <Screen params={current.params} />
      </ScreenTransition>
    </NavigationContext.Provider>
  );
}

function ScreenTransition({ children }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  return (
    <Animated.View
      style={[
        styles.fill,
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
