import _ from 'lodash';
import { useEffect, useRef } from 'react';

import { TAction, TConditional, TConditionalChild, TConditionChildMap } from '@/types';

import { actionHookSliceStore } from './actionSliceStore';
import { useHandleData } from './useHandleData';

export type TUseActions = {
  executeConditional: (action: TAction<TConditional>) => Promise<void>;
  handleCompareCondition: (conditionChildId: string, condition: TConditionChildMap) => boolean;
};

const evaluateCondition = (firstValue: any, secondValue: any, operator: string): boolean => {
  switch (operator) {
    case 'equal':
      return String(firstValue) === String(secondValue);
    case 'notEqual':
      return String(firstValue) !== String(secondValue);
    case 'greaterThan':
      return Number(firstValue) > Number(secondValue);
    case 'lessThan':
      return Number(firstValue) < Number(secondValue);
    case 'greaterThanOrEqual':
      return Number(firstValue) >= Number(secondValue);
    case 'lessThanOrEqual':
      return Number(firstValue) <= Number(secondValue);
    default:
      return false;
  }
};
type TProps = {
  executeActionFCType: (action?: TAction) => Promise<void>;
};
export const useConditionAction = ({ executeActionFCType }: TProps): TUseActions => {
  // State management

  // Store hooks
  const { findAction } = actionHookSliceStore();
  const { getData } = useHandleData({});
  // Memoized actions from data

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const getRootConditionChild = (condition: TConditionChildMap): TConditionalChild | undefined => {
    return Object.values(condition.childs).find((child) => !child.parentId);
  };
  const getConditionChild = (conditionId: string, condition: TConditionChildMap) => {
    return condition.childs[conditionId];
  };

  const getCompareValue = (compare: TConditionalChild['compare']): boolean => {
    const firstCompare = String(getData(compare?.firstValue));
    console.log('🚀 ~ getCompareValue ~ firstCompare:', firstCompare);
    const secondCompare = String(getData(compare?.secondValue));
    console.log('🚀 ~ getCompareValue ~ secondCompare:', secondCompare);
    if (!firstCompare || !secondCompare) return false;

    const resultCompare = evaluateCondition(firstCompare, secondCompare, compare.operator);
    console.log('🚀 ~ getCompareValue ~ resultCompare:', resultCompare);

    return resultCompare;
  };

  const handleCompareCondition = (
    conditionChildId: string,
    condition: TConditionChildMap
  ): boolean => {
    const conditionChild = getConditionChild(conditionChildId, condition);

    if (conditionChild.type === 'compare') {
      return getCompareValue(conditionChild.compare);
    }

    let firstValue;
    let secondValue;

    if (conditionChild.fistCondition) {
      firstValue = handleCompareCondition(conditionChild.fistCondition, condition);
    }

    if (conditionChild.secondCondition) {
      secondValue = handleCompareCondition(conditionChild.secondCondition, condition);
    }

    if (conditionChild.logicOperator === 'and') {
      return !!(firstValue && secondValue);
    }
    if (conditionChild.logicOperator === 'or') {
      return !!(firstValue || secondValue);
    }
    return !!(firstValue && secondValue);
  };
  //#region Action Execution

  const executeConditional = async (action: TAction<TConditional>): Promise<void> => {
    const conditions = action?.data?.conditions || [];
    if (_.isEmpty(conditions)) return;

    for (const condition of conditions) {
      const conditionChild = findAction(condition) as TAction<TConditionChildMap>;
      if (!conditionChild?.data) continue;

      const rootCondition = getRootConditionChild(conditionChild.data as TConditionChildMap);
      const isConditionMet = handleCompareCondition(
        rootCondition?.id as string,
        conditionChild.data
      );

      if (isConditionMet) {
        if (conditionChild.next) {
          await executeActionFCType(findAction(conditionChild.next));
        }
        break; // Exit after first matching condition
      }
    }

    if (action?.next) {
      await executeActionFCType(findAction(action.next));
    }
  };

  return { executeConditional, handleCompareCondition };
};
