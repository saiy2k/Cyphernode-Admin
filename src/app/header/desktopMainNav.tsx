import {
  Box,
  Stack,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
} from '@chakra-ui/react';

import { BiChevronDown } from 'react-icons/bi';

import { DesktopSubNav } from './desktopSubNav';

export const DesktopMainNav = ({href, children, label, icon, iconSize}: any) => {
  const linkColor = useColorModeValue('black', 'gray.200');
  const linkHoverColor = useColorModeValue('brand', 'brandAlpha.hover');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.800', 'gray.700');

  return (
    <Popover trigger={'hover'} placement={'bottom-start'} id={'popover'} isLazy>
      <PopoverTrigger>

        { icon ?
          <Link> 
            <Icon as={icon} w={iconSize} h={iconSize} variant='mainMenu' />
          </Link>
          :
          <Link href={href ?? '#'} variant='mainMenu'>
            {label} {children && (<Icon as={ BiChevronDown } mb='-0.5' w={4} h={4} />) }
          </Link>}

      </PopoverTrigger>

      {children && (
        <PopoverContent>
          <Stack>
            {children.map((child: any) => (
              <DesktopSubNav key={child.id} {...child} />
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  );
};

