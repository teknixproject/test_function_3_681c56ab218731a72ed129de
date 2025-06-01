import { CSSProperties } from 'react';

import { useData } from '@/hooks';
import { getDeviceType } from '@/lib/utils';
import { GridItem } from '@/types/gridItem';

interface TitleHeaderProps {
  data: GridItem;
  style?: CSSProperties;
}

const TitleHeader = ({ data, style }: TitleHeaderProps) => {
  const deviceType = getDeviceType();
  const isMobile = deviceType === 'mobile';

  const { title } = useData({ layoutData: data });

  const newStyle = {
    letterSpacing: isMobile ? '0.1px' : '',
    lineHeight: '170%',
    ...style,
  };

  return (
    <h2 style={newStyle} className="heading-1 flex items-center gap-3 max-lg:inline">
      {title}
    </h2>
  );
};

export default TitleHeader;
