/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  TAction,
  TActionApiCall,
  TActionNavigate,
  TActionUpdateState,
  TConditional,
  TTriggerActions,
  TTriggerValue,
} from '@/types';

import { actionHookSliceStore } from './actionSliceStore';
import { useApiCallAction } from './useApiCallAction';
import { useConditionAction } from './useConditionAction';
import { useNavigateAction } from './useNavigateAction';
import { useUpdateStateAction } from './useUpdateStateAction';

export type TUseActions = {
  multiples: Record<string, React.MouseEventHandler<HTMLButtonElement>>;
};
type TProps = {
  actionsProp: {
    name: string;
    type: any;
    data: any;
  }[];
};
export const usePageActions = ({ actionsProp }: TProps): TUseActions => {
  const actionsReal = useMemo(
    () => actionsProp?.filter((item) => item.type.includes('MouseEventHandler')),
    [actionsProp]
  );
  const { setMultipleActions } = actionHookSliceStore();
  const triggerNameRef = useRef<TTriggerValue>('onClick');

  const actionsMap = useMemo(() => {
    const map: Record<string, TTriggerActions> = {};
    actionsReal?.forEach((item) => {
      if (!_.isEmpty(item.data)) {
        map[item.name] = item.data;
      }
    });
    return map;
  }, [actionsReal]);

  useEffect(() => {
    setMultipleActions({
      actions: actionsMap[triggerNameRef.current] || {},
      triggerName: triggerNameRef.current,
    });
  }, [actionsMap]);

  const executeActionFCType = useCallback(async (action?: TAction): Promise<void> => {
    if (!action?.fcType) return;

    switch (action.fcType) {
      case 'action':
        await executeAction(action as TAction<TActionApiCall>);
        break;
      case 'conditional':
        await executeConditional(action as TAction<TConditional>);
        break;
      default:
        console.warn(`Unknown fcType: ${action.fcType}`);
    }
  }, []);

  const { handleApiCallAction } = useApiCallAction({
    executeActionFCType,
  });

  const { executeConditional } = useConditionAction({
    executeActionFCType,
  });

  const { handleUpdateStateAction } = useUpdateStateAction({
    executeActionFCType,
  });

  const { handleNavigateAction } = useNavigateAction({
    executeActionFCType,
  });

  const executeAction = useCallback(
    async (action: TAction): Promise<void> => {
      if (!action) return;

      try {
        switch (action.type) {
          case 'navigate':
            return handleNavigateAction(action as TAction<TActionNavigate>);
          case 'apiCall':
            return handleApiCallAction(action as TAction<TActionApiCall>);
          case 'updateStateManagement':
            return handleUpdateStateAction(action as TAction<TActionUpdateState>);
          default:
            console.warn(`Unknown action type: ${action.type}`);
        }
      } catch (error) {
        console.error(`Error executing action ${action.id}:`, error);
      }
    },
    [handleApiCallAction, handleNavigateAction, handleUpdateStateAction]
  );

  const executeTriggerActions = async (
    actions: TTriggerActions,
    triggerType: TTriggerValue
  ): Promise<void> => {
    const actionsToExecute = actions[triggerType];
    setMultipleActions({ actions, triggerName: triggerType });
    if (!actionsToExecute) return;

    const rootAction = Object.values(actionsToExecute).find((action) => !action.parentId);
    if (rootAction) {
      await executeActionFCType(rootAction);
    }
  };
  const handleAction = useCallback(
    (actionName: string) =>
      async (triggerType: TTriggerValue = 'onClick'): Promise<void> => {
        if (!actionsMap[actionName]) return;
        triggerNameRef.current = triggerType;
        await executeTriggerActions(actionsMap[actionName], triggerType);
      },
    [actionsMap, executeTriggerActions]
  );

  const multiples = useMemo(() => {
    const result: Record<string, React.MouseEventHandler<HTMLButtonElement>> = {};

    actionsReal?.forEach((item) => {
      if (!_.isEmpty(item.data)) {
        result[item.name] = async (e) => {
          e?.preventDefault?.();
          await handleAction(item.name)();
        };
      }
    });

    return result;
  }, [handleAction, actionsReal]);

  return { multiples };
};
