import { Switch, Route } from "wouter";
import Home from "./pages/home";
import AdminPage from "./pages/admin";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import NewsPage from "@/pages/news";
import About from "./pages/about"; // Import the About page

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/about" component={About} /> {/* Added route for About page */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;