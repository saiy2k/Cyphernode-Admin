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
  Flex,
  Switch,
} from '@chakra-ui/react';

import { useForm, SubmitHandler } from "react-hook-form";
import { validate, getAddressInfo } from 'bitcoin-address-validation';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { Widget, LoaderOverlay, ButtonGroup } from '@shared/components/index';
import { postCallProxy } from '@shared/services/api';
import { AMOUNT_TYPES } from '@shared/constants';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';
import { WasabiSendPayload } from '@shared/types';

type Inputs = {
  amount: string,
  address: string,
  label: string,
  minAnonSet: number,
  isPrivate: boolean,
};

const WasabiSendForm = () => {

  console.log('Render: Wasabi Send Widget');

  const btcToggle = useRef<HTMLButtonElement>(null);
  const formVars = useForm<Inputs>();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, reset } = formVars;
  const [ amountInSats, setAmountInSats ] = useState<boolean>(false);
  const [ addressInfo, setAddressInfo ] = useState<any>(null);
  const [ loading, setLoading ] = useState<boolean>(false);
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
    const payload: WasabiSendPayload = {};
    send(payload);
  };

  const send = async (payload: WasabiSendPayload) => {

  }



  const onError = (errors: any, e: any) => {
    console.log('Form has errors');
    console.log(errors, e);
  };

  return (
    <Widget variant='border' style={{ position: 'relative' }} mb={2}>
      <chakra.form display='flex' flexDirection='column' onSubmit={handleSubmit(onSubmit, onError)}>

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

        { /* Label field */ }
        <FormControl mb={2} isInvalid={errors.hasOwnProperty('label')}>
          <FormLabel>Label</FormLabel>

          <Input type='text' {...register('label', { required: true})} />

          { errors.label?.type === 'required' ? 
          <FormErrorMessage> Label is required </FormErrorMessage>: null }
        </FormControl>

        <Flex justifyContent='space-between' gap={2}>
            { /* Min Anon field */ }
            <FormControl flex={5} width='100%' mb={2} isInvalid={errors.hasOwnProperty('minAnonSet')}>
                <FormLabel>Min Anon set</FormLabel>

                <Input type='text' {...register('minAnonSet', { required: true})} />

                {
                    errors.minAnonSet?.type === 'required'
                    ? <FormErrorMessage> Min Anon Set is required </FormErrorMessage>
                    : null
                }
            </FormControl>

            { /* Private field */ }
            <FormControl flex={1} display='flex' justifyContent='end' alignItems='end' mb={2} isInvalid={errors.hasOwnProperty('minAnonSet')}>

                <Flex gap={1}>
                    {/* <Input type='text' {...register('minAnonSet', { required: true})} /> */}
                    <Switch  {...register('isPrivate')} />
                    <FormLabel>Private</FormLabel>
                </Flex>
            </FormControl>
        </Flex>


        <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Submit </Button>

        { /* error ? <chakra.p color='red'>
          <b> Error: </b> { error }
        </chakra.p>: null */ }
      </chakra.form>

      {loading ? <LoaderOverlay> Sending... </LoaderOverlay>: null }

      {/* {error ? <ErrorOverlay onReset={ () => setError(null)}> { error } </ErrorOverlay>: null } */}

    </Widget>
  )
}

const BitcoinSendWidgetWithErrorBoundary = withErrorBoundary(WasabiSendForm, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Send widget' />)
});

export default BitcoinSendWidgetWithErrorBoundary;
