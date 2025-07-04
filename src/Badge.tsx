import React from 'react';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className='text-sm xl:text-base font-normal bg-indigo-500/10 text-indigo-500 px-4 py-1 rounded-full border border-indigo-500/50'>
        {children}
    </span>
  );
}

export default Badge;