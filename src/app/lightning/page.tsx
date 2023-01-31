'use client';

import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Select,
} from '@chakra-ui/react';
import { SuccessResponse } from '@shared/api.types';
import { Widget } from '@shared/components';
import { TxnDetail } from '@shared/components/bitcoin/TxnTableDetail';
import Filter from '@shared/components/ClientDataTable/Filter';
import ServerDataTable from '@shared/components/ServerDataTable';
import { dummyTxnDataForSkeleton } from '@shared/constants';
import { getCallProxy } from '@shared/services/api';
import { Txn } from '@shared/types';
import { ColumnFilter, ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { SubmitHandler, useForm } from 'react-hook-form';

import { withErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryFallback } from '@shared/components/ErrorBoundaryFallback';


type Inputs = {
  type: string,
  // time: Date[],
  amountMin: number,
  amountMax: number,
  status: string,
};


export default function Lightning() {
  const [ txData, setTxData ] = useState<Txn[]>([]);
  const [ txnDataLoading, setTxnDataLoading ] = useState<boolean>(true);
  const [ pageCount, setPageCount ] = useState(0);
  const [ filters, setFilters ] = useState({});
  const [sorting, setSorting] = useState<SortingState>([{
    id: "time",
    desc: true
  }])

  const formVars = useForm<Inputs>({
    defaultValues: {
      type: "",
      // time: [],
      amountMin: 0,
      amountMax: 0,
      status: "",
    }
  });
  const { register, handleSubmit, formState: { errors }, getValues, setValue, reset, control } = formVars;

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleError = useErrorHandler();

  useEffect(() => {

    setTxnDataLoading(true);

    (async() => {
      console.log('Home :: useEffect :: call API :: txns');
      try {

        const sortColumn = sorting.length === 1 ? sorting[0].id : '';
        const sortDirection = sorting.length === 1 ? sorting[0].desc ? 'DESC' : 'ASC' : '';

        const response = await getCallProxy('txns', { perPage: pageSize, page: pageIndex, ...filters, sortColumn, sortDirection });
        if (!response.ok) {
          const bodyResp = await response.json();
          throw new Error(response.status + ': ' + response.statusText + ': ' + JSON.stringify(bodyResp));
        }
        const txns: SuccessResponse = await response.json();
        setTxData(txns.data);
        setPageCount(txns.meta.pageCount);
        setTxnDataLoading(false);
      } catch(err) {
        setTxnDataLoading(false);
        setTxData([]);
        setPageCount(0);
        handleError(err);
      }
    })();

  }, [pageIndex, pageSize, filters, sorting]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log('Lightning :: onSubmit');
    console.log(data);

    const filters: any = {};

    if(data.type !== '') {
      filters.type = data.type;
    }

    if(Number(data.amountMin) !== 0) {
      filters.amountMin = Number(data.amountMin);
    }

    if(Number(data.amountMax) !== 0) {
      filters.amountMax = Number(data.amountMax);
    }

    if(data.status !== '') {
      filters.status = data.status;
    }

    setFilters(filters);
  }

  const onError = (errors: any, e: any) => {
    console.log('Lightning :: onErorr');
  }


  return (
    <Flex minH='30vh' align='center' justify='center' flexDirection='column'>
      <Box my={10}>
        <h3>
          Lightning page
        </h3>
      </Box>

      <Widget variant='border' width="75%" mb={10}>
          <chakra.form display='flex' flexDirection='row' gap='20px' mt={5} onSubmit={handleSubmit(onSubmit, onError)}>

            <FormControl>
              <FormLabel>Type</FormLabel>
              <InputGroup flexDirection='column' gap='5px'>
                <Select {...register('type')} placeholder="Select a value">
                  <option value="immature">Immature</option>
                  <option value="receive">Receive</option>
                  <option value="send">Send</option>
                  <option value="generate">Generate</option>
                </Select>
              </InputGroup>
            </FormControl>

            {/* <FormControl isInvalid={errors.hasOwnProperty('confirmedCallbackURL')}>
              <FormLabel>Time</FormLabel>
              <InputGroup flexDirection='column' gap='5px'>
              <RangeDatepicker
                selectedDates={getValues().time || []}
                onDateChange={(selectedDateRange: Date[]) => {
                  let dates = selectedDateRange;

                  if(selectedDateRange.length === 1) {
                    dates = [selectedDateRange[0], new Date()];
                  }

                  setValue('time', selectedDateRange)
                }}
              />
              </InputGroup>
            </FormControl> */}

            <FormControl isInvalid={errors.hasOwnProperty('confirmedCallbackURL')}>
              <FormLabel>BTC min</FormLabel>
              <InputGroup flexDirection='column' gap='5px'>
                <Input type='number' {...register('amountMin')} />
              </InputGroup>
            </FormControl>

            <FormControl isInvalid={errors.hasOwnProperty('confirmedCallbackURL')}>
              <FormLabel>BTC max</FormLabel>
              <InputGroup flexDirection='column' gap='5px'>
                <Input type='number' {...register('amountMax')} />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <InputGroup flexDirection='column' gap='5px'>
                <Select {...register('status')} placeholder="Select a value">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                </Select>
              </InputGroup>
            </FormControl>

            <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Filter </Button>

          </chakra.form>
      </Widget>

      <ServerDataTable
        data={txData} 
        dummyDataForSkeleton={dummyTxnDataForSkeleton}
        isLoading={txnDataLoading}
        columnDef={columns}
        columnsToHideInMobile={['txid', 'confirmations']}
        pageCount={pageCount}

        pageIndex={pageIndex}
        pageSize={pageSize}

        sorting={sorting}

        onPaginationChange={setPagination}
        onSortingChange={setSorting}

        DetailComp={TxnDetail}
      />
    </Flex>
  );
}

// TODO: remove  filter from columns
const columns = [{
  id: 'type',
  accessorKey: 'category',
  header: () => <chakra.span> Type </chakra.span>,
  cell: (info: any) => info.getValue(),
  fieldType: 'select',
  options: ["generate", "immature", "receive", "send"],
  width: 'auto',
}, {
  id: 'time',
  accessorKey: 'time',
  header: () => <span> Time </span>,
  cell: (info: any) => new Date((info.getValue() as any) * 1000).toLocaleString(),
  width: 'auto',
}, {
  id: 'amount',
  accessorKey: 'amount',
  header: () => <span> btc </span>,
  cell: (info: any) => (info.getValue() as any).toFixed(8),
  fieldType: 'number',
  width: '150px',
}, {
  id: 'txid',
  accessorKey: 'txid',
  header: () => <span> Tx id </span>,
  cell: (info: any) => (info.getValue() as any).slice(0, 12) + '...',
  enableSorting: false,
  width: 'auto',
}, {
  id: 'confirmations',
  // accessorKey: 'confirmations',
  accessorFn: (row: any) => (Boolean(row.confirmations) && row.confirmations > 0) ?'Confirmed': 'Pending',
  header: () => <span> Status </span>,
  cell: (info: any) => info.cell.row.original.confirmations ===0 ? 'Pending': `Confirmation(${info.cell.row.original.confirmations})`,
  fieldType: 'select',
  options: ["pending", "confirmed"],
  width: 'auto',
}];

// function reduceColumnFilters(columnFilters: ColumnFiltersState) {
//   return columnFilters.reduce((prev: any, cur: ColumnFilter & {value: any}) => {
//     switch(cur.id) {
//       case 'type':
//       prev['type'] = cur.value.toLowerCase();
//         break;
//       case 'time':
//       if(cur.value[0] !== undefined) {
//         prev['start'] = new Date(cur.value[0] * 1000).toISOString();
//       }

//         if(cur.value[1] !== undefined) {
//           prev['end'] = new Date(cur.value[1] * 1000).toISOString();
//         }
//         break;
//       case 'amount':
//       if(cur.value[0]) {
//         prev['amountMin'] = Number(cur.value[0]);
//       }

//         if(cur.value[1]) {
//           prev['amountMax'] = Number(cur.value[1]);
//         }
//         break;
//       case 'confirmations':
//       prev['status'] = cur.value.toLowerCase();
//         break;
//     }

//     return prev;
//   }, {} as any);


// }
