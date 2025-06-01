'use client';

import _ from 'lodash';
import { CSSProperties, useEffect, useState } from 'react';

import { getDeviceType } from '@/lib/utils';
import { GridItem } from '@/types/gridItem';
import styled, { css } from 'styled-components';

interface BannerVideoCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

interface StylesProps {
  style?: {
    hover?: CSSProperties;
    [key: string]: any;
  };
  styledComponentCss?: string;
}

const Container = styled.video<StylesProps>`
  ${(props) =>
    props.styledComponentCss
      ? css`
          ${props.styledComponentCss}
        `
      : ''}
`;

const BannerVideo = ({ data, style }: BannerVideoCompoProps) => {
  const linkVideo = _.get(data, 'dataSlice.url', '/assets/videos/intro.mov');
  const [isInView, setIsInView] = useState(false);
  const sizeScreen = getDeviceType();
  const isMobile = sizeScreen === 'mobile';

  const newStyle: CSSProperties | undefined = {
    ...style,
    inset: 0,
    objectFit: 'fill',
    height: isMobile ? '100%' : 'auto',
  };

  useEffect(() => {
    const handleScroll = () => {
      const rect = document.getElementById('banner-video')?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        setIsInView(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="banner-video">
      {isInView ? (
        <Container
          autoPlay
          loop
          muted
          playsInline
          className="w-full aspect-video"
          style={newStyle}
          preload="metadata"
          styledComponentCss={data?.styledComponentCss}
        >
          <source src={`${linkVideo}.webm`} type="video/webm" />
          <source src={linkVideo} type="video/mp4" />
        </Container>
      ) : (
        <Container
          style={newStyle}
          autoPlay
          loop
          muted
          playsInline
          className="w-full aspect-video max-sm:h-full"
          src={linkVideo}
          preload="metadata"
          styledComponentCss={data?.styledComponentCss}
        >
          <source src={`${linkVideo}.webm`} type="video/webm" />
          <source src={linkVideo} type="video/mp4" />
        </Container>
      )}
    </div>
  );
};

export default BannerVideo;
