import _ from 'lodash';
import { CSSProperties } from 'react';

import { GridItem } from '@/types/gridItem';

interface IconCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

const IconCompo = ({ data }: IconCompoProps) => {
  const url = _.get(data, 'dataSlice.url');

  return url ? (
    <img src={url} alt="Image" className="w-full h-full" />
  ) : (
    <img src="/default-icon.png" alt="default-icon" />
  );
};

export default IconCompo;
