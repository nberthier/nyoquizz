'use client';

import type { ColumnDef, SortingState } from '@tanstack/react-table';

import { actions } from '@/app/actions';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';
import { redirect } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type ImageStatWithImage = {
  createdAt: null | number;
  id: string;
  image: {
    champion: null | string;
    createdAt: null | number;
    game: null | string;
    id: string;
    link: string;
    type: string;
    updatedAt: null | number;
  };
  imageId: string;
  isResolved: boolean;
  numberOfTries: number;
  updatedAt: null | number;
  userId: string;
};

export default function History() {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect('/');
  }

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<Array<ColumnDef<ImageStatWithImage>>>(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        cell: (info) => format(info.getValue<number>(), 'PPP'),
        header: () => <span>Date played</span>,
        id: 'date',
        meta: {
          style: {
            textAlign: 'center',
          },
        },
        size: 200,
      },
      {
        accessorFn: (row) => row.image.link,
        cell: (info) => (
          <CldImage
            alt="Champion image"
            className="aspect-video rounded"
            height={200}
            src={info.getValue<string>()}
            width={400}
          />
        ),
        header: () => <span>Image</span>,
        id: 'image',
        meta: {
          style: {
            textAlign: 'center',
          },
        },
        size: 200,
      },
      {
        accessorFn: (row) => row.image.champion,
        cell: (info) => _.capitalize(info.getValue<string>()),
        header: () => <span>Champion</span>,
        id: 'answer',
        meta: {
          style: {
            textAlign: 'center',
          },
        },
        size: 200,
      },
      {
        accessorFn: (row) => row.numberOfTries,
        cell: (info) => info.getValue(),
        header: () => <span>No of tries</span>,
        id: 'numberOfTries',
        meta: {
          style: {
            textAlign: 'center',
          },
        },
        size: 200,
      },
      {
        accessorFn: (row) => row.isResolved,
        cell: (info) => {
          if (info.getValue()) {
            return <CheckIcon color="green" />;
          } else {
            return <Cross2Icon color="red" />;
          }
        },
        header: () => <span>Resolved</span>,
        id: 'resolved',
        meta: {
          style: {
            textAlign: 'center',
          },
        },
        size: 200,
      },
    ],
    []
  );

  const [imageStats, setImageStats] = useState<Array<ImageStatWithImage>>([]);

  const table = useReactTable({
    columns,
    data: imageStats,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 34,
    getScrollElement: () => parentRef.current,
    overscan: 20,
  });

  useEffect(() => {
    const getImageStats = async () => {
      const imageStatsHistory = await actions.imageStats.getUserHistory(
        session.user.id
      );
      setImageStats(imageStatsHistory);
    };
    getImageStats();
  }, [session.user.id]);

  return (
    <div className="my-8 h-full grow justify-center">
      <div
        className="container"
        ref={parentRef}
        style={{
          height: `80vh`,
          overflow: 'auto',
          width: `100vh`,
        }}
      >
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        colSpan={header.colSpan}
                        key={header.id}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {virtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          align={cell.column.columnDef.meta?.style.textAlign}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
