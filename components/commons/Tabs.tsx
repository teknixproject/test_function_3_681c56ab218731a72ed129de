'use client';

import _ from 'lodash';
import { useEffect, useState } from 'react';

import { useActions } from '@/hooks/useActions';

import { RenderSlice } from '../grid-systems';

interface TabsProps {
  id: string;
  style?: any;
  data?: any;
  childs?: any[];
  menuClassDropdow?: any;
}

const Tabs = ({ id, style = '', data = {}, childs = [] }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>();

  const tabs = _.get(data, 'dataSlice.tabs');
  const { handleAction } = useActions();
  const handleActiveTab = (id: string) => {
    setActiveTab(id);
    handleAction('onClick');
  };

  useEffect(() => {
    if (!activeTab && !_.isElement(tabs)) {
      setActiveTab(tabs[0]?.id);
    }
  }, [activeTab, tabs]);

  return (
    <div style={{ ...style, width: '100%' }}>
      {/* Tab headers */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #ddd',
          marginBottom: '10px',
        }}
      >
        {tabs.map((tab: any, index: any) => (
          <button
            key={index}
            onClick={() => handleActiveTab(tab?.id)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              background: activeTab === tab?.id ? '#007bff' : '#f8f9fa',
              color: activeTab === tab?.id ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderBottom: activeTab === tab?.id ? 'none' : '1px solid #ddd',
              borderRadius: '5px 5px 0 0',
              marginRight: '5px',
            }}
          >
            {tab?.label}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div style={{ padding: '10px' }}>
        {childs.map((child: any, index: any) => {
          if (child?.id === activeTab) {
            return <RenderSlice key={index} slice={child} idParent={id} />;
          }
        })}
      </div>
    </div>
  );
};

export default Tabs;
