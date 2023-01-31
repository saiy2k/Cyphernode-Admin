'use client';

import {
  Box,
  Button,
  chakra,
  Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup,
  Text,
  useToast,
} from '@chakra-ui/react';
import { LoaderOverlay, Widget } from '@shared/components';
import { postCallProxy } from '@shared/services/api';
import { OTS_GetInfoPayload } from '@shared/types';
import { useState } from 'react';
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback';

type Inputs = {
    hash: string,
};

function GetInfo() {
  console.log('GetInfo :: render');

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ info, setInfo ] = useState<null | any>(null);

  const formVars = useForm<Inputs>();
  const { register, handleSubmit, formState: { errors }, getValues, setValue, reset, control } = formVars;

  const toast = useToast();
  const handleError = useErrorHandler();


  const getInfo = async (payload: OTS_GetInfoPayload) => {
    setLoading(true);
    const endpoint = 'ots_info';
    try {
      const serverResp = await postCallProxy(endpoint, payload);
      console.log('serverResp', serverResp);

      if(serverResp.status === 401) {
        throw new Error('401 Authorization Required');
      }

      if (!serverResp.ok) {
        let errorString = serverResp.status + ': ' + serverResp.statusText;
        if (serverResp.body) {
          console.log('serverRes.body: ', serverResp.body);
          const serverError = await serverResp.json();
          errorString = errorString + ': ' + (serverError.message ? serverError.message : JSON.stringify(serverError));
        }
        throw new Error(errorString);
      }
      const response = await serverResp.json();
      setInfo(response);
      reset();
      toast({
        title: 'Stamped',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch(err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    console.log('GetInfo :: onSubmit');

    const payload: OTS_GetInfoPayload = {
      ...data,
    };

    getInfo(payload);
  }

  const onError = (errors: any, e: any) => {
    console.log('GetInfo :: onErorr');
    console.log(errors, e);
  }

  return (
    <Widget variant="border" position='relative'>
        <Text as='h3' marginBottom={15}> GetInfo </Text>
        <chakra.form display='flex' flexDirection='column' gap='20px' mt={5} onSubmit={handleSubmit(onSubmit, onError)}>
            <FormControl isInvalid={errors.hasOwnProperty('hash')}>
                <FormLabel>Hash</FormLabel>
                <InputGroup flexDirection='column' gap='5px'>
                  <Input
                    type='text'
                    placeholder='Enter a hash'
                    {...register('hash', {required: true})}
                  />

                  <div>
                    {
                      errors.hash?.type === 'required'
                      ? <FormErrorMessage>Hash is mandatory</FormErrorMessage>
                      : null
                    }
                  </div>
                </InputGroup>
            </FormControl>

            <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Get Info </Button>

        </chakra.form>

        {loading ? <LoaderOverlay> Getting info... </LoaderOverlay>: null }

        {
          Boolean(info)
            ? <Info info={info} />
            : null
        }
    </Widget>
  )
}


const GetInfoWithErrorBoundary = withErrorBoundary(GetInfo, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Info' />)
});

export default GetInfoWithErrorBoundary;


type InfoProps = {
  info: any
};

function Info(props: InfoProps) {
  return (
    <Box>
      <Text as='h4'>Info</Text>
      <Text>{JSON.stringify(props.info)}</Text>
    </Box>
  );
}