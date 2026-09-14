import { lazy, Suspense } from "react";
import { Router as WouterRouter } from "wouter";
import { PageLoader } from "@/components/layout/page-loader";

const AuthProviderWithRoutes = lazy(() =>
  import("./app-routes").then((module) => ({ default: module.AuthProviderWithRoutes })),
);

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {
  return (
    <WouterRouter base={basePath}>
      <Suspense fallback={<PageLoader />}>
        <AuthProviderWithRoutes />
      </Suspense>
    </WouterRouter>
  );
}

export default App;
