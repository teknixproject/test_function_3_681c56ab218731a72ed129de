import axiosInstance from '@/configs/axiosInstance';
import { TApiCall, TApiResponse } from '@/types';

const instance = axiosInstance;

type TGetApiQuery = {
  projectId: string;
  uid: string;
};
const get = async (query: TGetApiQuery): Promise<TApiResponse<TApiCall>> => {
  const response = (await instance.get('/apiCall', { params: query })).data;
  return response;
};

export const apiCallService = { get };
