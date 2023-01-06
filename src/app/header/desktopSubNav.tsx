import { Box, Divider } from '@chakra-ui/react'

import { Text, Link } from '@chakra-ui/react';
import { default as NLink } from 'next/link';

import { NavItem } from './header.data';

export const DesktopSubNav = ({ label, href }: NavItem) => {

  if (label === '---') {
    return <Box>
      <Divider w='20%' borderColor='gray.700' ml={2} />
    </Box>
  }

  return (
    <Link as='span' role={'group'} variant='subMenu'>
      <NLink href={href ?? '#'} prefetch={false}>
        <Text variant='subMenu'>
          {label}
        </Text>
      </NLink>
    </Link>
  );

};
