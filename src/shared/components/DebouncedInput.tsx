import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';

import {
  Input,
  InputProps,
} from '@chakra-ui/react';

// A debounced input react component
export type DebouncedInputProps = PropsWithChildren & Omit<InputProps, 'onChange' | 'width'> & {
  value: string | number
  onChange: (value: string | number) => void,
  width?: any,
  debounce?: number,
  disabled?: boolean,
};

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 800,
  ...props
}: DebouncedInputProps ) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if(value !== initialValue) {
        onChange(value);
      }
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input disabled={props.disabled} {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}


