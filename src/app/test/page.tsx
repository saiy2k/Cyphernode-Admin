'use client';

import { useEffect, useState, useMemo } from 'react';

import { Flex, chakra } from '@chakra-ui/react';

import ClientDataTable from '@shared/components/ClientDataTable';
import { ClientCustomColumnDef } from '@shared/types';
import countries from './countries.json';

export default function Test() {

  console.log('Render: Test page');

  const [toggle, setToggle] = useState<boolean>(false);
  const list = useMemo(() => countries.List, [countries.List.length]);

  useEffect(() => {

    let timerId: any = setTimeout(() => {
      console.log('setting toggle ON', timerId);
      setToggle(true);
      timerId = null;
    }, 5000);

    console.log('useEffect :: timer :: ', timerId);

    return () => {
      if (timerId) {
        console.log('useEffect :: clearing timer :: ', timerId);
        clearTimeout(timerId);
      }
    }
  }, []);

  return (
    <Flex minH='30vh' align='center' justify='center'>
      <h3>
        { useMemo(() => <span> { toggle ? <ClientDataTable data={list} columnDef={columns} />: null } </span>, [toggle]) }
      </h3>
    </Flex>
  )
}

type Country = {
  country: string,
  population: number
};

const columns: ClientCustomColumnDef<Country>[] = [{
  id: 'country',
  accessorKey: 'country',
  header: () => <chakra.span> Country </chakra.span>,
  cell: (info: any) => info.getValue(),
  width: 'auto',
  fieldType: 'text',
}, {
  id: 'population',
  accessorKey: 'population',
  header: () => <span> Population </span>,
  cell: (info: any) => info.getValue(),
  width: 'auto',
  fieldType: 'number',
}];


