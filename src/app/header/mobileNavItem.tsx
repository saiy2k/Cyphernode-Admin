import {
  Box,
  Collapse,
  Divider,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { default as NLink } from 'next/link';

import { BiChevronDown } from 'react-icons/bi';

import { NavItem } from './header.data';

export const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <NLink href={href ?? '#'}>
          <Text variant='mainMenuMobile'>
            {label}
          </Text>
        </NLink>
        {children && (
          <Icon
            as={BiChevronDown}
            transform={isOpen ? 'rotate(180deg)' : ''}
            transition={'all .25s ease-in-out'}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => {

              if (child.label === '---') {
                  return <Divider key={child.id} w='20%' borderColor='gray.700' ml={2} />
              }

              return <Link key={child.id} py={2} href={child.href}>
                {child.label}
              </Link>
            })}
        </Stack>
      </Collapse>
    </Stack>
  );
};
