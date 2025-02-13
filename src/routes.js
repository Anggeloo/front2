import React from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; 
import PublicRoute from "./PublicRoute"; 

const Login = React.lazy(() => import("./views/pages/login/Login"));
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Products = React.lazy(() => import("./views/products/Products"));
const ProductAdd = React.lazy(() => import("./views/products/ProductAdd"));
const ProductUpdate = React.lazy(() => import("./views/products/ProductUpdate"));
const History = React.lazy(() => import("./views/history/History"));
const Inventory = React.lazy(() => import("./views/inventory/Inventory"));
const InventoryAdd = React.lazy(() => import("./views/inventory/InventoryAdd"));
const InventoryUpdate = React.lazy(() => import("./views/inventory/InventoryUpdate"));
const WorkTeam = React.lazy(() => import("./views/workTeam/WorkTeam"));
const WorkTeamAdd = React.lazy(() => import("./views/workTeam/WorkTeamAdd")); 
const WorkTeamUpdate = React.lazy(() => import("./views/workTeam/WorkTeamUpdate"));

const Orders = React.lazy(() => import("./views/order/Orders"));
const OrdersAdd = React.lazy(() => import("./views/order/OrdersAdd"));
const OrdersUpdate = React.lazy(() => import("./views/order/OrdersUpdate"));

const TeamPerformance = React.lazy(() => import("./views/teamPerformance/TeamPerformance"));
const TeamPerformanceAdd = React.lazy(() => import("./views/teamPerformance/TeamPerformanceAdd"));
const TeamPerformanceUpdate = React.lazy(() => import("./views/teamPerformance/TeamPerformanceUpdate"));

const RawMaterialManagement = React.lazy(() => import("./views/rawMaterialManagement/RawMaterialManagement"));
const RawMaterialManagementAdd = React.lazy(() => import("./views/rawMaterialManagement/RawMaterialManagementAdd"));
const RawMaterialManagementUpdate = React.lazy(() => import("./views/rawMaterialManagement/RawMaterialManagementUpdate"));

const MonthlySummary = React.lazy(() => import("./views/monthlySummary/MonthlySummary"));
const MonthlySummaryAdd = React.lazy(() => import("./views/monthlySummary/MonthlySummaryAdd"));
const MonthlySummaryUpdate = React.lazy(() => import("./views/monthlySummary/MonthlySummaryUpdate"));

const InformationGraphics = React.lazy(() => import("./views/informationGraphics/InformationGraphics"));
const InformationGraphicsAdd = React.lazy(() => import("./views/informationGraphics/InformationGraphicsAdd"));
const InformationGraphicsUpdate = React.lazy(() => import("./views/informationGraphics/InformationGraphicsUpdate"));

const routes = [
  { path: "/", exact: true, element: <Navigate to="/dashboard" /> },
  { path: "/login", name: "Login", element: <PublicRoute><Login /></PublicRoute> },
  { path: "/dashboard", name: "Dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: "/history", name: "History", element: <ProtectedRoute><History /></ProtectedRoute> },

  { path: "/products", name: "Products", element: <ProtectedRoute><Products /></ProtectedRoute> },
  { path: "/products/add", name: "Products Add", element: <ProtectedRoute><ProductAdd /></ProtectedRoute> },
  { path: "/products/:codice", name: "Products Update", element: <ProtectedRoute><ProductUpdate /></ProtectedRoute> },

  { path: "/inventory", name: "Inventory", element: <ProtectedRoute><Inventory /></ProtectedRoute> },
  { path: "/inventory/add", name: "Inventory Add", element: <ProtectedRoute><InventoryAdd /></ProtectedRoute> },
  { path: "/inventory/:codice", name: "Inventory Update", element: <ProtectedRoute><InventoryUpdate /></ProtectedRoute> },

  { path: "/workTeam", name: "WorkTeam", element: <ProtectedRoute><WorkTeam /></ProtectedRoute> },
  { path: "/workTeam/add", name: "WorkTeam Add", element: <ProtectedRoute><WorkTeamAdd /></ProtectedRoute> },
  { path: "/workTeam/:codice", name: "WorkTeam Update", element: <ProtectedRoute><WorkTeamUpdate /></ProtectedRoute> },

  { path: "/order", name: "WorkTeam", element: <ProtectedRoute><Orders /></ProtectedRoute> },
  { path: "/order/add", name: "WorkTeam Add", element: <ProtectedRoute><OrdersAdd /></ProtectedRoute> },
  { path: "/order/:codice", name: "WorkTeam Update", element: <ProtectedRoute><OrdersUpdate /></ProtectedRoute> },

  { path: "/teamPerformance", name: "WorkTeam", element: <ProtectedRoute><TeamPerformance /></ProtectedRoute> },
  { path: "/teamPerformance/add", name: "WorkTeam Add", element: <ProtectedRoute><TeamPerformanceAdd /></ProtectedRoute> },
  { path: "/teamPerformance/:codice", name: "WorkTeam Update", element: <ProtectedRoute><TeamPerformanceUpdate /></ProtectedRoute> },

  { path: "/rawMaterialManagement", name: "WorkTeam", element: <ProtectedRoute><RawMaterialManagement /></ProtectedRoute> },
  { path: "/rawMaterialManagement/add", name: "WorkTeam Add", element: <ProtectedRoute><RawMaterialManagementAdd /></ProtectedRoute> },
  { path: "/rawMaterialManagement/:codice", name: "WorkTeam Update", element: <ProtectedRoute><RawMaterialManagementUpdate /></ProtectedRoute> },

  { path: "/monthlySummary", name: "WorkTeam", element: <ProtectedRoute><MonthlySummary /></ProtectedRoute> },
  { path: "/monthlySummary/add", name: "WorkTeam Add", element: <ProtectedRoute><MonthlySummaryAdd /></ProtectedRoute> },
  { path: "/monthlySummary/:codice", name: "WorkTeam Update", element: <ProtectedRoute><MonthlySummaryUpdate /></ProtectedRoute> },

  { path: "/informationGraphics", name: "WorkTeam", element: <ProtectedRoute><InformationGraphics /></ProtectedRoute> },
  { path: "/informationGraphics/add", name: "WorkTeam Add", element: <ProtectedRoute><InformationGraphicsAdd /></ProtectedRoute> },
  { path: "/informationGraphics/:codice", name: "WorkTeam Update", element: <ProtectedRoute><InformationGraphicsUpdate /></ProtectedRoute> },

];

export default routes;
