import _ from 'lodash';
import Image from 'next/image';
import React from 'react';
import styled, { css, CSSProperties } from 'styled-components';

import { useActions } from '@/hooks/useActions';
import { useHandleData } from '@/hooks/useHandleData';
import { cn } from '@/lib/utils';
import { GridItem } from '@/types/gridItem';

import { RenderSlice } from '../grid-systems';

interface CardProps {
  data: GridItem;
  style?: CSSProperties;
}

const Card: React.FC<CardProps> = ({ data, style }) => {
  const childs = _.get(data, 'childs', []);
  const { dataState } = useHandleData({ dataProp: data?.data });
  const { handleAction } = useActions();
  const newStyle: CSSProperties = {
    lineHeight: '170%',
    ...style,
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
  };

  const content = childs?.length
    ? childs.map((child) => (
        <RenderSlice slice={child} idParent={child.id ?? ''} key={child?.id ?? ''} />
      ))
    : dataState;

  return (
    <Container
      className="bg-gray-950 p-5"
      style={newStyle}
      onClick={() => handleAction('onClick')}
      onChange={() => handleAction('onChange')}
      styledComponentCss={data?.styledComponentCss}
    >
      <div
        className={cn(`p-[2px] size-52 bg-gray-700 rounded-md shadow-lg relative flex items-end`)}
      >
        <Image
          src="https://res.cloudinary.com/dubi5n4bw/image/upload/v1739516682/uploads/Background%2BOverlay%2BBorder%2BOverlayBlur.png"
          fill
          alt="review"
          className="absolute inset-0 z-2"
        />
        <div className="z-1 text-center text-white">{content}</div>
      </div>
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

export default Card;
