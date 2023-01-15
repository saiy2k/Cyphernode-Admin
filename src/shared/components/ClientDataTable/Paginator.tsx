import React, { PropsWithChildren } from 'react';

import {
  chakra,
  Button,
  Flex,
  Input,
  Select,
} from '@chakra-ui/react';

import { Table } from '@tanstack/react-table';

export type PaginatorProps<T> = PropsWithChildren & {
  table: Table<T>
};

export default function Paginator<T>({table}: PaginatorProps<T>) {
  return (
    <>
      <Flex flexDirection={{base: 'column-reverse', md: 'row'}} my={2} w='100%' justifyContent='end' alignItems={{base: 'flex-start',md: 'center'}} gap={5} marginTop={'25px'}>

        <chakra.span justifySelf='start'>
          <span>Page: </span>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </chakra.span>

        <span className="flex items-center gap-1">
          Go to
          <Input
            size='sm'
            ml={2}
            width='100px'
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
          />
        </span>
        <Select
          size='sm'
          w='120px'
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 25, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>

        <Flex gap={2}>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

