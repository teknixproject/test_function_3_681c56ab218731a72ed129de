'use client';

import { CSSProperties } from 'react';

import { useActions } from '@/hooks/useActions';
import { useHandleData } from '@/hooks/useHandleData';
import { GridItem } from '@/types/gridItem';

interface ButtonCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

const Button = ({ data, style }: ButtonCompoProps) => {
  const { dataState } = useHandleData({ dataProp: data?.data });

  const { handleAction } = useActions(data);
  return (
    <button
      onClick={() => handleAction('onClick')}
      type="button"
      className="cursor-pointer"
      style={style}
    >
      {dataState || 'Button'}
    </button>
  );
};

export default Button;
