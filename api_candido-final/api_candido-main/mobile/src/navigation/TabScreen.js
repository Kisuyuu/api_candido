import { View } from 'react-native';
import { BottomNav } from '../shared/components/BottomNav';
import { Screen } from '../shared/components/Screen';
import { useNavigation } from './Navigator';

/** Tela raiz com barra de navegação inferior (abas Início / Jogadores + botão de cadastro). */
export function TabScreen({ active, title, subtitle, right, children }) {
  const nav = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Screen title={title} subtitle={subtitle} right={right}>
        {children}
      </Screen>
      <BottomNav active={active} onNavigate={nav.navigate} onCreate={() => nav.push('formulario')} />
    </View>
  );
}
