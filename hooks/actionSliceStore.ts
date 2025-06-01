import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { TAction, TTriggerActions, TTriggerValue } from '@/types';

type TState = {
  actions: TTriggerActions;
  triggerName: TTriggerValue;
};
type TActions = {
  setActions: (actions: TTriggerActions) => void;
  setTriggerName: (triggerName: TTriggerValue) => void;
  setMultipleActions: (data: TState) => void;
  findAction: (actionId: string) => TAction | undefined;
  reset: () => void;
};
export const actionHookSliceStore = create<TState & TActions>()(
  devtools(
    (set, get) => ({
      actions: {},
      triggerName: 'onClick',
      setActions: (actions: TTriggerActions) => set(() => ({ actions })),
      setTriggerName: (triggerName: TTriggerValue) => set(() => ({ triggerName })),
      findAction: (actionId: string) => {
        return get().actions[get().triggerName]?.[actionId] || undefined;
      },
      setMultipleActions(data) {
        set(() => ({
          actions: data.actions,
          triggerName: data.triggerName,
        }));
      },
      reset: () => set(() => ({ actions: {}, triggerName: 'onClick' })),
    }),
    { name: 'actionHookSliceStore' }
  )
);
