import _ from 'lodash';
import { CSSProperties } from 'react';
import styled, { css } from 'styled-components';

import { useActions } from '@/hooks/useActions';
import { GridItem } from '@/types/gridItem';

interface ImageProps {
  data?: GridItem;
  style?: CSSProperties;
}

const Image = ({ data, style }: ImageProps) => {
  const url = _.get(data, 'media.url', '/default-bg.png');
  const { handleAction } = useActions();
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
      onClick={() => handleAction('onClick')}
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
