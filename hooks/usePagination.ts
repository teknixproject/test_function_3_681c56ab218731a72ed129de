import axios from 'axios';
import _ from 'lodash';
import queryString from 'query-string';

import { useApiCallStore } from '@/providers';
import { layoutStore, TApiData } from '@/stores';
import { GridItem } from '@/types/gridItem';

const findComponentHaveAPI = (
  component: GridItem,
  apiCallPagination: TApiData
): GridItem | null => {
  console.log('🚀 ~ component:', { component, apiCallPagination });
  // Kiểm tra component hiện tại
  if (component?.valueRender?.apiCall?.id === apiCallPagination.id) {
    return component;
  }

  // Kiểm tra các childs
  if (component?.childs?.length) {
    for (const child of component.childs) {
      const foundComponent = findComponentHaveAPI(child, apiCallPagination);
      if (foundComponent) {
        return foundComponent; // Trả về component nếu tìm thấy
      }
    }
  }

  // Trả về null nếu không tìm thấy
  return null;
};
export const usePagination = () => {
  const { data: layout } = layoutStore();
  const { updateApiData, apiData } = useApiCallStore((state) => state);

  const updateData = async (pagination: any, pageValue: number) => {
    if (!pagination?.valueRender?.apiCall?.url) return;

    const desktop = layout?.desktop;
    const dynamicGenarateDiv = findComponentHaveAPI(desktop, pagination.valueRender.apiCall);
    console.log('🚀 ~ updateData ~ dynamicGenarateDiv:', dynamicGenarateDiv);
    if (!dynamicGenarateDiv) return;
    const {
      page: pageString,
      limit: limitString,
      skip: skipString,
    } = pagination?.valueRender?.apiCall?.queryConvert ?? {};

    // handle old url
    const query = queryString.parseUrl(dynamicGenarateDiv.valueRender?.apiCall?.url ?? '');
    const skipValue = (pageValue - 1) * parseInt((query.query?.limit as string) ?? 1);

    console.log('usePagination', { pageString, limitString, skipString, skipValue });

    //update new url
    _.update(dynamicGenarateDiv, 'valueRender.apiCall.url', (url) =>
      queryString.stringifyUrl({
        url,
        query: {
          ...query.query,
          [pageString ?? 'page']: pageValue,
          [limitString ?? 'skip']: query?.query?.limit,
          [skipString ?? 'limit']: skipValue,
        },
      })
    );

    // updateUrlForChilds(dynamicGenarateDiv!, dynamicGenarateDiv?.valueRender?.apiCall?.url ?? '');
    const existedApiData = apiData.find(
      (item) => item.id === dynamicGenarateDiv?.valueRender?.apiCall?.id
    );

    try {
      const { url, method } = dynamicGenarateDiv?.valueRender?.apiCall ?? {};
      const updateValueApi = (await axios.request({ url, method: method?.toLocaleLowerCase() }))
        .data;
      if (!_.isEmpty(existedApiData)) updateApiData(existedApiData.id, updateValueApi);
      return updateValueApi;
    } catch (error) {
      console.log('🚀 ~ handlePageClick ~ error:', error);
      return null;
    }
  };
  return { updateData };
};
