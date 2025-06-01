import _ from 'lodash';
import { CSSProperties } from 'react';

import { GridItem } from '@/types/gridItem';
import styled, { css } from 'styled-components';

interface ImageProps {
  data?: GridItem;
  style?: CSSProperties;
}

const Image = ({ data, style }: ImageProps) => {
  const url = _.get(data, 'dataSlice.url', '/default-bg.png');

  const newStyle: CSSProperties = {
    ...style,
    position: 'initial',
    transform: '',
    margin: 0,
    padding: 0,
    maxHeight: '',
    maxWidth: '',
    width: '100%',
    height: '100%',
  };

  const isBg = _.get(style, 'background');

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      className="relative overflow-hidden flex items-center justify-center"
    >
      <CsImg
        style={newStyle}
        src={url}
        alt="Image"
        className="w-full h-full object-cover"
        styledComponentCss={data?.styledComponentCss}
      />
      {isBg && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isBg as string,
          }}
        ></div>
      )}
    </div>
  );
};

interface StylesProps {
  style?: {
    hover?: CSSProperties;
    [key: string]: any;
  };
  styledComponentCss?: string;
}

const CsImg = styled.img<StylesProps>`
  ${(props) =>
    props.styledComponentCss
      ? css`
          ${props.styledComponentCss}
        `
      : ''}
`;

export default Image;
