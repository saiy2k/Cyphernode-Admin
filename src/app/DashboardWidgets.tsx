import {
  chakra,
  Box,
  Icon,
  Image,
  Link,
  useColorModeValue
} from '@chakra-ui/react';

import { FiArrowRight } from 'react-icons/fi';

import { textStyles } from '@theme/index';
import { Widget } from '@shared-components/index';

export const ValueBox = ({
  title,
  children
}: {
  title: string,
  children: React.ReactNode
}) => {

  return (
    <Widget py={4} variant='border'>
      <h4>
        { title }
      </h4>
      <h2>
        { children }
      </h2>
    </Widget>
  );
}

export const WalletBox = ({
  title,
  balance,
  unconfirmedUntrusted,
  unconfirmedTrusted,
  confirmed,
}: {
  title: string,
  balance: number
  unconfirmedUntrusted: number,
  unconfirmedTrusted: number,
  confirmed: number,
}) => {
  return (
    <Box>
      <h4>
        { title }
      </h4>

      <Widget variant='border' mt='1'>
        <h4>
          Bitcoin balance
        </h4>
        <h2>
          { balance } <chakra.span fontSize={{base: '0.5em'}}> BTC </chakra.span>
        </h2>

        <chakra.p color='body.gray.medium' {...textStyles.subText2Medium } mt='2'>
          Unconfirmed Untrusted
        </chakra.p>
        <chakra.h5 {...textStyles.bodyBold}>
          { unconfirmedUntrusted } <chakra.span fontSize={{base: '0.5em'}}> BTC </chakra.span>
        </chakra.h5>

        <chakra.p color='body.gray.medium' {...textStyles.subText2Medium } mt='2'>
          Unconfirmed trusted
        </chakra.p>
        <chakra.h5 {...textStyles.bodyBold}>
          { unconfirmedTrusted } <chakra.span fontSize={{base: '0.5em'}}> BTC </chakra.span>
        </chakra.h5>

        <chakra.p color='body.gray.medium' {...textStyles.subText2Medium } mt='2'>
          Confirmed
        </chakra.p>
        <chakra.h5 {...textStyles.bodyBold}>
          { confirmed } <chakra.span fontSize={{base: '0.5em'}}> BTC </chakra.span>
        </chakra.h5>

        <Link href='#' color='blue' mt='2'>
          Access wallet &gt;&gt;
        </Link>

      </Widget>
    </Box>
  );
}

export const ActionItems = () => {
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
