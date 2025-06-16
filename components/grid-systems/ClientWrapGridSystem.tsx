'use client';

import _ from 'lodash';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useConstructorDataAPI, usePreviewUI } from '@/app/actions/use-constructor';
import { getDeviceType } from '@/lib/utils';
import { actionService } from '@/services';
import { apiCallService } from '@/services/apiCall';
import { authSettingService } from '@/services/authSetting';
import { customFunctionService } from '@/services/customFunctionService';
import { stateManagerService } from '@/services/stateManagement';
import { apiResourceStore, layoutStore } from '@/stores';
import { actionsStore } from '@/stores/actions';
import { authSettingStore } from '@/stores/authSetting';
import { customFunctionStore } from '@/stores/customFunction';
import { pageActionsStore } from '@/stores/pageActions';
import { stateManagementStore } from '@/stores/stateManagement';
import { TAuthSetting, TTypeSelect, TTypeSelectState, TVariable, TVariableMap } from '@/types';

import DynamicComponent from './preview-ui';

type DeviceType = 'mobile' | 'desktop';

const GridSystemContainer = dynamic(() => import('@/components/grid-systems'), {
  loading: () => <LoadingPage />,
  ssr: false,
});

const LoadingPage = dynamic(() => import('./loadingPage'), {
  ssr: false,
});

export default function ClientWrapper(props: any) {
  const isPreviewUI = _.get(props, 'pathName[0]') === 'preview-ui';
  const resetAuthSettings = authSettingStore((state) => state.reset);

  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const getAuthSettings = async () => {
    try {
      const result = await authSettingService.get({ projectId });
      resetAuthSettings(result?.data);
    } catch (error) {
      console.log('🚀 ~ getAuthSettings ~ error:', error);
    }
  };
  useEffect(() => {
    getAuthSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  console.log('isPreviewUI', props)

  if (isPreviewUI) {
    return <PreviewUI {...props} />;
  }
  return <RenderUIClient {...props} />;
}

const setUid = (searchParams: any, pathname: string, defaultUid: string) => {
  if (searchParams.get('uid')) {
    return searchParams.get('uid');
  }
  if (pathname === '/') {
    return defaultUid;
  }
  if (pathname.slice(1) && pathname.slice(1) !== 'preview-ui') {
    return pathname.slice(1);
  }
};

const RenderUIClient = (props: any) => {
  //#region store
  const { setData } = layoutStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { addAndUpdateApiResource, apiResources } = apiResourceStore();
  const { setStateManagement, findVariable } = stateManagementStore();

    // #region hooks
  const pathname = usePathname(); 
  const searchParams = useSearchParams();
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const router = useRouter();
  const uid = setUid(searchParams, pathname, process.env.NEXT_PUBLIC_DEFAULT_UID as string);
  const setCustomFunctions = customFunctionStore((state) => state.setCustomFunctions);
  
  const { setActions } = actionsStore();
  const { enable, pages, entryPage } = authSettingStore();

  const newPathName =
  Array.isArray(props?.pathName)
    ? props.pathName.join('/')
    : props?.pathName || '';
  const { bodyLayout, isLoading } = useConstructorDataAPI(props?.documentId, newPathName);

  useEffect(() => {
    if (bodyLayout) setData(bodyLayout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType());
  const selectedBodyLayout = bodyLayout[deviceType] ?? bodyLayout ?? {};

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [props?.page]);

  const getStates = async () => {
    const list: TTypeSelectState[] = [
      'parameters',
      'appState',
      'componentState',
      'globalState',
      'apiResponse',
      'dynamicGenerate',
    ];
    try {
      await Promise.all(
        list.map(async (type: TTypeSelectState) => {
          const result = await stateManagerService.getData(
            type === 'globalState'
              ? {
                  projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
                  type,
                }
              : {
                  uid: uid ?? '/',
                  projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
                  type,
                }
          );
          if (_.isEmpty(result?.data)) return;
          const { state } = result?.data;
          if (_.isEmpty(state)) return;

          if (state) {
            setStateManagement({
              type,
              dataUpdate: state.reduce((acc: TVariableMap, item: TVariable) => {
                return {
                  ...acc,
                  [item.id]: item,
                };
              }, {}),
            });
          }
        })
      );
    } catch (error) {
      console.log('🚀 ~ getStates ~ error:', error);
    }
  };

  const getActions = async () => {
    try {
      const result = await actionService.getData({
        uid: uid,
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      if (_.isEmpty(result?.data?.data)) return;
      setActions(result.data.data);
    } catch (error) {
      console.log('🚀 ~ getStates ~ error:', error);
    }
  };

  const getApiCall = async () => {
    try {
      const result = await apiCallService.getAll({
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      addAndUpdateApiResource({ apis: result?.data?.apis });
    } catch (error) {
      console.log('🚀 ~ getApiCall ~ error:', error);
    }
  };
  const getCustomFunctions = async () => {
    try {
      const result = await customFunctionService.getAll({
        uid: uid || '',
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      setCustomFunctions(result.data);
    } catch (error) {
      console.log('🚀 ~ getCustomFunctions ~ error:', error);
    }
  };
  useEffect(() => {
    if (enable) {
      const pageRole = pages.find(
        (item: TAuthSetting['pages'][number]) => item.documentId.uid === pathname
      );
      if (pageRole?.required) {
        const roles = pageRole?.roles?.map((item) => item.value);
        const role = localStorage.getItem('role') || localStorage.getItem('ROLE') || '';
        const check = () => {
          return roles?.includes(role);
        };
        const checkRole = check();

        if (!checkRole) {
          if (entryPage) {
            router.push(entryPage);
          }
        }
      }
    }
  }, [enable, findVariable, entryPage, pages, pathname, router]);
  useEffect(() => {
    if (!projectId) return;
    async function fetchData() {
      await Promise.all([getStates(), getActions(), getApiCall(), getCustomFunctions()]);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, projectId]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="relative">
      {!_.isEmpty(selectedBodyLayout) && (
        <GridSystemContainer
          isLoading={isLoading}
          {...props}
          page={selectedBodyLayout || {}}
          deviceType={deviceType}
          isBody
        />
      )}
    </div>
  );
};

const PreviewUI = (props: any) => {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const setCustomFunctions = customFunctionStore((state) => state.setCustomFunctions);
  const uid = setUid(searchParams, pathname, process.env.NEXT_PUBLIC_DEFAULT_UID as string);
  const projectId = searchParams.get('projectId');
  const sectionName = searchParams.get('sectionName');
  const userId = searchParams.get('userId');
  const customWidgetName = searchParams.get('customWidgetName');

  //#region store
  const { setData } = layoutStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { addAndUpdateApiResource, apiResources } = apiResourceStore();
  const { setStateManagement } = stateManagementStore();
  const { setActions } = pageActionsStore();

  // #region hooks
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const { dataPreviewUI, isLoading } = usePreviewUI(projectId ?? '', uid, sectionName, userId);

  // #region state
  const state = _.get(dataPreviewUI, 'state');
  const isPage = _.get(dataPreviewUI, 'typePreview') === 'page';

  const headerLayout = dataPreviewUI?.headerLayout?.layoutJson || dataPreviewUI?.headerLayout;
  const bodyLayout = dataPreviewUI?.bodyLayout?.layoutJson || dataPreviewUI?.bodyLayout;
  const footerLayout = dataPreviewUI?.footerLayout?.layoutJson || dataPreviewUI?.footerLayout;

  const selectedHeaderLayout = !_.isEmpty(headerLayout) ? headerLayout[deviceType] : {};
  const selectedBodyLayout = !_.isEmpty(bodyLayout) ? bodyLayout[deviceType] : {};
  const selectedFooterLayout = !_.isEmpty(footerLayout) ? footerLayout[deviceType] : {};

  //#region function
  useEffect(() => {
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getActions = async () => {
    try {
      const result = await actionService.getData({
        uid: uid || process.env.NEXT_PUBLIC_DEFAULT_UID || '',
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      if (_.isEmpty(result?.data)) return;
      setActions(result.data);
    } catch (error) {
      console.log('🚀 ~ getStates ~ error:', error);
    }
  };
  const getApiCall = async () => {
    try {
      const result = await apiCallService.getAll({
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      addAndUpdateApiResource({ apis: result?.data?.apis });
    } catch (error) {
      console.log('🚀 ~ getApiCall ~ error:', error);
    }
  };
  const getCustomFunctions = async () => {
    try {
      const result = await customFunctionService.getAll({
        uid: uid || '',
        projectId: projectId || process.env.NEXT_PUBLIC_PROJECT_ID || '',
      });
      setCustomFunctions(result.data);
    } catch (error) {
      console.log('🚀 ~ getCustomFunctions ~ error:', error);
    }
  };
  const setStateFormDataPreview = () => {
    if (!_.isEmpty(state)) {
      ['appState', 'globalState', 'componentState', 'apiResponse', 'dynamicGenerate'].forEach(
        (type) => {
          setStateManagement({
            type: type as TTypeSelect,
            dataUpdate: state[type],
          });
        }
      );
    }
  };

  useEffect(() => {
    if (bodyLayout) setData(bodyLayout);
    async function fetchData() {
      await Promise.all([
        setStateFormDataPreview(),
        getActions(),
        getApiCall(),
        getCustomFunctions(),
      ]);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, projectId, bodyLayout]);

  //#region render
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="component-preview-container">
      {isPage && !customWidgetName ? (
        <div className="relative flex flex-col justify-between min-h-screen">
          {!_.isEmpty(selectedHeaderLayout) && (
            <GridSystemContainer
              isLoading={isLoading}
              {...props}
              page={selectedHeaderLayout || {}}
              deviceType={deviceType}
              isHeader
            />
          )}

          {!_.isEmpty(selectedBodyLayout) ? (
            <GridSystemContainer
              isLoading={isLoading}
              {...props}
              page={selectedBodyLayout || {}}
              deviceType={deviceType}
              isBody
            />
          ) : (
            <div className="h-[300px]" />
          )}

          {!_.isEmpty(selectedFooterLayout) && (
            <GridSystemContainer
              isLoading={isLoading}
              {...props}
              page={selectedFooterLayout || {}}
              deviceType={deviceType}
              isFooter
            />
          )}
        </div>
      ) : (
        <DynamicComponent customWidgetName={customWidgetName} />
      )}
    </div>
  );
};
