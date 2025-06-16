import _ from 'lodash';

import { TCustomFunction, TTypeVariable } from '@/types';
import { TData } from '@/types/dataItem';

function convertValueByType(value: any, type: TTypeVariable, isList = false): any {
  if (value == null) return null;

  const parseOne = (v: any) => {
    switch (type.toLowerCase()) {
      case 'string':
        return String(v);
      case 'integer':
        return parseInt(v, 10);
      case 'float':
        return parseFloat(v);
      case 'boolean':
        return v === 'true' || v === true;
      case 'date':
        return new Date(v);
      case 'object':
        try {
          return typeof v === 'object' ? v : JSON.parse(v);
        } catch {
          return null;
        }
      default:
        return v;
    }
  };

  if (isList) {
    try {
      const arr = Array.isArray(value) ? value : JSON.parse(value);
      return arr.map(parseOne);
    } catch {
      return [];
    }
  }

  return parseOne(value);
}

type THandleCustomData = {
  data: TData['customFunction'];
  getData: (data: TData | null) => any;
  findCustomFunction: (id: string) => TCustomFunction;
};
export const handleCustomFunction = ({
  data,
  getData,
  findCustomFunction,
}: THandleCustomData): any => {
  console.log('🚀 ~ data:', data);
  function buildArgsFromDefinedProps(
    props: TCustomFunction['props'],
    inputs: TData['customFunction']['props']
  ) {
    const args: Record<string, any> = {};

    props.forEach((prop) => {
      if (!prop.key) return;
      const rawData = getData(inputs?.find((item) => item.key === prop.key)?.value || null);

      args[prop.key] = convertValueByType(rawData, prop.type, prop.isList);
    });

    return args;
  }
  const customFunction = findCustomFunction(data.customFunctionId);

  if (_.isEmpty(customFunction)) return;
  const args = buildArgsFromDefinedProps(customFunction?.props, data?.props);
  const runFunction = async () => {
    try {
      const fn = new Function(`return ${customFunction.code}`)() as (args: any) => any;

      if (typeof fn === 'function') {
        const result = await fn(args);
        console.log('🚀 ~ runFunction ~ result:', result);

        return result;
      } else {
        throw new Error('Invalid function');
      }
    } catch (error) {
      console.log('🚀 ~ runFunction ~ error:', error);

      throw error;
    }
  };
  return runFunction();
};
