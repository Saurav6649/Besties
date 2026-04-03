import { Navigate, Outlet } from "react-router-dom";

import { useContext, useEffect } from "react";
import Context from "../Context";
import HttpInterceptor from "../components/lib/HttpInterceptor";
import { Catcherr } from "../components/lib/CatchError";

const RedirectGuard = () => {
  const { session, setSession } = useContext(Context);
//   const location = useLocation();

  const getSession = async () => {
    try {
      const { data } = await HttpInterceptor.get("/auth/session");
      // console.log(data);

      setSession(data);
    } catch (err: unknown) {
      setSession(false); // ✅ fix
      Catcherr(err);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  // console.log(session);

  if (session === null) return null;

  //   const isAuthPage =
  //     location.pathname === "/login" || location.pathname === "/signup";

  if (session === false) {
    return <Outlet />;
  }

  //   if (session && isAuthPage) {
  //     return <Navigate to="/app" replace />;
  //   }

  return <Navigate to="/app" />;
};

export default RedirectGuard;
