/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
    TAction, TActionApiCall, TActionCustomFunction, TActionLoop, TActionNavigate,
    TActionUpdateState, TConditional, TTriggerActions, TTriggerValue
} from '@/types';
import { GridItem } from '@/types/gridItem';

import { actionHookSliceStore } from './actionSliceStore';
import { useApiCallAction } from './useApiCallAction';
import { useConditionAction } from './useConditionAction';
import { useCustomFunction } from './useCustomFunction';
import { useLoopActions } from './useLoopActions';
import { useNavigateAction } from './useNavigateAction';
import { useUpdateStateAction } from './useUpdateStateAction';

export type TUseActions = {
  handleAction: (triggerType: TTriggerValue, action?: TTriggerActions) => Promise<void>;
};

export const useActions = (data?: GridItem): TUseActions => {
  const actions = useMemo(() => _.get(data, 'actions') as TTriggerActions, [data]);
  const { setMultipleActions } = actionHookSliceStore();

  const executeActionFCType = async (action?: TAction): Promise<void> => {
    if (!action?.fcType) return;

    switch (action.fcType) {
      case 'action':
        await executeAction(action as TAction<TActionApiCall>);
        break;
      case 'conditional':
        await executeConditional(action as TAction<TConditional>);
        break;
      case 'loop':
        await executeLoopOverList(action as TAction<TActionLoop>);
        break;

      default:
        console.warn(`Unknown fcType: ${action.fcType}`);
    }
  };

  const { handleApiCallAction } = useApiCallAction({ executeActionFCType });
  const { executeConditional } = useConditionAction({ executeActionFCType });
  const { handleUpdateStateAction } = useUpdateStateAction({
    executeActionFCType,
  });
  const { handleNavigateAction } = useNavigateAction({ executeActionFCType });
  const { executeLoopOverList } = useLoopActions({ executeActionFCType });
  const { handleCustomFunction } = useCustomFunction({ executeActionFCType });

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);
  const executeAction = async (action: TAction): Promise<void> => {
    if (!action) return;

    try {
      switch (action.type) {
        case 'navigate':
          return handleNavigateAction(action as TAction<TActionNavigate>);
        case 'apiCall':
          return handleApiCallAction(action as TAction<TActionApiCall>);
        case 'updateStateManagement':
          return handleUpdateStateAction(action as TAction<TActionUpdateState>);
        case 'customFunction':
          return handleCustomFunction(action as TAction<TActionCustomFunction>);
        default:
          console.warn(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Error executing action ${action.id}:`, error);
    }
  };

  const executeTriggerActions = async (
    triggerActions: TTriggerActions,
    triggerType: TTriggerValue
  ): Promise<void> => {
    const actionsToExecute = triggerActions[triggerType];
    setMultipleActions({
      actions: triggerActions,
      triggerName: triggerType,
    });
    if (!actionsToExecute) return;

    // Find and execute the root action (parentId === null)
    const rootAction = Object.values(actionsToExecute).find((action) => !action.parentId);
    if (rootAction) {
      if (rootAction.delay) {
        await new Promise((resolve) => setTimeout(resolve, rootAction.delay));
      }
      await executeActionFCType(rootAction);
    }
  };
  const handleAction = useCallback(
    async (triggerType: TTriggerValue, action?: TTriggerActions): Promise<void> => {
      if (!data?.actions) return;
      await executeTriggerActions(action || data.actions, triggerType);
    },
    [data?.actions, executeTriggerActions]
  );

  useEffect(() => {
    if (mounted.current && !_.isEmpty(actions) && 'onPageLoad' in actions) {
      handleAction('onPageLoad');
    }
  }, [mounted.current]);
  if (!data)
    return {
      handleAction: () => Promise.resolve(),
    };
  return { handleAction };
};
