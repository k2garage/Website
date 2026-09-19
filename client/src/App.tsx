import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import Admin from "./pages/Admin";
import ErrorBoundary from "./components/ErrorBoundary";
import About from "./pages/About";
import { ThemeProvider } from "./contexts/ThemeContext";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Pricing from "./pages/Pricing";
import Reservation from "./pages/Reservation";
import Services from "./pages/Services";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/sluzby"} component={Services} />
      <Route path={"/o-nas"} component={About} />
      <Route path={"/cenik"} component={Pricing} />
      <Route path={"/inzeraty"} component={Listings} />
      <Route path={"/rezervace"} component={Reservation} />
      <Route path={"/kontakt"} component={Contact} />
      <Route path={"/admin/:section?"} component={Admin} />
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
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
