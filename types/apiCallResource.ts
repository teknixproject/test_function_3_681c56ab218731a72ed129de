import { TTypeVariable } from '@/types';

export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
export enum TypeApiCall {
  GROUP = 'GROUP',
  MEMBER = 'MEMBER',
  INDIVIDUAL = 'INDIVIDUAL',
}
export type TApiCall = {
  projectId: string;
  documentId: string;
  uid: string;
  apis: TApiCallValue[];
};
export type TApiCallValue = {
  type?: TypeApiCall;
  groupId?: string | null;
  groupName?: string | null;
  apiId?: string;
  apiName?: string;
  url?: string;
  baseUrl?: string | null;
  method?: METHODS;
  headers?: object;
  body?: object;
  query?: object;
  variables?: TApiCallVariable[];
  response?: {
    data: any;
    statusCode: number;
    succeeded: boolean;
  };
};
export type TApiCallVariable = {
  id: string;
  key: string;
  value: string;
  type: TTypeVariable;
  isList: boolean;
};
