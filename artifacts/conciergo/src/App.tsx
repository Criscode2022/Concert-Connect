import { lazy, Suspense } from "react";
import { Router as WouterRouter } from "wouter";
import { RouteFallback } from "@/components/layout/route-fallback";

const AuthProviderWithRoutes = lazy(() =>
  import("./app-routes").then((module) => ({ default: module.AuthProviderWithRoutes })),
);

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {
  return (
    <WouterRouter base={basePath}>
      <Suspense fallback={<RouteFallback />}>
        <AuthProviderWithRoutes />
      </Suspense>
    </WouterRouter>
  );
}

export default App;
