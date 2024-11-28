'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import aatrox from '@/lib/images/aatrox_1.png';
import akali from '@/lib/images/akali_1.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userInfo = {
  advancement: 0,
};

const championsIllustrations = [
  { link: aatrox, name: 'aatrox' },
  { link: akali, name: 'akali' },
];

const formSchema = z.object({
  text: z
    .string()
    .min(1, { message: 'Champion name must be at least 1 character long.' }),
});

export default function Game() {
  const [advancementIndex, setAdvancementIndex] = useState(
    userInfo.advancement
  );

  const [currentTries, setCurrentTries] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      text: '',
    },
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.text === championsIllustrations[advancementIndex].name) {
      setAdvancementIndex(advancementIndex + 1);
      return true;
    } else {
      setCurrentTries(currentTries + 1);
      return false;
    }
  }

  return (
    <div className="flex h-full max-w-[900px] flex-col items-center justify-center gap-8 p-8">
      <div className="flex w-full items-center justify-center space-x-2">
        Number of tries : {currentTries}
      </div>
      <Image
        alt="Champion"
        className="aspect-video rounded"
        height={2000}
        src={championsIllustrations[advancementIndex].link}
        width={2000}
      />
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
                  <FormMessage />
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
}
