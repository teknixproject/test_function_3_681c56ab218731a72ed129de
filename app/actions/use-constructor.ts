'use client';

import _ from 'lodash';
import { useRef } from 'react';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
  return res.json();
};

export function useConstructorDataAPI(_documentId?: string, pageName?: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const prevComponentRef = useRef<string | null>(null);

  const { data, error } = useSWR(
    pageName
      ? `${API_URL}/api/client/getLayout?pId=${process.env.NEXT_PUBLIC_PROJECT_ID}&uid=${pageName}`
      : null,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 60000 }
  );

  if (error) {
    console.error('❌ Error fetching constructor:', error);
    return { layout: {}, component: {}, isLoading: false };
  }

  if (!data) {
    return {
      headerLayout: {},
      bodyLayout: {},
      footerLayout: {},
      component: {},
      isLoading: true,
    };
  }

  const componentString = data?.componentConfig?.component?.trim() || '';
  const isValidComponent = typeof componentString === 'string' && componentString;

  if (!isValidComponent) {
    console.error('❌ Error: componentString is missing or invalid.');
  } else if (componentString !== prevComponentRef.current) {
    console.log('🔄 Rebuilding component...');
    rebuilComponentMonaco(componentString);
    prevComponentRef.current = componentString;
  }

  return {
    headerLayout: _.get(data, 'data.headerLayout.layoutJson', {}),
    bodyLayout: _.get(data, 'data.bodyLayout.layoutJson', {}),
    footerLayout: _.get(data, 'data.footerLayout.layoutJson', {}),
    component: isValidComponent ? componentString : {},
    isLoading: false,
  };
}

export async function rebuilComponentMonaco(componentString: string) {
  try {
    if (!componentString || typeof componentString !== 'string') {
      console.error('Error: Invalid componentString', componentString);
      return;
    }
  } catch (error) {
    console.error('Build failed:', error);
  }
}

export function usePreviewUI(
  projectId?: string,
  uid?: string | null,
  sectionName?: string | null,
  userId?: string | null
) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const newUID = uid === 'null' ? uid : uid;
  const newSectionName = sectionName === 'null' ? sectionName : sectionName;

  const { data: dataPreviewUI } = useSWR(
    projectId
      ? `${API_URL}/api/preview-ui?projectId=${projectId}&uid=${newUID}&sectionName=${newSectionName}&userId=${userId}`
      : null,
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 60000 }
  );

  if (!dataPreviewUI) return { data: {}, isLoading: true };

  return {
    dataPreviewUI: dataPreviewUI?.data,
    isLoading: false,
  };
}
