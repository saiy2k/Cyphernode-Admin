import { Box, Divider } from '@chakra-ui/react'
import { NavItem } from './header.data';

import { Text, Link } from '@chakra-ui/react';

export const DesktopSubNav = ({ label, href }: NavItem) => {

  if (label === '---') {
    return <Box>
      <Divider w='20%' borderColor='gray.700' ml={2} />
    </Box>
  }

  return (
    <Link href={href} role={'group'} variant='subMenu'>
      <Text variant='subMenu'>
        {label}
      </Text>
    </Link>
  );

};
