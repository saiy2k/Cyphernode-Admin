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
import SideMenu from './SideMenu';

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

      <body className={inter.className} style={{overflow: 'hidden'}}>
        <Flex flexDirection="column" height="100vh" overflowY='hidden'>
          { /* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */ }
          <ChakraProvider theme={theme}>
            <Header />

            <Flex w='100%' height='100%' flex='auto'>

              <SideMenu />

              <Box flex={7} overflowY='auto'>
                <Box marginX='auto' maxW={{base: '100%', xxxl: '80%'}}>
                  {children}
                </Box>
                <Footer />
              </Box>
            </Flex>
          </ChakraProvider>
        </Flex>
      </body>

      {/*
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
        */ }
    </html>
  )
}
