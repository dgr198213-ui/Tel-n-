import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SplashScreen } from "./components/SplashScreen";
import { Skeleton } from "./components/ui/skeleton";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Artistas = lazy(() => import("./pages/Artistas"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Suscripcion = lazy(() => import("./pages/Suscripcion"));
const ArtistaPublico = lazy(() => import("./pages/ArtistaPublico"));
const EventoDetalle = lazy(() => import("./pages/EventoDetalle"));
const PerfilArtista = lazy(() => import("./pages/PerfilArtista"));
const PublicarEvento = lazy(() => import("./pages/PublicarEvento"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex flex-col space-y-3 p-8">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/artistas" component={Artistas} />
        <Route path="/artistas/:slug" component={ArtistaPublico} />
        <Route path="/eventos" component={Eventos} />
        <Route path="/eventos/:id" component={EventoDetalle} />
        <Route path="/eventos/publicar" component={PublicarEvento} />
        <Route path="/suscripcion" component={Suscripcion} />
        <Route path="/perfil" component={PerfilArtista} />
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [splashComplete, setSplashComplete] = React.useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          {!splashComplete && <SplashScreen onComplete={() => setSplashComplete(true)} />}
          {splashComplete && <Router />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
