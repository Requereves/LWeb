import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./components/Dashboard";
import { LoginPage } from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
import { DeviceManagement } from "./components/DeviceManagement";
import { UsageLogs } from "./components/UsageLogs";
import { Recommendations } from "./components/Recommendations";
import { TokenPayment } from "./components/TokenPayment";
import { UserProfile } from "./components/UserProfile";
import { useAppContext } from "./context/AppContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true,                  element: <Dashboard />        },
      { path: "devices",              element: <DeviceManagement /> },
      { path: "logs",                 element: <UsageLogs />        },
      { path: "recommendations",      element: <Recommendations />  },
      { path: "token",                element: <TokenPayment />     },
      { path: "profile",              element: <UserProfile />      },
    ],
  },
]);