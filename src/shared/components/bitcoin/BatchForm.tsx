import { Button, chakra, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, InputGroup, Radio, RadioGroup, Stack, Text, useToast } from "@chakra-ui/react";
import { postCallProxy } from "@shared/services/api";
import { useState } from "react";
import { useErrorHandler, withErrorBoundary } from "react-error-boundary";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { LoaderOverlay, Widget } from "..";
import { ErrorBoundaryFallback } from "../ErrorBoundaryFallback";
import { validate, getAddressInfo } from 'bitcoin-address-validation';

type Inputs = {
  label: string,
  confTarget: string,
};

type BatchFormProps = {
  onBatchSave: () => void
};

const BatchForm = (
  {
    onBatchSave,
  }: BatchFormProps
) => {
  const formVars = useForm<Inputs>();
  const { register, handleSubmit, formState: { errors }, reset } = formVars;
  const [ loading, setLoading ] = useState<boolean>(false);
  const handleError = useErrorHandler();
  const toast = useToast();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log('BatchForm :: onSubmit');

    const payload = {
      confTarget: Number(data.confTarget),
      batcherLabel: data.label
    };

    batch(payload).catch(err => handleSubmit(err));
  }

  const onError = (errors: any, e: any) => {
    console.log('BatchForm :: onErorr');
    console.log(errors, e);
  }

  const batch = async (payload: any) => {
    const endpoint = 'createbatcher';

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
        title: 'Added a batch',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch(err) {
      handleError(err);
    } finally {
      setLoading(false);
      onBatchSave();
    }
  }

  return (
    <Widget variant='border' style={{position: 'relative'}} mb={2}>
      <Text as='h3'>Add a batch</Text>
      <chakra.form display='flex' flexDirection='column' gap='20px' mt={5} onSubmit={handleSubmit(onSubmit, onError)}>
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

        <FormControl isInvalid={errors.hasOwnProperty('confTarget')}>
          <FormLabel>Conf target</FormLabel>
          <InputGroup flexDirection='column' gap='5px'>
            <Input type='text' {...register('confTarget', {required: true, pattern: { value: /^[0-9]*\.?[0-9]*$/, message: 'Should be a number'}})} placeholder="32" />
            {
              errors.confTarget?.type === 'required'
              ? <FormErrorMessage>Confirmation target is mandatory</FormErrorMessage>
              : null
            }
            {
              errors.confTarget?.message
              ? <FormErrorMessage>{errors.confTarget?.message}</FormErrorMessage>
              : null
            }
          </InputGroup>
        </FormControl>

        <Button type='submit' marginTop={{base: '20px', md: '10px'}} alignSelf={{base: 'center', md: 'end'}} w={{base: '50%', md: '20%'}}> Add Batch </Button>
      </chakra.form>

      {loading ? <LoaderOverlay> Adding batch... </LoaderOverlay>: null }
    </Widget>
  );
};

const BatchFormWithErrorBoundary = withErrorBoundary(BatchForm, {
  fallbackRender: (fallbackProps) => (<ErrorBoundaryFallback {...fallbackProps} title='Add Batch' />)
});

export default BatchFormWithErrorBoundary;
