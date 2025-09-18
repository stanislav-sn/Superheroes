import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="dark min-h-screen bg-background ">
      <main className="container mx-auto px-4 py-8 flex flex-col justify-center items-center w-full">
        <Outlet />
      </main>
    </div>
  );
}
