import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Text,
  chakra,
  useColorModeValue,
  useStyleConfig, 
  useRadioGroup,
  HStack,
  useRadio,
  UseRadioProps
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { MdContentCopy } from 'react-icons/md';

import { textStyles } from '@theme/index';

import { getCall } from 'shared/services/api';


type ButtonGroupProps = {
  name: string,
  defaultValue: string,
  value: string,
  onChange: (nextValue: string) => void,
  options: {id: string, text: string}[],
  justifyContent?: any
};

interface ButtonGroupBtnProps extends UseRadioProps {
  children: React.ReactNode
};

export const ButtonGroupBtn = (props: ButtonGroupBtnProps) => {

  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label' margin='0px !important'>
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
        {props.children}
      </Box>
    </Box>
  );
}

export const ButtonGroup = (props: ButtonGroupProps) => {

  const { name, defaultValue, value, onChange, options, justifyContent } = props;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group} flexWrap={{base: 'wrap'}} gap={{base: '10px', md: '10px'}} justifyContent={justifyContent}>
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

export interface ButtonGroupOptions {
  id: string;
  text: string;
}


export const ActionButton = ({href, title, text}: {href: string, title: string, text: string}) => {
  return (
    <Flex mb={4}>
      <Image 
        boxSize='74px'
        borderRadius='12px'
        src="/bitcoin-icon.png" />
      <Box ml={2}>
        <Link href={href} {...textStyles.actionButtonTitle}> { title } </Link>
        <chakra.p {...textStyles.actionButtonText} color={useColorModeValue('gray.600', 'gray.400')}>
          { text }
          <Icon ml={2} as={FiArrowRight} />
        </chakra.p>
      </Box>
    </Flex>
  );
}

export const PrimaryButton = ({
  children,
  onClick
}: {
  children: React.ReactNode,
  onClick: any
}) => {

  return (
    <Button onClick={onClick}> { children } </Button>
  );
}

// TODO: Type for 'props'
export const Widget = (props: any) => {
  const { variant, ...rest} = props;
  const styles = useStyleConfig('Widget', {variant});
  return <Box __css={ styles } {...rest} />;
}

// TODO: Type for 'props'
export const Cell = (props: any) => {
  const { variant, ...rest} = props;
  const styles = useStyleConfig('Cell', {variant});
  return <chakra.td __css={ styles } {...rest} />;
}

export const LoaderOverlay = ({children}: {children: React.ReactNode}) => {
  return (
    <Text
      fontSize='2rem'
      style={{ 
        position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
      }} >
        { children }
      </Text>
  );
}

export const ErrorOverlay = ({children, onReset}: {children: React.ReactNode, onReset: any}) => {
  return (
    <Text
      fontSize='1.2rem'
      style={{ 
        position: 'absolute',
          padding: '16px',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%',
          background: 'rgba(50, 0, 0, 0.9)',
          display: 'block',
          color: 'red',
          lineHeight: '1em',
          whiteSpace: 'break-spaces',
          zIndex: 10,

      }} >
        <b> Error: </b> <br/> <br/>
        { children }
        <br/> <br/>
        <Button onClick={() => { onReset() }}> Retry </Button>
      </Text>
  );
}

export { BuySellWidget } from './BuySellWidget';
export { BitcoinReceiveWidget } from './bitcoin/ReceiveWidget';
export { BitcoinSendWidget } from './bitcoin/SendWidget';
export { BitcoinTxnTable } from './bitcoin/TxnTable';
