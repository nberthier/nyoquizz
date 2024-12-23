'use client';

import GameSession from '@/components/game/game-session';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';

const Game: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const date = searchParams.get('date');

  return (
    <div>
      {date && <GameSession date={parseInt(date)} game={params.slug} />}
    </div>
  );
};

export default Game;
