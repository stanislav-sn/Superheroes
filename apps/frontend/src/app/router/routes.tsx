import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import Loader from '../../components/Loader';

const SuperheroDetailsPage = lazy(() => import('../../pages/SuperheroDetailsPage'));
const CatalogPage = lazy(() => import('../../pages/CatalogPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loader />}>
        <CatalogPage />
      </Suspense>
    ),
  },
  {
    path: ':id',
    element: (
      <Suspense fallback={<Loader />}>
        <SuperheroDetailsPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
]);

export default function AppRouter() {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
}
