'use client';

import { useContext, useEffect, useMemo, useState } from 'react';

import { Box, Button, Flex, useToast } from '@chakra-ui/react';

import { 
  BitcoinWatchTable,
  Widget
} from '@shared/components/index';
import WatchForm from '@shared/components/bitcoin/WatchForm';
import { useErrorHandler } from 'react-error-boundary';
import { Watch, WatchAddressPayload, WatchXPubPayload } from '@shared/types';
import { getCallProxy, postCallProxy } from '@shared/services/api';
import { ContentContainerRefContext } from 'app/layout';
const emptyArray: Watch[] = [];

export default function Watches() {

  console.log('Render: Bitcoin watches page');

  const [showWatchForm, setShowWatchForm] = useState<boolean>(false);

  const [ watchAddressData, setWatchAddressData ] = useState<Watch[]>(emptyArray);
  const [ watchXpubData, setWatchXpubData ] = useState<Watch[]>(emptyArray);
  const [ addressDataLoading, setAddressDataLoading ] = useState<boolean>(true);
  const [ xpubDataLoading, setXpubDataLoading ] = useState<boolean>(true);

  const handleError = useErrorHandler();

  const toast = useToast();

  const contentContainerRefContext = useContext(ContentContainerRefContext)

  async function getWatches(type: ("address" | "xpub")) {
    try {

      const endpoint = type === "address" ? "getactivewatches/1000": "getactivexpubwatches/1000";

      const response = await getCallProxy(endpoint);
      if (!response.ok) {
        const bodyResp = await response.json();
        throw new Error(response.status + ': ' + response.statusText + ': ' + JSON.stringify(bodyResp));
      }
      const watches = await response.json();
      // console.log(watches);
      return watches.watches
    } catch(err) {
      handleError(err);
      return emptyArray;
    }
  }

  async function getAndSetAddressWatches() {
    setAddressDataLoading(true);
    const addressWatches = await getWatches("address");
    setWatchAddressData(addressWatches);
    setAddressDataLoading(false);
  }

  async function getAndSetXPubWatches() {
    setXpubDataLoading(true);
    const xpubWatches = await getWatches("xpub");
    setWatchXpubData(xpubWatches);
    setXpubDataLoading(false);
  }

  async function getAndSetData() {
    getAndSetAddressWatches();
    getAndSetXPubWatches();
  }

  useEffect(() => {
    (async() => {
      getAndSetData();
    })();
  }, []);

  const scrollToTop = () => {
    if(contentContainerRefContext && contentContainerRefContext.current) {
      contentContainerRefContext.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  return (
    <Widget>
      <Flex justifyContent='end' flexDirection={{base: 'column', sm: 'row'}} gap={{base: 10}} >
          <Button width={{base: '50%', sm: 200}} h={12} onClick={() => setShowWatchForm(!showWatchForm) }> + Add a watch </Button>
      </Flex>

      <Box display='flex' flexDirection='column' gap='30px' marginTop={'30px'} marginX='auto' maxWidth={{base: '100%', xl: '80%', xxl: '45%'}}>
        {
          showWatchForm
          ? <WatchForm onWatchSave={getAndSetData} />
          : null
        }
      </Box>

      <Flex flexDirection={{base: 'column', xxl: 'row'}} justifyContent='stretch' gap='10px'>
        <div>
          <h2 style={{marginTop: 10, marginBottom: 15}}> By address </h2>
          { useMemo(() => <BitcoinWatchTable type="address" isLoading={addressDataLoading} data={watchAddressData} onEdit={(watchObject: Watch) => {getAndSetAddressWatches()}} onUnWatch={() => {getAndSetAddressWatches(); scrollToTop();}} />, [watchAddressData, addressDataLoading]) }
        </div>
        <div>
          <h2 style={{marginTop: 10, marginBottom: 15}}> By *pub </h2>
          { useMemo(() => <BitcoinWatchTable type="xpub" isLoading={xpubDataLoading} data={watchXpubData} onEdit={(watchObject: Watch) => {getAndSetXPubWatches()}} onUnWatch={() => {getAndSetXPubWatches(); scrollToTop();}} />, [watchXpubData, xpubDataLoading]) }
        </div>
      </Flex>

    </Widget>
  )
}
