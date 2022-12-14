import { ChakraTheme, cssVar, PartsStyleFunction } from '@chakra-ui/react';
import { getColor, mode, StyleFunctionProps, transparentize } from '@chakra-ui/theme-tools';


const focusBorderColor = '#cdcdcd';
const inputTheme = {
  defaultProps: { focusBorderColor },
  variants: {
    outline: (props: StyleFunctionProps) => ({
      field: {
        rounded: 'full',
        bgColor: mode('white', 'gray.800')(props),
        borderColor: 'gray.300',
        _placeholder: { color: '#cdcdcd' },
        _autofill: {
          boxShadow: '0 0 0px 1000px #F2F2F2 inset',
        },
      },
    }),
  },
}

/*
  Flex: {
    variants: {
      mobileMenu: (props: StyleFunctionProps) => ({
        py:2,
        justify:'space-between',
        align:'center',
        _hover:{
          textDecoration: 'none',
        }
      })
    }
  },
  */


export const components: ChakraTheme['components'] = {

  Button: {
    baseStyle: (props: StyleFunctionProps) => ({
      rounded: 'full',
      color:mode('red', 'blue')(props),
      bg: mode('black', 'white')(props),
    }),
    variants: {
      primary: (props: StyleFunctionProps) => ({
        color:mode('white', 'white')(props),
        bg: mode('red', 'red')(props),
      }),
      outline: (props: StyleFunctionProps) => ({
        whiteSpace: 'normal',
        borderWidth: '2px',
        _hover: {
          borderWidth: '2px solid',
          borderColor: 'black',
          color:mode('white', 'black')(props),
          bg: 'blackAlpha.700',
        },
      }),
      solid: (props: StyleFunctionProps) => ({
        color:mode('white', 'black')(props),
        bg: mode('black', 'white')(props),
        fontWeight: 200,
        _hover: {
          color:mode('black', 'white')(props),
          bg: mode('gray.100', 'black')(props),
          border: '2px solid'
        }
      }),
    },
    defaultProps: {
      variant: 'solid'
    }
  },

  Link: {
    variants: {
      mainMenu: (props: StyleFunctionProps) => ({
        p: 2,
        fontSize:'sm',
        fontWeight:500,
        color:mode('menu.main.light', 'menu.main.dark')(props),
        _hover: {
          textDecoration: 'none',
          color: mode('brand', 'brandAlpha.hover')(props)
        }
      }),
      subMenu: (props: StyleFunctionProps) => ({
        display:'block',
        p:3,
        rounded:'xl',
        _hover:{
          color: mode('menu.sub.light', 'menu.sub.dark')(props),
          bg: mode('menu.sub.dark', 'menu.sub.light')(props), 
        }

      })
    }
  },

  Icon: {
    variants: {
      mainMenu: (props: StyleFunctionProps) => ({
        mt:1,
        _hover:{
          textDecoration: 'none',
          color: mode('brand', 'brandAlpha.hover')(props),
        }
      }),
      mainMenuIconMobile: {
      }
    }
  },

  Text: {
    variants: {
      subMenu: (props: StyleFunctionProps) => ({
        transition:'all .3s ease',
        textDecoration: 'none',
        fontWeight:500,
        _groupHover:{ color: mode('menu.sub.light', 'menu.sub.dark')(props) },
      }),
      mainMenuMobile: (props: StyleFunctionProps) => ({
          fontWeight:600,
          color:mode('gray.600', 'gray.200')(props)
      })
    }
  },

  Input: inputTheme,

  Select: inputTheme,
  'chakra.h3': {
    sizes: {
      sm: { px: '1.125rem' },
      md: { px: '1.125rem' },
      lg: { px: '3.125rem' },
      xl: { px: '3.5rem', fontSize: '3.5rem', minH: '50px' },
    },
  },

  Popover: {
    baseStyle: (props: StyleFunctionProps) => ({
      content: {
        border:1,
        borderColor:mode('menu.border.light', 'menu.border.dark')(props),
        bg:mode('white', 'menu.border.light')(props),
        borderStyle:'solid',
        p: 4,
        rounded:'sm',
        ml:'-21px',
        w:'18em',
      }
    }),
  },

}
