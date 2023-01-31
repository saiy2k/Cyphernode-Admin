import React, { PropsWithChildren, useRef, useState } from 'react';

import {
  chakra,
  Button,
  Flex,
  Input,
  Select,
} from '@chakra-ui/react';

import { Table } from '@tanstack/react-table';

export type PaginatorProps = PropsWithChildren & {
  table: Table<any>,
  loading?: boolean,
};

export default function Paginator({table, loading}: PaginatorProps) {
  const disabled = loading;
  const [page, setPage] = useState(0);
  const goToRef = useRef<HTMLInputElement>(null);

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
            disabled={disabled}
            size='sm'
            ml={2}
            width='100px'
            type="number"
            value={page}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page);
              setPage(page + 1);

              if((page + 1) > table.getPageCount()) {
                setTimeout(() => {
                  setPage(table.getPageCount());
                }, 1000);
              }
            }}
            ref={goToRef}
            onClick={() => goToRef.current?.select()}
          />
        </span>
        <Select
          disabled={disabled}
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
            disabled={disabled || !table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.previousPage()}
            disabled={disabled || !table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.nextPage()}
            disabled={disabled || !table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={disabled || !table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

