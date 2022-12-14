import { useState } from 'react';
import { 
  Box,
  Button,
  chakra,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Radio, 
  RadioGroup, 
  Select,
  Stack,
  useColorModeValue} from '@chakra-ui/react'

export const BuySellWidget = () => {

  return (
    <Tabs isFitted w='full' border={1} borderStyle='solid' borderColor='gray.400' borderRadius={25}>
      <TabList>
        <Tab _selected={{ borderBottom: '6px', borderColor: useColorModeValue('gray.700', 'gray.50'), borderStyle: 'solid' }}> Buy Bitcoin </Tab>
        <Tab _selected={{ borderBottom: '6px', borderColor: useColorModeValue('gray.700', 'gray.50'), borderStyle: 'solid' }}> Sell Bitcoin </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <BuyWidget />
        </TabPanel>

        <TabPanel>
          <SellWidget />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}


export const BuyWidget = () => {

  const [value, setValue] = useState('1')

  return (

    <Stack m={5}>
      <form>
        <RadioGroup onChange={setValue} value={value} mb={5}>
          <Radio size='lg' colorScheme='red' value='0'>
            <chakra.p color='gray.400'>
              Available CAD funds
            </chakra.p>
            <chakra.h4 fontWeight={700}>
              $23,230.28 <chakra.span fontSize={{base: '10px', xl: '12px' }}> CAD </chakra.span>
            </chakra.h4>
          </Radio>

          <Radio size='lg' colorScheme='red' value='1'>
            <chakra.p color='gray.400'>
              Available MXN funds
            </chakra.p>
            <chakra.h4 fontWeight={700}>
              $3,12,934.28 <chakra.span fontSize={{base: '10px', xl: '12px' }}> MXN </chakra.span>
            </chakra.h4>
          </Radio>
        </RadioGroup>

        <chakra.p color='gray.400' mb={1}>
          Amount you send (icon)
        </chakra.p>
        <InputGroup mb={3}>
          <Input placeholder='Enter amount to buy' size='md' />
          <InputRightElement as='p' mr={4}> CAD </InputRightElement>
        </InputGroup>

        <chakra.p color='gray.400' mb={1}>
          Amount you receive (icon)
        </chakra.p>
        <InputGroup mb={3}>
          <Input placeholder='Enter amount to receive' size='md' />
          <InputRightElement as='p' mr={4}> BTC </InputRightElement>
        </InputGroup>


        <chakra.p color='gray.400' mb={1}>
          Add recipient address
        </chakra.p>
        <InputGroup mb={8}>
          <Input placeholder='Paste your address' size='md' />
          <InputRightElement as='p' mr={4}> Scan </InputRightElement>
        </InputGroup>

        <Box mb={8}>
          <Link href='#' color={useColorModeValue('blue', 'cyan')} textDecor='underline'>Use Lightning Network</Link>
        </Box>

        <Box mb={8} textAlign='center'>
          <Button colorScheme='blue' px={50}> Preview </Button>
        </Box>
      </form>

    </Stack>
  );

}

export const SellWidget = () => {
  return (
    <Stack m={5}>

      <chakra.p color='gray.400' mb={1}>
        We convert any btc amount that is sent to provided address. And your cash balance is incremented accordingly.
      </chakra.p>
      <br/>

      <chakra.p color='gray.400' mb={1}>
        Select currency
      </chakra.p>
      <Select size='lg' placeholder='Select currency'>
        <option value='option1'> Canadian Dollars - CAD </option>
        <option value='option2'> Mexican pesos - MXN </option>
      </Select>
      <br/>

      <chakra.p color='gray.400' mb={1}>
        Bitcoin price - quote expires in 30 seconds (timer)
      </chakra.p>
      <chakra.h3 mb={5}>
        $21,192.00 CAD
      </chakra.h3>
      <br/>

      <chakra.p color='gray.400' mb={1}>
        Trade status
      </chakra.p>
      <chakra.h4 mb={5}>
        Awaiting payment
      </chakra.h4>
      <br/>

      <Tabs isFitted w='full'>
        <TabList>
          <Tab _selected={{ borderBottom: '6px', borderColor: useColorModeValue('gray.700', 'gray.50'), borderStyle: 'solid' }}> Bitcoin </Tab>
          <Tab _selected={{ borderBottom: '6px', borderColor: useColorModeValue('gray.700', 'gray.50'), borderStyle: 'solid' }}> Lightning </Tab>
        </TabList>

        <TabPanels>

          <TabPanel>
            <Stack>

              <chakra.p color='gray.400' mb={1}>
                Send bitcoin to this address
              </chakra.p>

              <b> bc19dsksiamdjaluekdmsdjfk293u5mksmd </b>

              <chakra.p color='gray.400' mt={1}>
                or Scan this QR code
              </chakra.p>

              <Image src='/qrcode.png' />

            </Stack>
          </TabPanel>

          <TabPanel>
            <Stack>

              <chakra.p color='gray.400' mb={1}>
                Send bitcoin to this lightning address
              </chakra.p>

              <b> satoshi@bullbitcoin.com </b>

              <chakra.p color='gray.400' mt={1}>
                or Scan this LNURL-Pay code
              </chakra.p>

              <Image src='/qrcode.png' />

            </Stack>
          </TabPanel>

        </TabPanels>
      </Tabs>

    </Stack>
  );
}
