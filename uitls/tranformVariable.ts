export type TVariable = {
  id: string;
  key: string;
  type: TTypeVariable;
  isList: boolean;
  value: any;
};

export type TTypeVariable = 'String' | 'Integer' | 'Float' | 'Boolean' | 'Date' | 'Object';

// Type-safe transform function
export const transformVariable = (variable: Omit<TVariable, 'id'>): any => {
  if (!variable || variable.value === null || variable.value === undefined) {
    return variable?.value ?? null;
  }

  // Helper function to transform a single value based on type
  const transformSingleValue = (value: any, type: TTypeVariable): any => {
    if (value === null || value === undefined) return value;

    try {
      switch (type) {
        case 'String':
          return String(value);

        case 'Integer':
          if (typeof value === 'string') {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? 0 : parsed;
          }
          return Math.floor(Number(value)) || 0;

        case 'Float':
          if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0.0 : parsed;
          }
          return Number(value) || 0.0;

        case 'Boolean':
          if (typeof value === 'string') {
            const lower = value.toLowerCase().trim();
            return lower === 'true' || lower === '1' || lower === 'yes';
          }
          return Boolean(value);

        case 'Date':
          if (value instanceof Date) return value;
          if (typeof value === 'string' || typeof value === 'number') {
            const date = new Date(value);
            return isNaN(date.getTime()) ? new Date() : date;
          }
          return new Date();

        case 'Object':
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              // If JSON parsing fails, try to return as object with the string value
              return { value };
            }
          }
          if (typeof value === 'object') {
            return value;
          }
          // For primitives, wrap in object
          return { value };

        default:
          return value;
      }
    } catch (error) {
      console.warn(`Failed to transform value ${value} to type ${type}:`, error);
      return getDefaultValue(type);
    }
  };

  // Helper function to get default values for each type
  const getDefaultValue = (type: TTypeVariable): any => {
    switch (type) {
      case 'String':
        return '';
      case 'Integer':
        return 0;
      case 'Float':
        return 0.0;
      case 'Boolean':
        return false;
      case 'Date':
        return new Date();
      case 'Object':
        return {};
      default:
        return null;
    }
  };

  // Handle array (isList: true)
  if (variable.isList) {
    if (!Array.isArray(variable.value)) {
      console.warn('Variable marked as list but value is not an array:', variable);
      return [transformSingleValue(variable.value, variable.type)];
    }

    return variable.value.map((item: any) => transformSingleValue(item, variable.type));
  }

  // Handle single value (isList: false)
  return transformSingleValue(variable.value, variable.type);
};

// Enhanced version with validation and error handling
export const transformVariableWithValidation = (
  variable: TVariable
): {
  success: boolean;
  data: any;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!variable) {
    return { success: false, data: null, errors: ['Variable is null or undefined'] };
  }

  try {
    const transformedValue = transformVariable(variable);
    return { success: true, data: transformedValue, errors: [] };
  } catch (error) {
    errors.push(`Transformation failed: ${error}`);
    return {
      success: false,
      data: variable.isList ? [] : getDefaultValue(variable.type),
      errors,
    };
  }
};

// Utility function for batch transformation
export const transformVariables = (variables: TVariable[]): Record<string, any> => {
  return variables.reduce((acc, variable) => {
    acc[variable.key] = transformVariable(variable);
    return acc;
  }, {} as Record<string, any>);
};

// Advanced version with custom type handlers
export const createVariableTransformer = (
  customHandlers?: Partial<Record<TTypeVariable, (value: any) => any>>
) => {
  return (variable: TVariable): any => {
    const transformSingleValue = (value: any, type: TTypeVariable): any => {
      // Use custom handler if provided
      if (customHandlers?.[type]) {
        try {
          return customHandlers[type]!(value);
        } catch (error) {
          console.warn(`Custom handler for ${type} failed:`, error);
          // Fall back to default transformation
        }
      }

      // Default transformation logic (same as above)
      switch (type) {
        case 'String':
          return String(value);
        case 'Integer':
          return Math.floor(Number(value)) || 0;
        case 'Float':
          return Number(value) || 0.0;
        case 'Boolean':
          if (typeof value === 'string') {
            const lower = value.toLowerCase().trim();
            return lower === 'true' || lower === '1' || lower === 'yes';
          }
          return Boolean(value);
        case 'Date':
          if (value instanceof Date) return value;
          const date = new Date(value);
          return isNaN(date.getTime()) ? new Date() : date;
        case 'Object':
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              return { value };
            }
          }
          return typeof value === 'object' ? value : { value };
        default:
          return value;
      }
    };

    if (variable.isList) {
      if (!Array.isArray(variable.value)) {
        return [transformSingleValue(variable.value, variable.type)];
      }
      return variable.value.map((item: any) => transformSingleValue(item, variable.type));
    }

    return transformSingleValue(variable.value, variable.type);
  };
};

// Helper function to get default value
const getDefaultValue = (type: TTypeVariable): any => {
  switch (type) {
    case 'String':
      return '';
    case 'Integer':
      return 0;
    case 'Float':
      return 0.0;
    case 'Boolean':
      return false;
    case 'Date':
      return new Date();
    case 'Object':
      return {};
    default:
      return null;
  }
};

// Usage examples:
/*
  // Basic usage
  const stringVar: TVariable = {
    id: '1',
    key: 'userName',
    type: 'String',
    isList: false,
    value: 123
  };
  const result = transformVariable(stringVar); // "123"
  
  // Array usage
  const intArrayVar: TVariable = {
    id: '2',
    key: 'scores',
    type: 'Integer',
    isList: true,
    value: ['10', '20.5', '30']
  };
  const arrayResult = transformVariable(intArrayVar); // [10, 20, 30]
  
  // With validation
  const { success, data, errors } = transformVariableWithValidation(stringVar);
  
  // Custom handlers
  const customTransformer = createVariableTransformer({
    String: (value) => `Prefix: ${value}`,
    Integer: (value) => Math.abs(Number(value))
  });
  */
