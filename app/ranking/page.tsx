'use client';

import { useSession } from 'next-auth/react';
import React from 'react';

export default function Ranking() {
  const { data: session } = useSession();

  console.log(session);

  return (
    <div className="flex h-full max-w-[900px] flex-col items-center justify-center gap-8 p-8">
      <h1>Ranking</h1>
    </div>
  );
}
