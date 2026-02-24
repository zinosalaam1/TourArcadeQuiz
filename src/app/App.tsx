import { RouterProvider } from 'react-router';
import { router } from './routes';
import { GameProvider } from './contexts/GameContext';

export default function App() {
  return (
    <GameProvider>
      <RouterProvider router={router} />
    </GameProvider>
  );
}
