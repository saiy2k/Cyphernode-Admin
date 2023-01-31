'use client';

import { 
  Box,
  ChakraProvider,
  ColorModeScript,
  Flex,
} from '@chakra-ui/react'

// import { Header } from "@sp/web/index";
// import { NAV_ITEMS, MOBILE_NAV_ITEMS } from "./header/header.data";
import Header from './header';
import Footer from './footer';
import './globals.css'

import { inter, getBullBitcoinTheme } from '@theme/index';
import SideMenu from './SideMenu';
import { createContext, MutableRefObject, useRef } from 'react';

const theme = getBullBitcoinTheme();

const ContentContainerRefContext = createContext<null | MutableRefObject<any>>(null);
export { ContentContainerRefContext };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contentContainerRef = useRef(null);
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={inter.className} style={{overflow: 'hidden'}}>
        <Flex flexDirection="column" height="100vh" overflowY='visible'>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <ChakraProvider theme={theme}>

            <Header />
            { /*<Header desktopNav={NAV_ITEMS} mobileNav={MOBILE_NAV_ITEMS} /> */ }

            <Flex w='100%' height='100%' flex='auto'>

              <SideMenu />

              <Box flex={7} overflowY='auto' id='content-container' ref={contentContainerRef}>
                <ContentContainerRefContext.Provider value={contentContainerRef}>
                  <Box marginX='auto' maxW={{base: '100%', xxxl: '80%'}}>
                    {children}
                  </Box>
                  <Footer />
                </ContentContainerRefContext.Provider>
              </Box>
            </Flex>
          </ChakraProvider>
        </Flex>
      </body>

    </html>
  )
}
