import React from 'react';

interface ButtonProps {
  type?: 'outline' | 'link';
  link?: string;
  text: string;
  icon?: React.ReactNode;
}

const buttonTypes = {
  outline: 'bg-gray-500/10 text-gray-400 border border-gray-500/50 px-4 py-1 rounded-full hover:bg-gray-500/30 hover:text-gray-300',
  link: 'items-center hover:underline'
}

function Button({ type = 'outline', link, text, icon }: ButtonProps) {
  return (
    <a href={link} className={`inline-flex items-center gap-2 font-normal transition-all duration-200 ${buttonTypes[type]}`} target='_blank'>
      {icon}
      {text}
    </a>
  );
}

export default Button;