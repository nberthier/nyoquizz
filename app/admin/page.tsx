'use client';

import { actions } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const gameList = {
  lol: 'League of Legends',
  valorant: 'Valorant',
};

const FormSchema = z.object({
  game: z.string({ required_error: 'A game is required.' }),
  limitDate: z.date({
    required_error: 'A date is required.',
  }),
});

export default function Admin() {
  const { data: session } = useSession();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.limitDate, data.game);
    const getImages = async () => {
      const lolImages = await actions.cloudinary.getAllGameImagesSince(
        data.game,
        format(data.limitDate, 'yyyy-MM-dd')
      );
      _.forEach(lolImages.resources, (image) => {
        actions.images.addImage({
          champion: image.tags[0],
          game: data.game,
          link: image.secure_url,
          type: 'game',
        });
      });
    };
    getImages();
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <h1>Admin</h1>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="game"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(gameList).map((game) => (
                      <SelectItem key={game} value={game}>
                        {gameList[game as keyof typeof gameList]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="limitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>All images since ...</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        variant={'outline'}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                      mode="single"
                      onSelect={field.onChange}
                      selected={field.value}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add to database</Button>
        </form>
      </Form>
    </div>
  );
}
