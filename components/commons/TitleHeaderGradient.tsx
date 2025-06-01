import { CSSProperties } from 'react';

import { useData } from '@/hooks';
import { getDeviceType } from '@/lib/utils';

const TitleHeaderGradient = ({ data, style }: { data?: any; style?: CSSProperties }) => {
  const deviceType = getDeviceType();
  const isMobile = deviceType === 'mobile';

  const { title } = useData({ layoutData: data, defaultTitle: 'Title Header Gradient' });

  const newStyle = {
    letterSpacing: isMobile ? '0.1px' : '',
    lineHeight: '170%',
    ...style,
  };

  return (
    <h2
      style={newStyle}
      className="heading-1 flex items-center gap-3 text-title-gradient max-lg:inline"
    >
      {title}
    </h2>
  );
};

export default TitleHeaderGradient;
