import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${backendUrl}/users/me`, {
          method: "GET",
          credentials: "include",
        });
        setIsAuth(res.ok);
        console.log("User is logged in");
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return <p>Loading...</p>;
  }

  return isAuth ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;
