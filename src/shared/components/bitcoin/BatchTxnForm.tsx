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
  Select,
} from '@chakra-ui/react';

import { useForm, SubmitHandler } from "react-hook-form";
import { validate, getAddressInfo } from 'bitcoin-address-validation';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';

import { Widget, LoaderOverlay, ButtonGroup } from '@shared/components/index';
import { postCallProxy } from '@shared/services/api';
import { CONF_TARGET, AMOUNT_TYPES } from '@shared/constants';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';
import { AddToBatchPayload, Batch } from '@shared/types';

type Inputs = {
  amount: string,
  address: string,
  webhookUrl: string,
  batchId: number,
};

type BatchTxnFormProps = {
    batchId?: number,
    batches?: Batch[],
    onAddToBatch: () => void,
};

const BatchTxnForm = ({
    batchId,
    batches,
    onAddToBatch,
}: BatchTxnFormProps) => {

  console.log('Render: BatchTxnForm');

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

    let batcherId = null;

    if(batchId) {
      batcherId = batchId;
    } else {
      batcherId = data.batchId;
    }

    const payload: AddToBatchPayload = {
      batcherId: Number(batcherId),
      address: data.address,
      amount: amountInSats ? parseFloat(data.amount) * 100000000 : parseInt(data.amount),
      webhookUrl: data.webhookUrl,
    };

    addToBatch(payload).catch(err => handleError(err));
  };

  const addToBatch = async (payload: AddToBatchPayload) => {
    setLoading(true);
    try {
      const serverResp = await postCallProxy('addtobatch', payload);
      if (!serverResp.ok) {
        let errorString = serverResp.status + ': ' + serverResp.statusText;
        if (serverResp.body) {
          const serverError = await serverResp.json();
          // debugger;
          errorString = errorString + ': ' + (serverError.message ? serverError.message : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      const response = await serverResp.json();
      if (response.error !== null) {
        throw new Error(JSON.stringify(response));
      } else {
        reset();
        toast({
          title: 'Added to batch',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        onAddToBatch();
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
        
        {
          batchId
          ? null
          : !batches || !(Array.isArray(batches)) || batches.length === 0
            ? null
            : (
                <FormControl mb={2} isInvalid={errors.hasOwnProperty('batchId')}>
                  <FormLabel>Batch</FormLabel>
                  <InputGroup flexDirection={{base: 'column'}} maxHeight={{base: '200px', md: 'auto'}}>
                    <Select {...register('batchId', { required: true}) }>
                      {
                        batches.map((batch: Batch) => (
                          <option key={batch.batcherId} value={batch.batcherId}>{batch.batcherLabel}</option>
                        ))
                      }
                    </Select>
                  </InputGroup>

                  { errors.batchId?.type === 'required' ? 
                  <FormErrorMessage> Batch is mandatory </FormErrorMessage>: null }
                </FormControl>
              )
        }

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

        <FormControl isInvalid={errors.hasOwnProperty('webhookUrl')}>
          <FormLabel>Webhook URL</FormLabel>
          <InputGroup flexDirection='column' gap='5px'>
            <Input type='text' {...register('webhookUrl', {required: true, pattern: {value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, message: 'Should be a valid URL'}})} placeholder="https://example.com/callback1conf" />
            {
              errors.webhookUrl?.type === 'required'
              ? <FormErrorMessage>Confirmed URL is mandatory</FormErrorMessage>
              : null
            }
            {
              errors.webhookUrl?.message
              ? <FormErrorMessage>{errors.webhookUrl?.message}</FormErrorMessage>
              : null
            }
          </InputGroup>
        </FormControl>

        <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Add to batch </Button>

        { /* error ? <chakra.p color='red'>
          <b> Error: </b> { error }
        </chakra.p>: null */ }
      </chakra.form>

      {loading ? <LoaderOverlay> Adding to batch... </LoaderOverlay>: null }

      {/* {error ? <ErrorOverlay onReset={ () => setError(null)}> { error } </ErrorOverlay>: null } */}

    </Widget>
  )
}

const BitcoinSendWidgetWithErrorBoundary = withErrorBoundary(BatchTxnForm, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Send widget' />)
});

export default BitcoinSendWidgetWithErrorBoundary;
