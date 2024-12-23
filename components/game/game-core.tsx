'use client';

import { actions } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Image as GameImage } from '@/db/schema';
import { Session } from '@auth/core/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { CldImage } from 'next-cloudinary';
import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  text: z.string().min(1),
});

const initialState = {
  currentImageStatId: null,
  currentTries: 0,
  resolved: false,
};

type GameAction = Increment | Reset | StartOrResume;

interface GameState {
  currentImageStatId: null | string;
  currentTries: number;
  resolved: boolean;
}
type Increment = {
  type: 'valid_answer' | 'wrong_answer';
};

type Reset = {
  type: 'reset';
};

type StartOrResume = {
  imageStatId: string;
  numberOfTries: number;
  type: 'start_or_resume';
};

const GameCore: React.FC<{
  image: GameImage;
  progression: number;
  session: Session;
  updateProgression: () => void;
}> = ({ image, progression, session, updateProgression }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const handleImageStat = async () => {
      if (session.user) {
        const imageStat = await actions.imageStats.getByUniquePair(
          session.user.id!,
          image.id
        );
        if (imageStat) {
          dispatch({
            imageStatId: imageStat.id,
            numberOfTries: imageStat.numberOfTries,
            type: 'start_or_resume',
          });
        } else {
          const newImageStat = await actions.imageStats.createOne(
            session.user.id!,
            image.id
          );
          dispatch({
            imageStatId: newImageStat[0].id,
            numberOfTries: 0,
            type: 'start_or_resume',
          });
        }
      }
    };
    handleImageStat();
  }, [image, progression, session]);

  useEffect(() => {
    const incrementImageStat = async () => {
      if (state.currentImageStatId && state.resolved) {
        await actions.imageStats.setNumberOfTries(
          state.currentImageStatId,
          state.currentTries
        );
        await actions.imageStats.resolveImage(state.currentImageStatId);
        dispatch({ type: 'reset' });
        updateProgression();
      } else if (state.currentImageStatId) {
        await actions.imageStats.setNumberOfTries(
          state.currentImageStatId,
          state.currentTries
        );
      }
    };
    incrementImageStat();
  }, [state, updateProgression]);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      text: '',
    },
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (
      state.currentImageStatId &&
      values.text.toLowerCase() === image.champion
    ) {
      dispatch({ type: 'valid_answer' });
      form.reset();
      return true;
    } else {
      dispatch({ type: 'wrong_answer' });
      form.reset();
      return false;
    }
  }

  return (
    <div className="flex h-full max-w-[900px] flex-col items-center justify-center gap-8 p-8">
      <div className="flex w-full items-center justify-center space-x-2">
        Number of tries : {state.currentTries}
      </div>
      {image && (
        <CldImage
          alt="Image to guess"
          className="aspect-video rounded"
          height={2000}
          src={image.link}
          width={2000}
        />
      )}
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Form {...form}>
          <form
            className="flex w-full items-center justify-center space-x-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="This champion is..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'start_or_resume':
      return {
        ...state,
        currentImageStatId: action.imageStatId,
        currentTries: action.numberOfTries,
        resolved: false,
      };
    case 'valid_answer':
      return {
        ...state,
        currentTries: state.currentTries + 1,
        resolved: true,
      };
    case 'wrong_answer':
      return {
        ...state,
        currentTries: state.currentTries + 1,
      };
    default:
      throw new Error();
  }
}

export default GameCore;
