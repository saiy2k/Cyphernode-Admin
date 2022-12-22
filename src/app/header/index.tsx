'use client';

import { Image, useColorMode } from '@chakra-ui/react'
import { HiBell } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';
import { BsSunFill } from 'react-icons/bs';
import { BsMoonFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GrClose } from 'react-icons/gr';

import {
  Box,
  Flex,
  Icon,
  IconButton,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

import { DesktopMainNav } from './desktopMainNav';
import { MobileNavItem } from './mobileNavItem';
import { NAV_ITEMS, USER_NAV_ITEMS } from './header.data';

/**
 * Base code Ref: https://chakra-templates.dev/navigation/navbar
 *
 * [Issue] Warning: Prop id did not match. Server: "popover-trigger-[n1]" Client: "popover-trigger-[n2]"
 * [Solution] https://github.com/chakra-ui/chakra-ui/issues/3020#issuecomment-949808770
 * Usage of 'id' and 'isLazy' in <Popover>
 *
 * [Issue] Warning: Portal: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.
 * [Solution] https://github.com/chakra-ui/chakra-ui/issues/7057
 * PR on it's way. Ignore for now.
 */
export default function WithSubnavigation() {

  const { isOpen, onToggle } = useDisclosure({ id: 'main' });
  const { isOpen: isUserOpen, onToggle: onUserToggle } = useDisclosure({ id: 'user' });

  console.log('WithSubnavigation :: isOpen ::', isOpen, isUserOpen);

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'bg.light')}
        color={useColorModeValue('text.light', 'white')}
        minH={'60px'}
        py={{ base: 6 }}
        px={{ base: 6 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('main.dark', 'gray.900')}
        align={'center'}>

        <Flex justify={{ base: 'start', md: 'start' }} color={useColorModeValue('gray.800', 'gray.200')}>
          <h1> Cyphernode admin </h1>
          { /*
          <Image
            src={useColorModeValue('/logo.svg', '/logo-white.svg')}
            alt="Bull Bitcoin logo"
            width={[120, 160]}
          />
             */ }
        </Flex>

        <Stack
          flex={{ base: 1 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>

          <Flex display={{ base: 'flex', lg: 'none' }} alignItems='center' justify={'flex-end'}>
            <MobileNav isOpen={isOpen} onToggle={onToggle} isUserOpen={isUserOpen} onUserToggle={onUserToggle} />
          </Flex>

          <Flex display={{ base: 'none', lg: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>

        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNavItems />
      </Collapse>

      <Collapse in={isUserOpen} animateOpacity>
        <MobileUserItems />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Stack direction={'row'} spacing={4} alignItems='center'>
      {NAV_ITEMS.map((navItem) => (
        <DesktopMainNav key={navItem.id} {...navItem} />
      ))}

      <DesktopMainNav icon={HiBell} iconSize={6} href="#" label="Notification"></DesktopMainNav>
      
      <DesktopMainNav icon={FaUser} iconSize={5} href="#" label="User">{USER_NAV_ITEMS}</DesktopMainNav>

      <IconButton 
        onClick={toggleColorMode} 
        icon={colorMode === 'light' ? <BsMoonFill /> : <BsSunFill /> }
        variant={'ghost'}
        mx={0}
        aria-label="Toggle theme"
        _hover={{
          textDecoration: 'none',
          color: useColorModeValue('brand', 'brandAlpha.hover'),
        }} />

    </Stack>
  );
};


type MobileNavProps = {
  isOpen: boolean,
  onToggle: any,
  isUserOpen: boolean,
  onUserToggle: any
}
const MobileNav = ({ isOpen, onToggle, isUserOpen, onUserToggle }: MobileNavProps) => {

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <IconButton
        onClick={() => {
          console.log('Toggle 1');
          onToggle();
          if (isUserOpen) {
            onUserToggle();
          }
        }}
        icon={
          isOpen ? <Icon as={GrClose} w={3} h={3} /> : <Icon as={GiHamburgerMenu} w={5} h={5} />
        }
        variant={'ghost'}
        aria-label={'Toggle Navigation'}
      />

      <IconButton
        icon={<Icon as={HiBell} w={6} h={6} />}
        variant={'ghost'}
        aria-label={'Toggle Notification'}
      />
      
      <IconButton
        onClick={() => {
          onUserToggle();
          if (isOpen) {
            onToggle();
          }
        }}
        icon={
          isUserOpen ? <Icon as={GrClose} w={3} h={3} /> : <Icon as={FaUser} w={5} h={5} />
        }
        variant={'ghost'}
        aria-label={'Toggle Notification'}
      />

      <IconButton 
        onClick={toggleColorMode} 
        icon={colorMode === 'light' ? <BsMoonFill /> : <BsSunFill /> }
        variant={'ghost'}
        mx={0}
        aria-label="Toggle theme"
        _hover={{
          textDecoration: 'none',
          color: useColorModeValue('brand', 'brandAlpha.hover'),
        }} />
    </>
  )
}

const MobileNavItems = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ lg: 'none' }}>

      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.id} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileUserItems = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ lg: 'none' }}>

      {USER_NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.id} {...navItem} />
      ))}
    </Stack>
  );
}



