import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/core/queryClient';
import {
  HomeScreen,
  JogadorDetailScreen,
  JogadorFormScreen,
  JogadoresListScreen,
} from './src/features/jogadores';
import { Navigator } from './src/navigation/Navigator';
import { ToastProvider } from './src/shared/components/Toast';

const screens = {
  home: HomeScreen,
  jogadores: JogadoresListScreen,
  detalhe: JogadorDetailScreen,
  formulario: JogadorFormScreen,
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Navigator screens={screens} initialRoute="home" />
      </ToastProvider>
    </QueryClientProvider>
  );
}
