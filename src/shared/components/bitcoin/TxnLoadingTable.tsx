import React, { PropsWithChildren } from 'react';

import {
  Flex,
  Icon,
  Skeleton,
} from '@chakra-ui/react';

import { IoChevronDownCircleOutline, IoChevronDownCircle, IoChevronUpCircle } from 'react-icons/io5';
import {
  flexRender,
  Table,
} from '@tanstack/react-table';

import { Widget, Cell } from '@shared/components/index';
import { Txn } from '@shared/types';

export type LoadingTableProps = PropsWithChildren & {
  table: Table<Txn>
};

export function LoadingTable(props: LoadingTableProps) {

  const { table } = props;

  return (
    <Widget variant='border' style={{ position: 'relative', overflowX: 'auto' }}>
      <table>
        <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  // : flexRender(
                  //     header.column.columnDef.header,
                  //     header.getContext()
                  //   )
                  :
                  (
                    <Flex flexDirection='column' gap={'5px'} marginBottom={'15px'}>
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                      style={{textAlign: 'center'}}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {
                        header.column.getCanSort()
                        ? header.column.getIsSorted()
                          ? header.column.getIsSorted() === 'asc'
                            ? <Icon as={IoChevronUpCircle} />
                            : <Icon as={IoChevronDownCircle} />
                          : <Icon as={IoChevronDownCircleOutline} />
                        : null
                      }
                    </div>
                    {header.column.getCanFilter() ? (
                      <Skeleton key={header.id} borderRadius='10px' height='30px' padding='10px'></Skeleton>
                    ) : null}
                  </Flex>
                  )
                }
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row, index: number) => (

          <React.Fragment key={row.id}>
            <tr>
              {row.getVisibleCells().slice(0, -1).map(cell => (
                <Cell id={cell.id} key={cell.id} padding='10px'>
                  <Skeleton borderRadius='10px' height='30px'></Skeleton>
                </Cell>
              ))}
            </tr>
          </React.Fragment>

        ))}
      </tbody>
    </table>
  </Widget>

  );
}

