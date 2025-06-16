'use client';

import _ from 'lodash';
import { CSSProperties } from 'react';

import { useActions } from '@/hooks/useActions';
import { getDeviceType } from '@/lib/utils';
import { GridItem } from '@/types/gridItem';

interface BannerVideoCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

const isVideo = (url: string) => /\.(mp4|mov|avi|mkv|webm)(\?.*)?$/i.test(url);

const BannerVideo = ({ data, style }: BannerVideoCompoProps) => {
  const url = _.get(data, 'media.url', '/assets/videos/intro.mov');
  const sizeScreen = getDeviceType();
  const isMobile = sizeScreen === 'mobile';

  const newStyle: CSSProperties | undefined = {
    ...style,
    inset: 0,
    objectFit: 'fill',
    height: isMobile ? '100%' : 'auto',
  };
  const { handleAction } = useActions();
  if (!isVideo(url)) return <div style={newStyle}>Unsupported media type</div>;
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      style={newStyle}
      controls
      preload="metadata"
      onClick={() => handleAction('onClick')}
      onChange={() => handleAction('onChange')}
    >
      <source src={url} type="video/mp4" />
      <source src={url.replace(/\.\w+$/, '.webm')} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
};

export default BannerVideo;
