import React, { PropsWithChildren } from 'react';

import {
  Box, BoxProps,
  HStack, StackProps,
  useRadio, useRadioGroup, UseRadioGroupProps, UseRadioProps
} from '@chakra-ui/react';

export interface ButtonGroupOptions {
  id: string;
  text: string;
}

export type ButtonGroupBtnProps = PropsWithChildren & UseRadioProps & BoxProps;

export const ButtonGroupBtn = (props: ButtonGroupBtnProps) => {

  const { children, isChecked ,...rest } = props;

  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label' margin='0px !important' {...rest}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='50px'
        borderColor='black'
        _checked={{
          bg: 'black',
          color: 'white',
          borderColor: 'black',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={'10px'}
        py={'3px'}
      >
        {children}
      </Box>
    </Box>
  );
}

export type ButtonGroupProps = UseRadioGroupProps & Omit<StackProps, 'onChange'> & {
  value: string,
  options: ButtonGroupOptions[],
  justifyContent?: any
};

export const ButtonGroup = (props: ButtonGroupProps) => {

  const { name, defaultValue, value, onChange, options, justifyContent, ...rest } = props;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group} {...rest} flexWrap={{base: 'wrap'}} gap={{base: '10px', md: '10px'}} justifyContent={justifyContent}>
      {options.map((value) => {
        const radio = getRadioProps({ value: value.id })
        return (
          <ButtonGroupBtn key={value.id} {...radio}>
            {value.text}
          </ButtonGroupBtn>
        )
      })}
    </HStack>
  )

}

