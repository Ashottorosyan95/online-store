import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Signup from './auth/signup';
import Signin from './auth/signin';


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: 'Dashboard',
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/signin",
      element: <Signin />,
    },
  ]);

  return (
    <div>
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
