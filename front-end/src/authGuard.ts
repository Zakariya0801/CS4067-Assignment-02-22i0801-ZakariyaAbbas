// authGuard.ts
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "./authService";

export function AuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const publicPaths = [
    "/",
    "/login",
    "/forgot-password",
    "/terms",
    "/privacy",
  ];

  React.useEffect(() => {
    // Handle public routes
    if (publicPaths.includes(location.pathname)) {
      if (isAuthenticated && location.pathname === "/login") {
        navigate("/home");
      }
      return;
    }

    // Handle protected routes
    if (!isAuthenticated) {
      navigate("/login");
    } 
  }, [isAuthenticated, location, navigate]);

  return null;
}



