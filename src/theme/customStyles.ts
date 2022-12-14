import { SystemStyleObject, SystemStyleObjectRecord } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';

// Helps with typing
const stylesMap = <T extends SystemStyleObjectRecord>(map: T) => map

const baseTextStyles = stylesMap({

  bodyLarge: {
    fontSize: 'clamp(1.25rem, 1.5vw, 1.5rem)',
    lineHeight: 1.4,
    fontWeight: 'normal',
  },
  body: {
    fontSize: 'clamp(1rem, 1.2vw, 1.2rem)',
    lineHeight: 1.5,
    fontWeight: 'normal',
  },
  subText1: {
    fontSize: '1rem',
    lineHeight: 1.5,
    fontWeight: 'normal',
  },
  subText2: {
    fontSize: '0.85rem',
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.33,
  },

  actionButtonTitle: {
    fontSize: { base: '16px', xl: '16px', '2xl': '20px' },
    fontWeight: '600',
    lineHeight: '24px',
  },
  actionButtonText: {
    fontSize: { base: '16px', xl: '16px', '2xl': '20px' },
    fontWeight: '300',
    lineHeight: '16px',
  }
})

export const textStyles = stylesMap({
  ...baseTextStyles,
  bodyBold: {
    ...baseTextStyles.body,
    fontWeight: 'bold',
  },
  bodySemibold: {
    ...baseTextStyles.body,
    fontWeight: 'semibold',
  },
  bodyLargeMedium: {
    ...baseTextStyles.bodyLarge,
    fontWeight: 'medium',
  },
  subText1Medium: {
    ...baseTextStyles.subText1,
    fontWeight: 'medium',
  },
  subText1SemiBold: {
    ...baseTextStyles.subText1,
    fontWeight: 'semibold',
  },
  subText2Medium: {
    ...baseTextStyles.subText2,
    fontWeight: 'medium',
  },
  captionRegular: {
    ...baseTextStyles.caption,
    fontWeight: 'regular',
  },
})

const baseStyles = stylesMap({})

export const styles = stylesMap({
  ...baseStyles,
})
