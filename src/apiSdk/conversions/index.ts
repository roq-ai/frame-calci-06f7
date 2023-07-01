import axios from 'axios';
import queryString from 'query-string';
import { ConversionInterface, ConversionGetQueryInterface } from 'interfaces/conversion';
import { GetQueryInterface } from '../../interfaces';

export const getConversions = async (query?: ConversionGetQueryInterface) => {
  const response = await axios.get(`/api/conversions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createConversion = async (conversion: ConversionInterface) => {
  const response = await axios.post('/api/conversions', conversion);
  return response.data;
};

export const updateConversionById = async (id: string, conversion: ConversionInterface) => {
  const response = await axios.put(`/api/conversions/${id}`, conversion);
  return response.data;
};

export const getConversionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/conversions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteConversionById = async (id: string) => {
  const response = await axios.delete(`/api/conversions/${id}`);
  return response.data;
};
