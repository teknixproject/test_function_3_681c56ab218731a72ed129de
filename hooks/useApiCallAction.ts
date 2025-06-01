import axios from 'axios';
import _ from 'lodash';
import { useCallback, useEffect, useRef } from 'react';

import { stateManagementStore } from '@/stores';
import { TAction, TActionApiCall, TActionVariable, TApiCallValue, TApiCallVariable } from '@/types';
import { variableUtil } from '@/uitls';

import { actionHookSliceStore } from './actionSliceStore';
import { useApiCall } from './useApiCall';

const { isUseVariable, extractAllValuesFromTemplate } = variableUtil;

export type TUseActions = {
  handleApiCallAction: (action: TAction<TActionApiCall>) => Promise<void>;
};

type TProps = {
  executeActionFCType: (action?: TAction) => Promise<void>;
};
export const useApiCallAction = ({ executeActionFCType }: TProps): TUseActions => {
  const { getApiMember } = useApiCall();
  const findAction = actionHookSliceStore((state) => state.findAction);
  // const updateApiResource = apiResourceStore((state) => state.updateApiResource);
  // const apiResponsesRef = useRef<Record<string, any>>({});

  const findVariable = stateManagementStore((state) => state.findVariable);
  const updateVariables = stateManagementStore((state) => state.updateVariables);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const convertActionVariables = useCallback(
    (actionVariables: TActionVariable[], apiCall: TApiCallValue): any[] => {
      if (_.isEmpty(actionVariables)) return [];

      return actionVariables.map((item) => {
        const { firstValue, secondValue } = item;

        const data = apiCall?.variables?.find((item) => item.id === firstValue.variableId);

        if (!data) return;

        if (secondValue.variableId) {
          const valueInStore = findVariable({
            type: secondValue.typeStore,
            id: secondValue.variableId,
          });
          data.value = valueInStore?.value || '';
        }
        if (secondValue.value) {
          data.value = secondValue.value;
        }

        return data;
      });
    },
    [findVariable]
  );

  const convertApiCallBody = useCallback((body: any, variables: Record<string, any>): any => {
    if (typeof body === 'string') return body;
    if (typeof body !== 'object') return body;

    return Object.entries(body).reduce((acc, [key, value]) => {
      acc[key] = isUseVariable(value)
        ? variables.find(
            (item: TApiCallVariable) => item.key === extractAllValuesFromTemplate(value as string)
          )?.value
        : value;
      return acc;
    }, {} as Record<string, any>);
  }, []);

  // const handleApiResponse = useCallback(
  //   (result: any, outputConfig: { variableId?: string; jsonPath?: string }) => {
  //     if (!outputConfig?.variableId) return;

  //     const value = outputConfig.jsonPath ? _.get(result, outputConfig.jsonPath, result) : result;

  //     const variable = findVariable({
  //       type: 'apiResponse',
  //       id: outputConfig.variableId,
  //     });
  //     if (!variable) return;
  //     updateVariables({
  //       type: 'apiResponse',
  //       dataUpdate: {
  //         ...variable,
  //         value,
  //       },
  //     });
  //   },
  //   [updateVariables]
  // );

  const makeApiCall = async (
    apiCall: TApiCallValue,
    body: object,
    variableId: string
  ): Promise<any> => {
    const outputVariable = findVariable({
      type: 'apiResponse',
      id: variableId,
    });
    try {
      const response = await axios.request({
        method: apiCall?.method?.toUpperCase(),
        url: apiCall?.url,
        headers: apiCall?.headers || { 'Content-Type': 'application/json' },
        data: body,
      });

      if (outputVariable) {
        updateVariables({
          type: 'apiResponse',
          dataUpdate: {
            ...outputVariable,
            value: {
              data: response.data,
              statusCode: response.status,
              succeeded: true,
            },
          },
        });
      }

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (outputVariable) {
          updateVariables({
            type: 'apiResponse',
            dataUpdate: {
              ...outputVariable,
              value: {
                data: error,
                statusCode: error?.response?.status || 500,
                succeeded: false,
              },
            },
          });
        }
        return error;
      }
    }
  };

  const handleApiCallAction = async (action: TAction<TActionApiCall>): Promise<void> => {
    const apiCall = getApiMember(action?.data?.apiId ?? '');

    if (!apiCall) return;

    const variables = convertActionVariables(action?.data?.variables ?? [], apiCall);
    const newBody = convertApiCallBody(apiCall?.body, variables);
    const result = await makeApiCall(apiCall, newBody, action?.data?.output?.variableId ?? '');

    // handleApiResponse(result, action?.data?.output ?? {});

    if (result && action?.next) {
      await executeActionFCType(findAction(action.next));
    }
  };

  return { handleApiCallAction };
};
