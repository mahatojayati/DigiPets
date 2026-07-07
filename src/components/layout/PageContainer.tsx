import React from 'react';

interface PageContainerProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  id,
  children,
  className = ''
}) => {
  return (
    <main
      id={id || 'page-container'}
      className={`relative min-h-[calc(100vh-4rem-4rem)] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 ${className}`}
    >
      <div className="flex-1 w-full flex flex-col justify-start">
        {children}
      </div>
    </main>
  );
};
