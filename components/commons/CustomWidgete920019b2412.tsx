'use client';
import React, { MouseEventHandler, useState } from 'react';

interface OnClickProps {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  onClickHome?: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickAbout?: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickContact?: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickSupport?: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickSearch?: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickHTML?: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickCSS?: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickJavascript?: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickSass?: MouseEventHandler<HTMLButtonElement> | undefined;
}

const NavigationBar: React.FC<OnClickProps> = ({
  id,
  style,
  className,
  onClickHome,
  onClickAbout,
  onClickContact,
  onClickSupport,
  onClickSearch,
  onClickHTML,
  onClickCSS,
  onClickJavascript,
  onClickSass,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav id={id} style={style} className={`${className || ''} relative`}>
      <div className="bg-red-500 text-white rounded-full shadow-lg flex items-center justify-between px-6 py-3">
        <div className="flex space-x-8 items-center">
          <button
            onClick={onClickHome}
            className="font-semibold hover:text-gray-200 transition-colors"
          >
            Home
          </button>
          <button
            onClick={onClickAbout}
            className="font-semibold hover:text-gray-200 transition-colors"
          >
            About
          </button>
          <button
            onClick={onClickContact}
            className="font-semibold hover:text-gray-200 transition-colors"
          >
            Contact
          </button>
          <button
            onClick={onClickSupport}
            className="font-semibold hover:text-gray-200 transition-colors"
          >
            Support
          </button>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              toggleDropdown();
              onClickSearch?.(e);
            }}
            className="focus:outline-none"
            aria-expanded={isDropdownOpen}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-pink-600 rounded shadow-xl py-2 z-10">
              <button
                onClick={onClickHTML}
                className="block w-full text-left px-4 py-2 text-white hover:bg-pink-700 transition-colors"
              >
                HTML
              </button>
              <button
                onClick={onClickCSS}
                className="block w-full text-left px-4 py-2 text-white hover:bg-pink-700 transition-colors"
              >
                CSS
              </button>
              <button
                onClick={onClickJavascript}
                className="block w-full text-left px-4 py-2 text-white hover:bg-pink-700 transition-colors"
              >
                Javascript
              </button>
              <button
                onClick={onClickSass}
                className="block w-full text-left px-4 py-2 text-white hover:bg-pink-700 transition-colors"
              >
                Sass
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
