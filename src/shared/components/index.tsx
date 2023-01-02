import React, { MouseEventHandler, PropsWithChildren } from 'react';

import {
  Box,
  BoxProps,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  chakra,
  useColorModeValue,
  useStyleConfig, 
  HTMLChakraProps
} from '@chakra-ui/react';

import { FiArrowRight } from 'react-icons/fi';

import { textStyles } from '@theme/index';

type ActionButtonProps = PropsWithChildren & {
  href: string,
  title: string,
  text: string,
};

export const ActionButton = ({href, title, text}: ActionButtonProps) => {
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

type PrimaryButtonProps = PropsWithChildren & {
  onClick: MouseEventHandler<HTMLButtonElement>,
};

export const PrimaryButton = ({
  children,
  onClick
}: PrimaryButtonProps) => {

  return (
    <Button onClick={onClick}> { children } </Button>
  );
}

export interface WidgetProps extends BoxProps {
  // variant: ThemingProps<any> & Dict<any>;
  variant?: string;
}

export const Widget = (props: WidgetProps) => {
  const { variant, ...rest} = props;
  const styles = useStyleConfig('Widget', {variant});
  return <Box __css={ styles } {...rest} />;
}

export interface CellProps extends HTMLChakraProps<"td"> {
  // variant: ThemingProps<any> & Dict<any>;
  variant?: string;
}
export const Cell = (props: CellProps) => {
  const { variant, ...rest} = props;
  const styles = useStyleConfig('Cell', {variant});
  return <chakra.td __css={ styles } {...rest} />;
}

type LoaderOverlayProps = PropsWithChildren;

export const LoaderOverlay = ({children}: LoaderOverlayProps) => {
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

type ErrorOverlayProps = PropsWithChildren & {
  onReset: MouseEventHandler<HTMLButtonElement>,
};

export const ErrorOverlay = ({children, onReset}: ErrorOverlayProps) => {
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
        <Button onClick={onReset}> Retry </Button>
      </Text>
  );
}

export { BuySellWidget } from './BuySellWidget';
import BitcoinReceiveWidget from './bitcoin/ReceiveWidget';
import BitcoinSendWidget from './bitcoin/SendWidget';
import BitcoinTxnTable from './bitcoin/TxnTable';

export { BitcoinTxnTable, BitcoinSendWidget, BitcoinReceiveWidget };

export {
  type ButtonGroupProps,
  type ButtonGroupBtnProps,
  ButtonGroupBtn,
  ButtonGroup,
  type ButtonGroupOptions
} from './ButtonGroup';
