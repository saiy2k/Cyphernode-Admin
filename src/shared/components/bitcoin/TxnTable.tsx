import React, { useMemo, useState } from 'react';
import {
  chakra,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useClipboard } from '@chakra-ui/react'

import { MdExpandMore, MdExpandLess } from 'react-icons/md';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table,
  useReactTable,
} from '@tanstack/react-table';

import { Widget, Cell, LoaderOverlay, ErrorOverlay } from '@shared/components/index';
import { Txn } from '@shared/types';
import { TxnDetail } from './TxnTableDetail';

export const BitcoinTxnTable = ({data}: {data: Txn[]}) => {

  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const columns = useMemo<ColumnDef<Txn>[]>(() => [{
    accessorKey: 'category',
    header: () => <chakra.span> Type </chakra.span>,
    cell: info => info.getValue(),
  }, {
    accessorKey: 'time',
    id: 'time',
    header: () => <span> Time </span>,
    cell: info => new Date((info.getValue() as any) * 1000).toLocaleString(),
  }, {
    accessorKey: 'amount',
    header: () => <span> btc </span>,
    cell: info => (info.getValue() as any).toFixed(8),
  }, {
    accessorKey: 'txid',
    header: () => <span> Tx id </span>,
    cell: info => (info.getValue() as any).slice(0, 12) + '...',
  }, {
    accessorKey: 'confirmations',
    header: () => <span> Status </span>,
    cell: info => info.getValue() === 0 ? 'pending': `confirmed (${info.getValue()})`,
  }, {
    id: 'actions',
    cell: props => props.row.index === selectedRowIndex ? <Icon as={MdExpandMore} w={6} h={6} />: <Icon as={MdExpandLess} w={6} h={6} />

  }], [selectedRowIndex]);


  const toast = useToast();

  const onClipboardCopy = () => {
    toast({
      title: 'Copied...',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const table = useReactTable({
    data,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <Widget variant='border' style={{ position: 'relative' }}>
      <table>

        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, index: number) => (

            <React.Fragment key={row.id}>
              <tr onClick={ () => selectedRowIndex === index ? setSelectedRowIndex(-1) : setSelectedRowIndex(index) } style={{ 'cursor': 'pointer' }}>
                {row.getVisibleCells().map(cell => (
                  <Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Cell>
                ))}
              </tr>

              { index === selectedRowIndex ? <tr>
                <td colSpan={5}>
                  <TxnDetail row={row} />
                </td>
              </tr>: null}

            </React.Fragment>

          ))}
        </tbody>

      </table>

      <Paginator table={table} />

    </Widget>
  )
}

const Paginator = ({table}: {table: Table<any>}) => {
  return (
    <>
      <Flex my={2} w='100%' justifyContent='end' alignItems='center' gap={5}>

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
          {[2, 3, 5, 10, 20, 30, 40, 50].map(pageSize => (
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

      <div>{table.getRowModel().rows.length} Rows</div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
    </>
  );
}
