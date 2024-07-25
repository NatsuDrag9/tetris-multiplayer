'use client';

import { WebSocketProvider } from '@/contexts/WebSocketContext';

interface ProvidersInterface {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersInterface) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}

export default Providers;
