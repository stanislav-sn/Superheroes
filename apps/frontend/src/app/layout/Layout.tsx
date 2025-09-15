import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="dark min-h-screen bg-background ">
      <main className="container mx-auto px-4 py-8 flex flex-col justify-center items-center w-full">
        {children}
      </main>
    </div>
  );
}
