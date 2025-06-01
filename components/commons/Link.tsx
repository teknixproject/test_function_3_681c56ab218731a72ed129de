import _ from 'lodash';
import Link from 'next/link';
import { CSSProperties } from 'react';

import { GridItem } from '@/types/gridItem';

interface LinkCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

const LinkCompo = ({ data, style }: LinkCompoProps) => {
  const title = _.get(data, 'dataSlice.title', 'LinkCompo');
  const link = _.get(data, 'dataSlice.link', 'LinkCompo');

  const newStyle: CSSProperties = {
    ...style,
    wordBreak: 'break-word',
    textDecoration: 'underline',
    fontStyle: 'italic',
  };

  return (
    <Link style={newStyle} href={link} className="w-full flex flex-wrap" prefetch={true}>
      {title}
    </Link>
  );
};

export default LinkCompo;
