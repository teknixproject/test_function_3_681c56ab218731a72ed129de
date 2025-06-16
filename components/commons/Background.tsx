'use client';

import _ from 'lodash';
import { CSSProperties, useMemo } from 'react';
import styled, { css } from 'styled-components';

import { useActions } from '@/hooks/useActions';
import { GridItem } from '@/types/gridItem';

interface BackgroundCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

const BackgroundCompo = ({ data, style }: BackgroundCompoProps) => {
  const defaultUrl = '/default-bg.png';
  const url = data?.dataSlice?.url || defaultUrl;
  const { handleAction } = useActions();

  const computedStyle: CSSProperties = useMemo(
    () => ({
      ...style,
      inset: 0,
      objectFit: _.get(style, 'objectFit') || 'fill',
      height: '100%',
    }),
    [style]
  );

  return (
    <Container
      id="background-compo"
      style={computedStyle}
      styledComponentCss={data?.styledComponentCss}
      onClick={() => handleAction('onClick')}
      onChange={() => handleAction('onChange')}
    >
      {url ? (
        url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) ? (
          <CsImg
            style={computedStyle}
            src={url}
            alt="Preview"
            className="w-full"
            styledComponentCss={data?.styledComponentCss}
          />
        ) : url.match(/\.(mp4|mov|avi|mkv|webm)$/i) ? (
          <CsVideo
            style={computedStyle}
            autoPlay
            loop
            muted
            playsInline
            className="w-full aspect-video"
            src={url}
            preload="metadata"
            styledComponentCss={data?.styledComponentCss}
          >
            <source src={`${url}.webm`} type="video/webm" />
            <source src={url} type="video/mp4" />
          </CsVideo>
        ) : (
          <p>Unsupported media type</p>
        )
      ) : null}
    </Container>
  );
};

interface StylesProps {
  style?: {
    hover?: CSSProperties;
    [key: string]: any;
  };
  styledComponentCss?: string;
}

const Container = styled.div<StylesProps>`
  ${(props) =>
    props.styledComponentCss
      ? css`
          ${props.styledComponentCss}
        `
      : ''}
`;

const CsImg = styled.img<StylesProps>`
  ${(props) =>
    props.styledComponentCss
      ? css`
          ${props.styledComponentCss}
        `
      : ''}
`;

const CsVideo = styled.video<StylesProps>`
  ${(props) =>
    props.styledComponentCss
      ? css`
          ${props.styledComponentCss}
        `
      : ''}
`;

export default BackgroundCompo;
