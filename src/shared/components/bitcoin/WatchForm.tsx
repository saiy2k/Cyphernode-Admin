import { Button, chakra, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputGroup, Radio, RadioGroup, Stack, Text, useToast } from "@chakra-ui/react";
import { postCallProxy } from "@shared/services/api";
import { WatchAddressPayload, WatchXPubPayload } from "@shared/types";
import { useState } from "react";
import { useErrorHandler, withErrorBoundary } from "react-error-boundary";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { LoaderOverlay, Widget } from "..";
import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";
import { validate, getAddressInfo } from 'bitcoin-address-validation';

type Inputs = {
  address: string,
  label: string,
  path: string,
  nstart: string,
  confirmedCallbackURL: string,
  unconfirmedCallbackURL: string,
};

type WatchFormProps = {
  onWatchSave: () => void
};

const WatchForm = (
  {
    onWatchSave,
  }: WatchFormProps
) => {
  const formVars = useForm<Inputs>();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, reset, control } = formVars;
  const [ addressType, setAddressType ] = useState<string>("address");
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ addressInfo, setAddressInfo ] = useState<any>(null);

  const handleError = useErrorHandler();
  const toast = useToast();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log('WatchForm :: onSubmit');

    const commonPayload = {
      confirmedCallbackURL: data.confirmedCallbackURL,
      unconfirmedCallbackURL: data.unconfirmedCallbackURL,
      label: data.label
    };

    let payload = null;

    if(addressType === "address") {
      payload = {
        ...commonPayload,
        address: data.address,
      };
    } else {
      payload = {
        ...commonPayload,
        pub32: data.address,
        ...( !isNaN(Number(data.nstart)) ? {nstart: Number(data.nstart)}: {}),
        path: data.path,
      };
    }

    watch(payload).catch(err => handleSubmit(err));
  }

  const onError = (errors: any, e: any) => {
    console.log('WatchForm :: onErorr');
    console.log(errors, e);
  }

  const validateXpub = (xpub: string) => {
    // Regex from https://bitcoin.stackexchange.com/a/111598/133323
    const regex = /^([xyYzZtuUvV]pub[1-9A-HJ-NP-Za-km-z]{79,108})$/;
    return regex.test(xpub)
  }

  const watch = async (payload: (WatchAddressPayload | WatchXPubPayload)) => {
    const endpoint = addressType === 'address' ? 'watch': 'watchxpub';

    setLoading(true);
    try {
      const serverResp = await postCallProxy(endpoint, payload);
      console.log('serverResp', serverResp);
      if (!serverResp.ok) {
        let errorString = serverResp.status + ': ' + serverResp.statusText;
        if (serverResp.body) {
          console.log('serverRes.body: ', serverResp.body);
          const serverError = await serverResp.json();
          errorString = errorString + ': ' + (serverError.message ? serverError.message : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      // const response = await serverResp.json();
      reset();
      toast({
        title: 'Added a watch',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch(err) {
      handleError(err);
    } finally {
      setLoading(false);
      onWatchSave();
    }
  }

  return (
    <Widget variant='border' style={{position: 'relative'}} mb={2}>
      <Text as='h3'>Add a watch</Text>
      <chakra.form display='flex' flexDirection='column' gap='20px' mt={5} onSubmit={handleSubmit(onSubmit, onError)}>
        <RadioGroup
          onChange={setAddressType}
          value={addressType}
        >
          <Stack spacing={4} direction='row'>
            <Radio
              _checked={{
                // background: 'bg.light',
                // color: 'main.light',
                // borderWidth: '3px',
                // borderColor: 'border.dark',

                background: 'white',
                  color: 'white',
                  borderWidth: '3px',
                  borderColor: 'black',
              }}
              value='address'
            >
              Address
            </Radio>

            <Radio
              _checked={{
                // background: 'bg.light',
                // color: 'main.light',
                // borderWidth: '3px',
                // borderColor: 'border.dark',

                background: 'white',
                  color: 'white',
                  borderWidth: '3px',
                  borderColor: 'black',
              }}
              value='xpub'
            >
              *pub
            </Radio>
          </Stack>
        </RadioGroup>

        <FormControl isInvalid={errors.hasOwnProperty('address')}>
          <FormLabel>Address / pub32</FormLabel>
          <InputGroup flexDirection='column' gap='5px'>
            <Input type='text' {...register('address', { required: true, validate: (val:string) => {
              console.log('validate address... ');
              if(addressType === 'xpub') {
                const isValid = validateXpub(val)
                setAddressInfo('');
                return isValid;
              } else {
                const isValid = validate(val);
                if (isValid) {
                  setAddressInfo(getAddressInfo(val));
                }
                return isValid;
              }

            }})} placeholder="Address / *pub" />

            { !errors.hasOwnProperty('address') && addressInfo && addressInfo.type ? 
            <FormHelperText> { addressInfo.type } - { addressInfo.network } </FormHelperText>: null }

            {
              errors.address?.type === 'validate'
              ? <FormErrorMessage>Invalid address</FormErrorMessage>
              : null
            }

            {
              errors.address?.type === 'required'
              ? <FormErrorMessage>Address is mandatory</FormErrorMessage>
              : null
            }
          </InputGroup>
        </FormControl>

        <FormControl isInvalid={errors.hasOwnProperty('label')}>
          <FormLabel>Label</FormLabel>
          <InputGroup flexDirection='column' gap='5px'>
            <Input type='text' {...register('label', {required: true, minLength: 3})} />

            <div>
              {
                errors.label?.type === 'required'
                ? <FormErrorMessage>Label is mandatory</FormErrorMessage>
                : null
              }

              {
                errors.label?.type === 'minLength'
                ? <FormErrorMessage>Label should contain at least 3 characters</FormErrorMessage>
                : null
              }
            </div>
          </InputGroup>
        </FormControl>

        {
          addressType !== 'xpub'
          ? null
          :
          <Stack direction='row'>
            <FormControl isInvalid={errors.hasOwnProperty('path')}>
              <FormLabel>Path</FormLabel>
              <InputGroup flexDirection='column' gap='5px'>
                <Input type='text' {...register('path', {required: true, pattern: {value: /(\d\/)*(\d\/[\dn])$/, message: 'Invalid path'}})} placeholder="0/1/n" />

                {
                  errors.path?.type === 'required'
                  ? <FormErrorMessage>Path is mandatory</FormErrorMessage>
                  : null
                }

                {
                  errors.path?.message
                  ? <FormErrorMessage>{errors.path?.message}</FormErrorMessage>
                  : null
                }
              </InputGroup>
            </FormControl>

            <FormControl isInvalid={errors.hasOwnProperty('nstart')}>
              <FormLabel>nStart</FormLabel>
              <InputGroup flexDirection='column' gap='5px'>
                <Input type='text' {...register('nstart', {required: true, pattern: { value: /^[0-9]*\.?[0-9]*$/, message: 'Should be a number'}})} placeholder="109" />
                {
                  errors.nstart?.type === 'required'
                  ? <FormErrorMessage>nStart is mandatory</FormErrorMessage>
                  : null
                }
                {
                  errors.nstart?.message
                  ? <FormErrorMessage>{errors.nstart?.message}</FormErrorMessage>
                  : null
                }
              </InputGroup>
            </FormControl>
          </Stack>
        }

        <FormControl isInvalid={errors.hasOwnProperty('confirmedCallbackURL')}>
          <FormLabel>Confirmed URL</FormLabel>
          <InputGroup flexDirection='column' gap='5px'>
            <Input type='text' {...register('confirmedCallbackURL', {required: true, pattern: {value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, message: 'Should be a valid URL'}})} placeholder="https://example.com/callback1conf" />
            {
              errors.confirmedCallbackURL?.type === 'required'
              ? <FormErrorMessage>Confirmed URL is mandatory</FormErrorMessage>
              : null
            }
            {
              errors.confirmedCallbackURL?.message
              ? <FormErrorMessage>{errors.confirmedCallbackURL?.message}</FormErrorMessage>
              : null
            }
          </InputGroup>
        </FormControl>

        <FormControl isInvalid={errors.hasOwnProperty('unconfirmedCallbackURL')}>
          <FormLabel>Unconfirmed URL</FormLabel>
          <InputGroup flexDirection='column' gap='5px'>
            <Input type='text' {...register('unconfirmedCallbackURL', {required: true, pattern: {value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, message: 'Should be a valid URL'}})} placeholder="https://example.com/callback0conf" />
            {
              errors.unconfirmedCallbackURL?.type === 'required'
              ? <FormErrorMessage>Unconfirmed URL is mandatory</FormErrorMessage>
              : null
            }
            {
              errors.unconfirmedCallbackURL?.message
              ? <FormErrorMessage>{errors.unconfirmedCallbackURL?.message}</FormErrorMessage>
              : null
            }
          </InputGroup>
        </FormControl>

        <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Watch </Button>
      </chakra.form>

      {loading ? <LoaderOverlay> Watching... </LoaderOverlay>: null }
    </Widget>
  );
};

const WatchFormWithErrorBoundary = withErrorBoundary(WatchForm, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Add Watch' />)
});

export default WatchFormWithErrorBoundary;
