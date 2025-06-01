import { useRouter } from 'next/navigation';

import { TAction, TActionNavigate } from '@/types';

import { actionHookSliceStore } from './actionSliceStore';

export type TUseActions = {
  handleNavigateAction: (action: TAction<TActionNavigate>) => Promise<void>;
};

type TProps = {
  executeActionFCType: (action?: TAction) => Promise<void>;
};
export const useNavigateAction = ({ executeActionFCType }: TProps): TUseActions => {
  const router = useRouter();
  const findAction = actionHookSliceStore((state) => state.findAction);

  const handleNavigateAction = async (action: TAction<TActionNavigate>): Promise<void> => {
    console.log('🚀 ~ handleNavigateAction ~ action:', action);
    const { url, isExternal, isNewTab } = action?.data || {};

    if (!url) return;

    if (isNewTab) {
      window.open(url, '_blank');
    } else if (isExternal) {
      window.location.href = url;
    } else {
      router.push(url);
    }

    if (action?.next) {
      await executeActionFCType(findAction(action.next));
    }
  };
  //#endregion

  return { handleNavigateAction };
};
