import {
  Stack,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react';
import { default as NLink } from 'next/link';

import { BiChevronDown } from 'react-icons/bi';

import { DesktopSubNav } from './desktopSubNav';

export const DesktopMainNav = ({href, children, label, icon, iconSize}: any) => {

  return (
    <Popover trigger={'hover'} placement={'bottom-start'} id={'popover'} isLazy>
      <PopoverTrigger>

        { icon ?
          <NLink href={href ?? '#'}> 
            <Icon as={icon} w={iconSize} h={iconSize} variant='mainMenu' />
          </NLink>
          :
          <Link variant='mainMenu' as='span'>
            <NLink href={href ?? '#'}>
              {label} {children && (<Icon as={ BiChevronDown } mb='-0.5' w={4} h={4} />) }
            </NLink>
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
