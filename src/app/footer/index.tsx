'use client';

import logoImage from '../../public/logo.svg';

import { ReactNode } from 'react';
import {
  Box,
  Image,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa';

/**
 * Base code Ref: https://chakra-templates.dev/page-sections/footer
 */
const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.300', 'whiteAlpha.300'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>

          <Stack align={'flex-start'}>
            <Image
              src={useColorModeValue('/logo.svg', '/logo-white.svg')}
              alt="Bull Bitcoin logo"
              width={[160, 240]}
            />
          </Stack>
          <Stack align={'flex-start'}>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Important Links</ListHeader>
            <Link href={'#'}>Home</Link>
            <Link href={'#'}>Buy bitcoin</Link>
            <Link href={'#'}>Sell bitcoin</Link>
            <Link href={'#'}>Pay with bitcoin</Link>
            <Link href={'#'}>About us</Link>
            <Link href={'#'}>Contact us</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Legal</ListHeader>
            <Link href={'#'}>Terms</Link>
            <Link href={'#'}>Privacy</Link>
            <Link href={'#'}>Limits and KYC</Link>
            <Link href={'#'}>Regulations</Link>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}>
          <Text lineHeight='20px'>Powered by Satoshi Portal Inc. © 2022. FINTRAC registration #M16730720</Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Facebook'} href={'https://www.facebook.com/BullBitcoinCa/'}>
              <FaFacebook />
            </SocialButton>
            <SocialButton label={'Twitter'} href={'https://twitter.com/BullBitcoin_'}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={'YouTube'} href={'https://www.youtube.com/channel/UC9acjFaknVIlsMMYwVXtcvQ/videos'}>
              <FaYoutube />
            </SocialButton>
            <SocialButton label={'LinkedIn'} href={'https://www.linkedin.com/company/bull-bitcoin/'}>
              <FaLinkedin />
            </SocialButton>
            <SocialButton label={'Instagram'} href={'https://github.com/SatoshiPortal/cyphernode'}>
              <FaGithub />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
