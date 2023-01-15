import React, { PropsWithChildren } from 'react';

import { Skeleton } from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';

import { Cell } from '@shared/components/index';

export type SkeletonTableProps = PropsWithChildren & {
  table: Table<any>
};

export function SkeletonTable(props: SkeletonTableProps) {

  const { table } = props;

  return (
    <tbody>
      {table.getRowModel().rows.map((row, index: number) => (

        <React.Fragment key={row.id}>
          <tr>
            {row.getVisibleCells().slice().map(cell => (
              <Cell id={cell.id} key={cell.id} padding='10px'>
                <Skeleton borderRadius='10px' height='30px'></Skeleton>
              </Cell>
            ))}
          </tr>
        </React.Fragment>

      ))}
    </tbody>

  );
}

