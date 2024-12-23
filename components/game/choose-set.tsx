'use client';

import { actions } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { ImagesSet } from '@/db/schema';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

const ChooseSet: React.FC<{ game: string }> = ({ game }) => {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery<ImagesSet[], Error>({
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length > 0 ? allPages.length + 1 : null,
    initialPageParam: 1,
    maxPages: 3,
    queryFn: async ({ pageParam }) => {
      const result = await actions.imagesSets.getAllByGame(
        game,
        pageParam as number
      );
      if (!result) {
        throw new Error('Failed to get sets');
      } else {
        return result;
      }
    },
    queryKey: ['sets'],
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-3 text-center">
        <Button
          disabled={!hasPreviousPage || isFetchingPreviousPage}
          onClick={() => fetchPreviousPage()}
          variant="outline"
        >
          <ChevronUpIcon className="h-4 w-4" />
        </Button>
      </div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page?.map((imagesSet: ImagesSet) => (
            <Link
              className="rounded bg-blue-500 p-4 text-white"
              href={`/game/${game}?date=${imagesSet.createdAt}`}
              key={imagesSet.createdAt}
            >
              {format(imagesSet.createdAt!, 'dd/MM/yyyy')}
            </Link>
          ))}
        </React.Fragment>
      ))}
      <div className="col-span-3 text-center">
        <Button
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChooseSet;
