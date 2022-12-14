import {
  chakra,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  useColorModeValue,
  useStyleConfig 
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';

import { textStyles } from '@theme/index';

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

export { BuySellWidget } from './BuySellWidget';
