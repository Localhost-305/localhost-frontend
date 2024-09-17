import { RouteObject, RouterProvider, createBrowserRouter} from "react-router-dom";
import type { Router as RemixRouter} from "@remix-run/router";
import { useEffect } from "react";

import './main.css';
import { loginRoutes } from './modules/login/routes';
import { firstScreenRoutes } from "./modules/firstScreen/routes";
import { dashboardScreenRoutes } from "./modules/dashboard/routes";
import { useNotification } from "./shared/hooks/useNotification";
import { getAuthorizationToken, verifyLoggedIn } from "./shared/functions/connection/auth";
import { useRequests } from "./shared/hooks/useRequests";
import { URL_USER } from "./shared/constants/urls";
import { MethodsEnum } from "./shared/enums/methods.enum";
import { useGlobalReducer } from "./store/reducers/globalReducer/useGlobalReducer";
import { userRoutes } from "./modules/user/routes";


const routes: RouteObject[] = [...loginRoutes];
const routesLoggedIn: RouteObject[] = [
  ...userRoutes,
  ...firstScreenRoutes,
  ...dashboardScreenRoutes
].map((route) => ({
    ...route,
    loader: verifyLoggedIn
  }));

const router: RemixRouter = createBrowserRouter(
  [
    ...routes,
    ...routesLoggedIn
  ]
);

function App() {
  const { contextHolder } = useNotification();
  const { setUser } = useGlobalReducer();
  const { request } = useRequests();

  useEffect(() => {
    const token = getAuthorizationToken();
    if(token){
      request(URL_USER, MethodsEnum.GET, setUser);
    }
  }, [])

  return(
    <>
      {contextHolder}
      <RouterProvider router={router} />
    </>
  );
}
export default App