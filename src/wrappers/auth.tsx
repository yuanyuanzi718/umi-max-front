import { Navigate, Outlet } from '@umijs/max';

export default () => {
  if (localStorage.getItem('token')) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};
