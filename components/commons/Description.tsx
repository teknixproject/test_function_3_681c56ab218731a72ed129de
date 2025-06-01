import { CSSProperties } from 'react';

import { useData } from '@/hooks';

interface DescriptionProps {
  data?: any;
  style?: CSSProperties;
}

const Description = ({ data, style }: DescriptionProps) => {
  const { title } = useData({ layoutData: data, defaultTitle: 'Description' });

  const newStyle: CSSProperties = {
    lineHeight: '170%',
    ...style,
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
  };

  return (
    <p style={newStyle} className="description text-pretty">
      {title}
    </p>
  );
};

export default Description;
