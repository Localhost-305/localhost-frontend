import { RouteObject } from "react-router-dom";

import DashboardScreen from "./screens/DashboardScreen";

export enum DashboardRoutesEnum {
  DASHBOARD = '/dashboard'
}

export const dashboardScreenRoutes: RouteObject[] = [
    {
      path: DashboardRoutesEnum.DASHBOARD,
      element: <DashboardScreen/>,
    },
];