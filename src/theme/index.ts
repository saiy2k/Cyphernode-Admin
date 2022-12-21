import { defineStyleConfig, ChakraTheme, DeepPartial, extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'; import { Inter } from '@next/font/google';

import { colors } from './colors';
import { components } from './components';
import { styles } from './styles';
import { textStyles } from './customStyles';

const Widget = defineStyleConfig({
  baseStyle: {
    p: 5
  },
  variants: {
    border: {
      border:'1px',
      borderStyle:'solid',
      borderRadius:'20',
      borderColor:'gray.400'
    }
  }
});

const Cell = defineStyleConfig({
  baseStyle: {
    py: 2,
    ...textStyles.body

  },
  variants: {
    border: {
      border:'1px',
      borderStyle:'solid',
      borderRadius:'20',
      borderColor:'gray.400'
    }
  }
});


// This function creates a set of function that helps us create multipart component styles.
const popoverHelpers = createMultiStyleConfigHelpers(['Popover', 'PopoverContent'])
export const Popover = popoverHelpers.defineMultiStyleConfig({
    baseStyle: (props: StyleFunctionProps) => ({
      Popover: {
        border:1,
      },
      PopoverContent: {
        border:50,
        borderColor:mode('gray.800', 'gray.700')(props),
        bg:mode('white', 'gray.800')(props),
        borderStyle:'solid',
        p: 4,
        rounded:'sm',
        ml:'-21px',
        w:'18em',
      }
    })
});

const theme: DeepPartial<ChakraTheme> = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false, // ! important, if true this will override the initialColorMode on client side initial causing a flash
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif",
  },
  styles,
  colors,
  components: {
    ...components,
    Widget,
    Cell,
    // Popover
  },
  breakpoints: { // From bootstrap 5.x
    base: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px',
    xxxl: '2560px',
  }
}

export function getBullBitcoinTheme(
  themeAdditions: DeepPartial<ChakraTheme> = {},
): ReturnType<typeof extendTheme> {
  return extendTheme(withDefaultColorScheme({ colorScheme: 'white' }), theme, themeAdditions)
}

export const inter = Inter({
  subsets: ['latin']
})

export * from './customStyles'

