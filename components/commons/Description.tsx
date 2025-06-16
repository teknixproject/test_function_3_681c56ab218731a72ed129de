import { CSSProperties } from 'react';

import { useActions } from '@/hooks/useActions';
import { useHandleData } from '@/hooks/useHandleData';

interface DescriptionProps {
  data?: any;
  style?: CSSProperties;
}

const Description = ({ data, style }: DescriptionProps) => {
  const { dataState } = useHandleData({ dataProp: data?.data });
  const newStyle: CSSProperties = {
    lineHeight: '170%',
    ...style,
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
  };
  const { handleAction } = useActions();
  return (
    <p
      style={newStyle}
      className="description text-pretty"
      onClick={() => handleAction('onClick')}
      onChange={() => handleAction('onChange')}
    >
      {dataState}
    </p>
  );
};

export default Description;
