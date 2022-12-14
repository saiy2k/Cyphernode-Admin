'use client';

import { 
  Box,
  ChakraProvider,
  ColorModeScript,
  Flex,
  SimpleGrid
} from '@chakra-ui/react'


import Header from './header';
import Footer from './footer';
import './globals.css'

import { inter, getBullBitcoinTheme } from '@theme/index';

const theme = getBullBitcoinTheme();


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={inter.className}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <Header />

          <Flex w='100%' maxW='1600px' m='auto'>

            <Box display={{ base: 'none', lg: 'flex'}} flexDirection='column' p={5} w='320px' bg='gray.100'>
              Side menu
            </Box>

            <Flex direction='column' flex='auto'>
              {children}
            </Flex>
          </Flex>
          <Footer />
        </ChakraProvider>
      </body>
    </html>
  )
}
