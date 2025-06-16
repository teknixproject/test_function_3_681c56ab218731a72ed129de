import _ from 'lodash';
import { CSSProperties } from 'react';

import { useActions } from '@/hooks/useActions';
import { GridItem } from '@/types/gridItem';

interface IconCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

const IconCompo = ({ data }: IconCompoProps) => {
  const url = _.get(data, 'media.url');
  const { handleAction } = useActions();
  return url ? (
    <img src={url} alt="Image" className="w-full h-full" onClick={() => handleAction('onClick')} />
  ) : (
    <img src="/default-icon.png" alt="default-icon" onClick={() => handleAction('onClick')} />
  );
};

export default IconCompo;
