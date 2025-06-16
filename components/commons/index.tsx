import dynamic from 'next/dynamic';

export const components = {
  Background: dynamic(() => import('./Background')),
  BannerVideo: dynamic(() => import('./BannerVideo')),
  Button: dynamic(() => import('./Button')),
  Description: dynamic(() => import('./Description')),
  Pagination: dynamic(() => import('./Pagination')),
  Icon: dynamic(() => import('./Icon')),
  Image: dynamic(() => import('./Image')),
  Link: dynamic(() => import('./Link')),
  Text: dynamic(() => import('./Text')),
  InputText: dynamic(() => import('./InputText')),
  Navigation: dynamic(() => import('./Navigation')),
  Dropdown: dynamic(() => import('./Dropdown')),
  Collapse: dynamic(() => import('./Collapse')),
  InputSearch: dynamic(() => import('./InputSearch')),
  Tabs: dynamic(() => import('./Tabs')),
  Table: dynamic(() => import('./Table')),
};
