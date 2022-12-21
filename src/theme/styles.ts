import { ChakraTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';

export const styles: ChakraTheme['styles'] = {
  global: (props: any) => ({
    body: {
      color: mode('gray.700', 'whiteAlpha.900')(props),
      fontSize: ['1rem', '1.125rem'],
    },

    h2: {
      fontSize: { base: '24px', xl: '24px', xxl: '32px' },
      fontWeight: 700,
      lineHeight: { base: '40px', xl: '36px', xxl: '48px'},
    },

    h3: {
      fontSize: { base: '18px', xl: '24px', xxl: '32px' },
      fontWeight: 300,
      lineHeight: { base: '24px', xl: '36px', xxl: '48px' },
    },

    h4: {
      fontSize: { base: '14px', xl: '18px', xxl: '24px' },
      fontWeight: 300,
      lineHeight: { base: '20px', xl: '30px', xxl: '40px' },
    },

    p: {
      fontSize: { base: '12px', xl: '14px', xxl: '16px' },
      fontWeight: 400,
      lineHeight: { base: '10px', xl: '14px', xxl: '18px'},
    },

    table: {
      w: '100%'
    },

    th: {
      textAlign: 'left',
      fontWeight: 'none'
    },

    tr: {
      borderBottom: '1.5px solid',
      borderColor: '#cccccc'
    }

  })
}

/*
export const styles: ChakraTheme['styles'] = {
  global: {
    body: {
      color: 'gray.700',
      fontSize: ['1rem', '1.125rem'],
    },
    // @chakra-ui/css-reset includes styles to hide hugly focus rings for mouse users
    // when focus-visible polyfill is installed. See: https://github.com/chakra-ui/chakra-ui/tree/main/packages/css-reset#disabling-border-for-non-keyboard-interactions
    // But the included styles does not cover the custom checkboxes and radio. This is a hackish solution fixes it.
    '[data-js-focus-visible] [data-focus]:not([data-focus-visible-added])': {
      outline: 'none',
      boxShadow: 'none',
    },
    '[data-js-focus-visible] [data-focus-visible-added]+[data-focus]': {
      outline: 'none',
      boxShadow: 'var(--chakra-shadows-outline)',
    },
    '@media print': {
      '.noPrint': { display: 'none' },
    },
  },
}
*/
