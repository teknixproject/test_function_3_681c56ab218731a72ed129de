/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useEffect } from 'react';

import { actionService, apiCallService } from '@/services';
import { customFunctionService } from '@/services/customFunctionService';
import { apiResourceStore, stateManagementStore } from '@/stores';
import { customFunctionStore } from '@/stores/customFunction';
import { pageActionsStore } from '@/stores/pageActions';
import { TTypeSelect } from '@/types';

export const useInitState: {
  (props: { projectId: string | undefined; uid: string | undefined; state?: any }): void;
} = ({ projectId, uid, state }) => {
  const { addAndUpdateApiResource } = apiResourceStore();
  const { setStateManagement } = stateManagementStore();
  const { setActions } = pageActionsStore();
  const setCustomFunctions = customFunctionStore((state) => state.setCustomFunctions);
  const getActions = async () => {
    try {
      const result = await actionService.getData({
        uid: uid || process.env.NEXT_PUBLIC_DEFAULT_UID || '',
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      console.log('🚀 ~ getActions ~ result:', result);
      if (_.isEmpty(result?.data)) return;
      setActions(result.data);
    } catch (error) {
      console.log('🚀 ~ getStates ~ error:', error);
    }
  };
  const getApiCall = async () => {
    try {
      const result = await apiCallService.get({
        uid: uid || process.env.NEXT_PUBLIC_DEFAULT_UID || '',
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      addAndUpdateApiResource({ apis: result?.data?.apis });
    } catch (error) {
      console.log('🚀 ~ getApiCall ~ error:', error);
    }
  };
  const getCustomFunctions = async () => {
    try {
      const result = await customFunctionService.getAll({
        uid: uid || '',
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      setCustomFunctions(result.data);
    } catch (error) {
      console.log('🚀 ~ getCustomFunctions ~ error:', error);
    }
  };
  const setStateFormDataPreview = () => {
    if (!_.isEmpty(state)) {
      ['appState', 'globalState', 'componentState', 'apiResponse', 'dynamicGenerate'].forEach(
        (type) => {
          setStateManagement({
            type: type as TTypeSelect,
            dataUpdate: state[type],
          });
        }
      );
    }
  };
  useEffect(() => {
    (async () => {
      await Promise.all([
        getActions(),
        getApiCall(),
        getCustomFunctions(),
        setStateFormDataPreview(),
      ]);
    })();
  }, [projectId, uid, state]);
};
