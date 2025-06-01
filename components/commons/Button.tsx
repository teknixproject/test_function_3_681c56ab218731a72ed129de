'use client';

import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CSSProperties, useMemo } from 'react';
import styled, { css } from 'styled-components';

import { useActions } from '@/hooks/useActions';
import { GridItem } from '@/types/gridItem';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ButtonCompoProps {
  data?: GridItem;
  style?: CSSProperties;
}

const Button = ({ data, style }: ButtonCompoProps) => {
  const title = _.get(data, 'dataSlice.title', 'Button');
  const iconStart = _.get(data, 'dataSlice.iconStart', null);
  const iconEnd = _.get(data, 'dataSlice.iconEnd', null);
  const link = _.get(data, 'dataSlice.link', '');
  const route = _.get(data, 'dataSlice.route', '');
  const router = useRouter();

  const { handleAction } = useActions(data);

  const isButtonGradient = _.get(data, 'isBtnGradient', false);

  const tooltip = useMemo(() => {
    return data?.tooltip;
  }, [data]);

  const handleRouteClick = () => {
    if (route) {
      router.push(route);
    }
  };

  if (isButtonGradient) {
    return (
      <button
        type="button"
        className="transition group flex items-center justify-center rounded-full bg-gradient-to-r from-[#1ECC97] to-[#5A60FC] p-[1.5px] text-[#1ECC97] duration-300 hover:shadow-2xl hover:shadow-purple-600/30"
        onClick={() => (route ? handleRouteClick() : handleAction('onClick'))}
      >
        <div className="px-[24px] py-[14px] max-sm:px-[16px] max-sm:py-[16px] text-[#1ECC97] flex h-full w-full items-center justify-center rounded-full bg-white transition duration-300 ease-in-out group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-900">
          Get Now
        </div>
      </button>
    );
  }

  const content = link ? (
    <Link href={link} passHref>
      <Container
        style={style}
        className="!text-16-500 rounded-full flex items-center gap-2 text-center"
        styledComponentCss={data?.styledComponentCss}
      >
        {iconStart && <span className="icon-start">{iconStart}</span>}
        <span>{title}</span>
        {iconEnd && <span className="icon-end">{iconEnd}</span>}
      </Container>
    </Link>
  ) : (
    <CsButton
      type="button"
      style={style}
      onClick={() => (route ? handleRouteClick() : handleAction('onClick'))}
      className="cursor-pointer"
      styledComponentCss={data?.styledComponentCss}
    >
      {iconStart && <span className="icon-start">{iconStart}</span>}
      <>{title}</>
      {iconEnd && <span className="icon-end">{iconEnd}</span>}
    </CsButton>
  );

  if (_.isEmpty(tooltip?.title)) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div style={style} className="text-[#858585]">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent style={tooltip?.style}>
          <p>{tooltip?.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const flexCenter = {
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
};
const CsButton = styled.button<StylesProps>`
  ${(props) =>
    props.styledComponentCss
      ? css`
          ${props.styledComponentCss}
        `
      : ''}
  box-sizing: border-box;
  ${(props) =>
    _.get(props, 'style.after')
      ? Object.entries(flexCenter)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
      : ''}
`;

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

export default Button;
