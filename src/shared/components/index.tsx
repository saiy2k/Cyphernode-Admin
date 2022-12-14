import { useState, useEffect } from 'react';
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
  useStyleConfig 
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { MdContentCopy } from 'react-icons/md';

import { textStyles } from '@theme/index';

import { getCall } from 'shared/services/api';

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

export const BitcoinSendWidget = () => {
  return (
    <>
      <chakra.h3 mt={5}>
        Action Items
      </chakra.h3>
      <Link href='#' color={useColorModeValue('#4EA0DB', '#4EA0DB')}>
        Verify identity
        <Icon ml={1} as={FiArrowRight} />
      </Link>
      <Link href='#' color={useColorModeValue('#4EA0DB', '#4EA0DB')}>
        Join the mission program
        <Icon ml={1} mt={1} as={FiArrowRight} />
      </Link>
    </>
  )
}

// TODO: Type for 'props'
export const Widget = (props: any) => {
  const { variant, ...rest} = props;
  const styles = useStyleConfig('Widget', {variant});
  return <Box __css={ styles } {...rest} />;
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
