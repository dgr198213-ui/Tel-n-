import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SplashScreen } from "./components/SplashScreen";
import Home from "./pages/Home";

import Artistas from "./pages/Artistas";
import Eventos from "./pages/Eventos";
import Suscripcion from "./pages/Suscripcion";
import ArtistaPublico from "./pages/ArtistaPublico";
import EventoDetalle from "./pages/EventoDetalle";
import PerfilArtista from "./pages/PerfilArtista";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/ "} component={Home} />
      <Route path={"/artistas"} component={Artistas} />
      <Route path={"/artistas/:slug"} component={ArtistaPublico} />
      <Route path={"/eventos"} component={Eventos} />
      <Route path={"/eventos/:id"} component={EventoDetalle} />
      <Route path={"/suscripcion"} component={Suscripcion} />
      <Route path={"/perfil"} component={PerfilArtista} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [splashComplete, setSplashComplete] = React.useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
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
