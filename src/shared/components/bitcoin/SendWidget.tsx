import { useEffect, useRef, useState } from 'react';

import {
  chakra,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';

import { useForm, SubmitHandler } from "react-hook-form";
import { validate, getAddressInfo } from 'bitcoin-address-validation';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { Widget, LoaderOverlay, ButtonGroup } from '@shared/components/index';
import { postCall } from '@shared/services/api';
import { FEE_TYPES, AMOUNT_TYPES } from '@shared/constants';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';
import { SpendCoinPayload } from '@shared/types';

type Inputs = {
  amount: string,
  address: string,
  fee: number,
};

const BitcoinSendWidget = () => {

  console.log('Render: Bitcoin Send Widget');

  const btcToggle = useRef<HTMLButtonElement>(null);
  const formVars = useForm<Inputs>();
  const { register, handleSubmit, formState: { errors }, trigger, getValues, setValue, reset } = formVars;
  const [ amountInSats, setAmountInSats ] = useState<boolean>(false);
  const [ addressInfo, setAddressInfo ] = useState<any>(null);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ feeType, setFeeType ] = useState<string>(FEE_TYPES[0].id);
  const [ amountType, setAmountType ] = useState<string>(AMOUNT_TYPES[0].id);

  const handleError = useErrorHandler();

  const toast = useToast();

  useEffect(() => {
    btcToggle.current?.click();
  }, []);

  const convertToBtc = () => {
    if (!amountInSats) return;
    setAmountInSats(false);
    const fieldValue = getValues('amount');
    if (fieldValue.length === 0) {
      setValue('amount', '0');
      return;
    }
    const inBtc = (parseInt(fieldValue) / 100000000).toFixed(8);
    setValue('amount', inBtc);
  }

  const convertToSats = () => {
    if (amountInSats) return;
    setAmountInSats(true);
    const fieldValue = getValues('amount');
    console.log('fieldValue: ', fieldValue, fieldValue.length);
    if (fieldValue.length === 0) {
      setValue('amount', '0');
      return;
    }
    const inSat = (parseFloat(fieldValue) * 100000000).toFixed(0);
    setValue('amount', inSat);
  }

  const convertToFIAT = () => {
    console.log("FIAT");
  }

  useEffect(() => {
    if(amountType === 'btc') {
      convertToBtc();
    } else if(amountType === 'sats') {
      convertToSats();
    } else if(amountType === 'fiat') {
      convertToFIAT();
    }
  }, [amountType]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('Form is valid');
    console.log(data);
    const payload: SpendCoinPayload = {
      address: data.address,
      amount: amountInSats ? parseFloat(data.amount) * 100000000 : parseInt(data.amount)
    };

    spendCoin(payload);
  };

  const spendCoin = async (payload: SpendCoinPayload) => {
    setLoading(true);
    try {
      const serverResp = await postCall('spend', 2, payload);
      if (!serverResp.ok) {
        // debugger;
        let errorString = serverResp.status + ': ' + serverResp.statusText;
        if (serverResp.body) {
          const serverError = await serverResp.json();
          // debugger;
          errorString = errorString + ': ' + (serverError.message ? serverError.message : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      const response = await serverResp.json();
      if (response.status !== 'accepted') {
        throw new Error(JSON.stringify(response));
      } else {
        reset();
        toast({
          title: 'Transaction accepted',
          description: response.txid,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }



  const onError = (errors: any, e: any) => {
    console.log('Form has errors');
    console.log(errors, e);
  };

  return (
    <Widget variant='border' style={{ position: 'relative' }} mb={2}>
      <chakra.form display='flex' flexDirection='column' onSubmit={handleSubmit(onSubmit, onError)}>

        { /* Amount field */ }
        { /*
        <BitcoinAmountField formVars />
           */ }
        <FormControl mb={2} isInvalid={errors.hasOwnProperty('amount')}>
          <FormLabel>Amount</FormLabel>

          <InputGroup flexDirection={{base: 'column'}} maxHeight={{base: '200px', md: 'auto'}}>
            <Input type='text' {...register('amount', { required: true, pattern: { value: /^[0-9]*\.?[0-9]*$/, message: 'Should be a number'} }) } />
            <InputRightElement display={{base: 'flex'}} height={{base: 'auto', md: ''}} marginTop={{base: '20px', md: '0px'}} width='auto' gap={{base: '5px', lg: '5px', xl: '10px'}} justifyContent='end' position={{base: 'relative', md: 'absolute'}} top={{md: '50%'}} transform={{md: 'translateY(-50%)'}} paddingRight={{md: '5px'}}>
              <ButtonGroup
                name='amount-type'
                defaultValue={AMOUNT_TYPES[0].id}
                value={amountType}
                onChange={(value: string) => {setAmountType(value)}}
                options={AMOUNT_TYPES}
                key='amount-type'
              />
            </InputRightElement>
          </InputGroup>

          <FormHelperText> [btc shown in fiat value] </FormHelperText>

          { errors.amount?.type === 'required' ? 
          <FormErrorMessage> Amount is mandatory </FormErrorMessage>: null }
        </FormControl>

        { /* Address field */ }
        <FormControl mb={2} isInvalid={errors.hasOwnProperty('address')}>
          <FormLabel>Address</FormLabel>

          <Input type='text' {...register('address', { required: true, validate: (val:string) => {
            console.log('validate address... ');
            const isValid = validate(val);
            if (isValid) {
              setAddressInfo(getAddressInfo(val));
            }
            return isValid;
          }}) } />

          { !errors.hasOwnProperty('address') && addressInfo && addressInfo.type ? 
          <FormHelperText> { addressInfo.type } - { addressInfo.network } </FormHelperText>: null }

          { errors.address?.type === 'validate' ? 
          <FormErrorMessage> Invalid address </FormErrorMessage>: null }
          { errors.address?.type === 'required' ? 
          <FormErrorMessage> Address required </FormErrorMessage>: null }
        </FormControl>

        { /* Fee field */ }
        <FormControl mb={2} isInvalid={errors.hasOwnProperty('fee')}>
          <FormLabel>Fee</FormLabel>

          <InputGroup flexDirection={{base: 'column'}} maxHeight={{base: '300px', md: 'auto'}}>
            <Input type='text' {...register('fee', { required: true}) } />

            <InputRightElement display={{base: 'flex'}} height={{base: 'auto', md: ''}} marginTop={{base: '20px', md: '0px'}} width='auto' gap={{base: '5px', lg: '5px', xl: '10px'}} justifyContent='end' position={{base: 'relative', md: 'absolute'}} top={{md: '50%'}} transform={{md: 'translateY(-50%)'}} paddingRight={{md: '5px'}}>
              <ButtonGroup
                name='fee-type'
                defaultValue='auto-fastest'
                value={feeType}
                onChange={(value: string) => {setFeeType(value)}}
                options={FEE_TYPES}
                key='fee-type'
                justifyContent='flex-end'
              />
            </InputRightElement>
          </InputGroup>

          <FormErrorMessage> Invalid fee </FormErrorMessage>
        </FormControl>

        <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Submit </Button>

        { /* error ? <chakra.p color='red'>
          <b> Error: </b> { error }
        </chakra.p>: null */ }
      </chakra.form>

      {loading ? <LoaderOverlay> Spending... </LoaderOverlay>: null }

      {/* {error ? <ErrorOverlay onReset={ () => setError(null)}> { error } </ErrorOverlay>: null } */}

    </Widget>
  )
}

const BitcoinAmountField = (props: any) => {

  const btcToggle = useRef<HTMLButtonElement>(null);
  const [ amountInSats, setAmountInSats ] = useState<boolean>(false);
  const { register, formState: { errors }, trigger, getValues, setValue, reset } = props.formVars;

  useEffect(() => {
    btcToggle.current?.click();
  }, []);

  const convertToBtc = () => {
    if (!amountInSats) return;
    setAmountInSats(false);
    const fieldValue = getValues('amount');
    if (fieldValue.length === 0) {
      setValue('amount', '0');
      return;
    }
    const inBtc = (parseInt(fieldValue) / 100000000).toFixed(8);
    setValue('amount', inBtc);
  }

  const convertToSats = () => {
    if (amountInSats) return;
    setAmountInSats(true);
    const fieldValue = getValues('amount');
    console.log('fieldValue: ', fieldValue, fieldValue.length);
    if (fieldValue.length === 0) {
      setValue('amount', '0');
      return;
    }
    const inSat = (parseFloat(fieldValue) * 100000000).toFixed(0);
    setValue('amount', inSat);
  }


  return (
    <FormControl mb={2} isInvalid={errors.hasOwnProperty('amount')}>
      <FormLabel>Amount</FormLabel>

      <InputGroup>
        <Input type='text' {...register('amount', { required: true, pattern: { value: /^[0-9]*\.?[0-9]*$/, message: 'Should be a number'} }) } />
        <InputRightElement width='250px' justifyContent='end'>
          <Button variant='light' px={8} size='sm' mr={1} onClick={() => convertToBtc() } ref={btcToggle}> btc </Button>
          <Button variant='light' px={8} size='sm' mr={1} onClick={() => convertToSats() }> sats </Button>
        </InputRightElement>
      </InputGroup>

      <FormHelperText> [btc shown in fiat value] </FormHelperText>

    { errors.amount?.type === 'required' ? 
      <FormErrorMessage> Amount is mandatory </FormErrorMessage>: null }
    </FormControl>
  );
}

const BitcoinSendWidgetWithErrorBoundary = withErrorBoundary(BitcoinSendWidget, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Send widget' />)
});

export default BitcoinSendWidgetWithErrorBoundary;
