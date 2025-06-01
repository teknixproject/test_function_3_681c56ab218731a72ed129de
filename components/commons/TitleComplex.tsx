import _ from 'lodash';
import { CSSProperties } from 'react';
import styled from 'styled-components';

import { GridItem } from '@/types/gridItem';

interface TitleComplexCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

const TitleComplexCompo = ({ data, style }: TitleComplexCompoProps) => {
  const titles = _.get(data, 'dataSlice.titles', {});

  return (
    <h2
      style={{
        display: 'inline',
        ...style,
      }}
    >
      {Object.keys(titles).map((key) => {
        const isSpecial = titles[key]?.isSpecial;

        return isSpecial ? (
          <CsStrong
            key={key}
            style={{
              color: titles[key].color,
              flexShrink: 0,
              fontWeight: 'normal',
              ...style,
            }}
            gradient={titles[key].gradient}
          >
            {titles[key]?.text || ''}
          </CsStrong>
        ) : (
          titles[key]?.text
        );
      })}
    </h2>
  );
};

const CsStrong = styled.strong<{ gradient?: string }>`
  ${(props) =>
    props.gradient
      ? `
      background: linear-gradient(${props.gradient});
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `
      : ''}
`;

export default TitleComplexCompo;
