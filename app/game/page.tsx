'use client';

import ChooseSet from '@/components/game/choose-set';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

const GamePicker: React.FC = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ChooseSet game="lol" />
      </QueryClientProvider>
    </div>
  );
};

export default GamePicker;
