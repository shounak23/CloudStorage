import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthChecking } from "../store/slices/authSlice";
import { refreshSession } from "../utils/axiosInstance";
import AppRouter from "../routes/AppRouter";

const AppBootstrap = () => {
  const { theme } = useSelector((state) => state.themes);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  const dispatch = useDispatch();
  const { isAuthChecking } = useSelector((state) => state.auth);

  useEffect(() => {
    refreshSession()
      .catch(() => {}) // no valid cookie: stay logged out
      .finally(() => dispatch(setAuthChecking(false)));
  }, [dispatch]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return <AppRouter />;
};

export default AppBootstrap;
