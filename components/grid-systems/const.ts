// interface GridItem {
//   id?: string; // Optional slice ID for identifying slices
//   columns?: string; // Number of columns (for grid layout)
//   rows?: string; // Number of rows (for grid layout)
//   colspan?: string; // Number of columns to span
//   rowspan?: string; // Number of rows to span
//   gap?: string; // Gap between items (applies to grid layout)
//   type: 'grid' | 'flex'; // Determines if the container is grid or flex
//   justifyContent?:
//     | 'flex-start'
//     | 'center'
//     | 'flex-end'
//     | 'space-between'
//     | 'space-around'
//     | 'space-evenly'; // Flexbox alignment on the main axis
//   alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'; // Flexbox alignment on the cross axis
//   // style?: React.CSSProperties; // Inline styles for the item
//   childs?: GridItem[]; // Nested child components
//   // style?: {
//   //   style_pc: React.CSSProperties;
//   //   style_laptop: React.CSSProperties;
//   //   style_tablet: React.CSSProperties;
//   //   style_mobile: React.CSSProperties;
//   // };
//   dataSlice?: any; // Data to render in the component
//   style_pc?: React.CSSProperties;
//   style_laptop?: React.CSSProperties;
//   style_tablet?: React.CSSProperties;
//   style_mobile?: React.CSSProperties;
//   style?: string;
//   value?: string; // Value to render in the component
//   valueRender?: ValueRender;
//   dynamicGenerate?: TDynamicGenerate;
//   state?: DocumentType;
//   action?: any;

//   //collapse
//   collapse?: TCollapse;
// }
// export type TCollapse = {
//   childs: { value: string }[];
// };
// export type TDynamicGenerate = {
//   dataJsonPath?: string;
//   apiCall?: { id: string; name: string };
// };
// export type TValueFields = {
//   total: string;
// };
// export type TQueryConvert = {
//   page?: string;
//   limit?: string;
//   skip?: string;
// };
// export interface ValueRender {
//   jsonPath?: string;
//   valueFields?: TValueFields;
//   index?: number;
//   allowDynamicGenerate?: boolean;
//   apiCall?: {
//     id: string;
//     name: string;
//     url: string;
//     method: string;
//     body?: any;
//     headers?: any;
//     queryConvert?: TQueryConvert;
//   };
// }

// interface ContainerConfig {
//   page: string; // The name of the page
//   container: GridItem; // The root container for the page layout
// }

// export type { ContainerConfig, GridItem };

export const GridCol = (col_number: number) => `grid-cols-${Math.min(Math.max(col_number, 1), 24)}`;

export const GridRow = (row_number: number) => `grid-rows-${Math.min(Math.max(row_number, 1), 24)}`;

export const SpanCol = (col_span_number: number) =>
  `col-span-${Math.min(Math.max(col_span_number, 1), 24)}`;

export const SpanRow = (row_span_number: number) =>
  `row-span-${Math.min(Math.max(row_span_number, 1), 24)}`;

export const ColStart = (col_start_number: number) =>
  `col-start-${Math.min(Math.max(col_start_number, 1), 24)}`;

export const RowStart = (row_start_number: number) =>
  `row-start-${Math.min(Math.max(row_start_number, 1), 24)}`;

// Map JSON justifyContent to Tailwind classes
export const mapJustifyContent = (value?: string) => {
  switch (value) {
    case 'flex-start':
      return 'justify-start';
    case 'flex-end':
      return 'justify-end';
    case 'center':
      return 'justify-center';
    case 'space-between':
      return 'justify-between';
    case 'space-around':
      return 'justify-around';
    case 'space-evenly':
      return 'justify-evenly';
    default:
      return '';
  }
};

export const mapAlineItem = (value?: string) => {
  switch (value) {
    case 'flex-start':
      return 'items-start';
    case 'flex-end':
      return 'items-end';
    case 'center':
      return 'items-center';
    case 'baseline':
      return 'items-baseline';
    case 'stretch':
      return 'items-stretch';
    default:
      return '';
  }
};

export const GapGrid = (row_span_number: number) => {
  if (row_span_number === 0 || !row_span_number) {
    return 'gap-0';
  } else {
    return `gap-${row_span_number}`;
  }
};

export const BREAKPOINTS = {
  mobile: {
    title: 'Mobile',
    style: 'style_mobile',
    minWidth: 0,
    maxWidth: 479,
    type: 'mobile',
  },
  tablet: {
    title: 'Tablet',
    style: 'style_tablet',
    minWidth: 480,
    maxWidth: 1023,
    type: 'tablet',
  },
  laptop: {
    title: 'Laptop',
    style: 'style_laptop',
    minWidth: 1024,
    maxWidth: 1439,
    type: 'laptop',
  },
  pc: {
    title: 'PC',
    style: 'style_pc',
    minWidth: 1440,
    maxWidth: Infinity,
    type: 'pc',
  },
};
