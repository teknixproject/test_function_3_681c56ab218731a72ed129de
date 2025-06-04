'use client'
import React, { MouseEventHandler, useState } from 'react';

interface OnClickProps {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  onClickIcons?: MouseEventHandler<HTMLElement> | undefined;
  onClickExample?: MouseEventHandler<HTMLElement> | undefined;
  onClickPricing?: MouseEventHandler<HTMLElement> | undefined;
  onClickPackage?: MouseEventHandler<HTMLElement> | undefined;
  onClickDocs?: MouseEventHandler<HTMLElement> | undefined;
  onClickSearch?: MouseEventHandler<HTMLElement> | undefined;
  title:string;
}

const NavBar: React.FC<OnClickProps> = ({
  id,
  style,
  className,
  onClickIcons,
  onClickExample,
  onClickPricing,
  onClickPackage,
  onClickDocs,
  onClickSearch,
  title
}) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav id={id} style={style} className={`bg-white shadow-sm px-4 py-3 flex items-center justify-between ${className || ''}`}>
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-800 mr-2">
            <path d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M7 8.5C7 7.67157 7.67157 7 8.5 7H15.5C16.3284 7 17 7.67157 17 8.5V17C17 18.6569 15.6569 20 14 20H10C8.34315 20 7 18.6569 7 17V8.5Z" fill="currentColor" />
          </svg>
          <span className="font-bold text-xl text-gray-800">{title}</span>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className={`bg-gray-100 pl-10 pr-4 py-2 rounded-md text-sm w-64 focus:outline-none ${searchFocused ? 'ring-2 ring-gray-300' : ''}`}
            placeholder="Search icons..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onClick={onClickSearch as MouseEventHandler<HTMLInputElement>}
          />
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <button
          className="text-gray-800 font-medium hover:text-gray-600"
          onClick={onClickIcons}
        >
          Icons
        </button>
        <button
          className="text-gray-800 font-medium hover:text-gray-600"
          onClick={onClickExample}
        >
          Example
        </button>
        <button
          className="text-gray-800 font-medium hover:text-gray-600"
          onClick={onClickPricing}
        >
          Pricing
        </button>
        <button
          className="text-gray-800 font-medium hover:text-gray-600"
          onClick={onClickPackage}
        >
          Package
        </button>
        <button
          className="text-gray-800 font-medium hover:text-gray-600"
          onClick={onClickDocs}
        >
          Docs
        </button>
      </div>
    </nav>
  );
};

export default NavBar;