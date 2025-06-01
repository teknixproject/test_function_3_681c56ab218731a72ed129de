import _ from 'lodash';
import { CSSProperties } from 'react';

interface TextProps {
  data?: any;
  style?: CSSProperties;
  goToHome?: React.MouseEventHandler<HTMLButtonElement>;
  goToAbout?: React.MouseEventHandler<HTMLButtonElement>;
}

const TextCustom = ({ data, style, goToHome, goToAbout }: TextProps) => {
  console.log('🚀 ~ TextCustom ~ goToHome:', goToHome);
  console.log('🚀 ~ TextCustom ~ goToAbout:', goToAbout);
  const title = _.get(data, 'title', 'Title Header');
  const newStyle: CSSProperties = {
    ...style,
  };

  return (
    <div style={newStyle} className="text-[#858585]">
      <button onClick={goToHome}>Button1</button>
      <button onClick={goToAbout}>Button2</button>
      {title}
    </div>
  );
};

export default TextCustom;
