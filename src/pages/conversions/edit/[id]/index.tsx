import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getConversionById, updateConversionById } from 'apiSdk/conversions';
import { Error } from 'components/error';
import { conversionValidationSchema } from 'validationSchema/conversions';
import { ConversionInterface } from 'interfaces/conversion';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function ConversionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ConversionInterface>(
    () => (id ? `/conversions/${id}` : null),
    () => getConversionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ConversionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateConversionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/conversions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ConversionInterface>({
    initialValues: data,
    validationSchema: conversionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Conversion
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="timecode" mb="4" isInvalid={!!formik.errors?.timecode}>
              <FormLabel>Timecode</FormLabel>
              <Input type="text" name="timecode" value={formik.values?.timecode} onChange={formik.handleChange} />
              {formik.errors.timecode && <FormErrorMessage>{formik.errors?.timecode}</FormErrorMessage>}
            </FormControl>
            <FormControl id="frame_count" mb="4" isInvalid={!!formik.errors?.frame_count}>
              <FormLabel>Frame Count</FormLabel>
              <NumberInput
                name="frame_count"
                value={formik.values?.frame_count}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('frame_count', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.frame_count && <FormErrorMessage>{formik.errors?.frame_count}</FormErrorMessage>}
            </FormControl>
            <FormControl id="length" mb="4" isInvalid={!!formik.errors?.length}>
              <FormLabel>Length</FormLabel>
              <NumberInput
                name="length"
                value={formik.values?.length}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('length', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.length && <FormErrorMessage>{formik.errors?.length}</FormErrorMessage>}
            </FormControl>
            <FormControl id="duration" mb="4" isInvalid={!!formik.errors?.duration}>
              <FormLabel>Duration</FormLabel>
              <NumberInput
                name="duration"
                value={formik.values?.duration}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('duration', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.duration && <FormErrorMessage>{formik.errors?.duration}</FormErrorMessage>}
            </FormControl>
            <FormControl id="frames_per_second" mb="4" isInvalid={!!formik.errors?.frames_per_second}>
              <FormLabel>Frames Per Second</FormLabel>
              <NumberInput
                name="frames_per_second"
                value={formik.values?.frames_per_second}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('frames_per_second', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.frames_per_second && (
                <FormErrorMessage>{formik.errors?.frames_per_second}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="format" mb="4" isInvalid={!!formik.errors?.format}>
              <FormLabel>Format</FormLabel>
              <Input type="text" name="format" value={formik.values?.format} onChange={formik.handleChange} />
              {formik.errors.format && <FormErrorMessage>{formik.errors?.format}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'conversion',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ConversionEditPage);
