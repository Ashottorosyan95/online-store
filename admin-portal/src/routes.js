import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ShowBlogPostsPage from './pages/ShowBlogPostsPage';
import CategoryPage from './pages/CategoryPage';
import ShowProductPage from './pages/ShowProductPage';

const isAuthenticated = () => {
  const token = localStorage.access_token;
  return !!token;
};

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'product/:id', element: <ShowProductPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'blog/:id', element: <ShowBlogPostsPage /> },
        { path: 'category', element: <CategoryPage /> },
      ],
    },
    {
      path: 'login',
      element: isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
