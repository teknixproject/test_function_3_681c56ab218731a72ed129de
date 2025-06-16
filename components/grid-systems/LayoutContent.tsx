'use client';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';

import { getDeviceType } from '@/lib/utils';
import { useLayoutContext } from '@/context/LayoutContext';
import { useGetModalUI } from '@/app/actions/use-constructor';

import LoadingPage from './loadingPage';
import Modal from '../commons/Modal';

const GridSystemContainer = dynamic(() => import('@/components/grid-systems'), {
  loading: () => <LoadingPage />,
  ssr: false,
});

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { headerLayout, footerLayout, headerPosition } = useLayoutContext();
  const [deviceType, setDeviceType] = useState(getDeviceType());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedHeaderLayout = useMemo(
    () =>
      (headerLayout?.layoutJson && (headerLayout?.layoutJson as any)[deviceType]) ??
      headerLayout?.layoutJson ??
      {},
    [headerLayout, deviceType]
  );
  const selectedFooterLayout = useMemo(
    () =>
      (footerLayout?.layoutJson && (footerLayout?.layoutJson as Record<string, any>)[deviceType]) ??
      footerLayout?.layoutJson ??
      {},
    [footerLayout, deviceType]
  );

  const containerStyle = useMemo(() => {
    if (headerPosition === 'left' || headerPosition === 'right') {
      return {
        display: 'flex',
      };
    }
    return {
      display: 'flex',
    };
  }, [headerPosition]);

  const headerStyle = useMemo(() => {
    if (headerPosition === 'left') {
      return {
        // width: '250px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 10,
      };
    } else if (headerPosition === 'right') {
      return {
        // width: '250px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        order: 2,
        zIndex: 10,
      };
    }
    return {
      position: 'fixed',
      top: 0,
      zIndex: 3,
    };
  }, [headerPosition]);

  return (
    <div className="relative !z-0">
      <div className="z-10" style={containerStyle as any}>
        {!_.isEmpty(selectedHeaderLayout) && (
          <GridSystemContainer
            page={selectedHeaderLayout}
            deviceType={deviceType}
            isHeader
            style={headerStyle}
          />
        )}
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      {!_.isEmpty(selectedFooterLayout) && (
        <GridSystemContainer
          page={selectedFooterLayout}
          deviceType={deviceType}
          isFooter
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
}

export const RenderModal: React.FC<any> = () => {
  const { data: dataModal } = useGetModalUI();
  return _.map(dataModal, (item) => <Modal key={item?._id} data={item} false></Modal>);
};
