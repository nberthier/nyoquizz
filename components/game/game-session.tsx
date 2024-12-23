'use client';

import { actions } from '@/app/actions';
import { ImagesSet, Image as ImageType } from '@/db/schema';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import GameCore from './game-core';

type ImagesSetWithImages = {
  images: Array<ImageType>;
} & ImagesSet;

const GameSession: React.FC<{ date: number; game: string }> = ({
  date,
  game,
}) => {
  const { data: session } = useSession();

  const [imagesSet, setImagesSet] = useState<ImagesSetWithImages>();
  const [progression, setProgression] = useState(0);

  const updateProgression = async () => {
    if (session && imagesSet) {
      const updatedStat = await actions.gameSessions.updateProgression(
        session.user.id,
        imagesSet.id
      );
      setProgression(updatedStat[0].updatedProgression);
    }
  };

  useEffect(() => {
    const getImagesAndProgression = async () => {
      const imagesSet = await actions.imagesSets.getByDate(game, date);
      if (imagesSet && session?.user) {
        setImagesSet(imagesSet);
        const imagesSetUserStat =
          await actions.gameSessions.getByUserAndImagesSet(
            session.user.id,
            imagesSet.id
          );
        if (imagesSetUserStat) {
          setProgression(imagesSetUserStat.progression);
        } else {
          await actions.gameSessions.createOne({
            imagesSetId: imagesSet.id,
            progression: 0,
            userId: session.user.id,
          });
        }
      }
    };
    getImagesAndProgression();
  }, [date, game, session]);

  return (
    <div>
      {session && imagesSet && (
        <GameCore
          image={imagesSet.images[progression]}
          progression={progression}
          session={session}
          updateProgression={updateProgression}
        />
      )}
    </div>
  );
};

export default GameSession;
