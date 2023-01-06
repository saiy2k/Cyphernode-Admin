import {Flex, Image} from "@chakra-ui/react";

export default function PageLoader({text = 'Loading...'}: {text: string}) {
  return (<Flex height='80vh' width='100%' justifyContent='center' alignItems='center' fontSize={{ base: '1.5em', lg: '2em'}} direction='column'>
    {text}
    { /*
    <Image src='/bitcoin-loader.gif' width={80} height={80} />
       */ }
  </Flex>);
}
