import React, { PropsWithChildren } from 'react';

import {
  Skeleton,
} from '@chakra-ui/react';

import {
  Table,
} from '@tanstack/react-table';

import { Cell } from '@shared/components/index';
import { Txn } from '@shared/types';

export type LoadingTableProps = PropsWithChildren & {
  table: Table<Txn>
};

export function LoadingTable(props: LoadingTableProps) {

  const { table } = props;

  return (
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

  );
}

