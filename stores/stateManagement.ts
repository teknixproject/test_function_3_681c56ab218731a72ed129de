import { create } from 'zustand';
import { devtools } from 'zustand/middleware'; // Import devtools middleware

import {
  TDocumentState,
  TDocumentStateFind,
  TDocumentStateSet,
  TDocumentStateUpdate,
  TVariable,
} from '@/types';

export type TDocumentStateActions = {
  setStateManagement: (variable: TDocumentStateSet) => void;
  findVariable: (data: TDocumentStateFind) => TVariable | undefined;
  updateVariables: (data: TDocumentStateUpdate) => void;
  resetState: () => void;
};

const initValue: TDocumentState = {
  componentState: {},
  appState: {},
  globalState: {},
  apiResponse: {},
  dynamicGenerate: {},
};

// Sử dụng devtools middleware
export const stateManagementStore = create<TDocumentState & TDocumentStateActions>()(
  devtools(
    (set, get) => ({
      ...initValue,

      setStateManagement: ({ type, dataUpdate }) => {
        set(() => ({
          [type]: dataUpdate,
        }));
      },
      findVariable: ({ type, id }) => {
        const data = get()[type] || {};

        return data[id];
      },
      updateVariables: ({ type, dataUpdate }) => {
        set((state) => {
          // Reuse findVariable to check if the item exists

          return {
            [type]: {
              ...state[type],
              [dataUpdate.id]: dataUpdate,
            },
          };
        });
        return get()[type];
      },

      resetState() {
        set(initValue);
      },
    }),
    {
      name: 'stateManagementStore', // Tên của store trong Redux DevTools
    }
  )
);
