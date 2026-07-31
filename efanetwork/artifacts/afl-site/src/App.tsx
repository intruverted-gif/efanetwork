import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Standings from './pages/Standings';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Stats from './pages/Stats';
import Scores from './pages/Scores';
import Rulebook from './pages/Rulebook';
import Legacy from './pages/Legacy';
import LegacySeason2 from './pages/LegacySeason2';
import PlayerProfile from './pages/PlayerProfile';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">404 Not Found</h1>
        <p className="mt-2 text-sm text-gray-600">This page doesn't exist.</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/standings" component={Standings} />
      <Route path="/teams" component={Teams} />
      <Route path="/teams/:id" component={TeamDetail} />
      <Route path="/stats" component={Stats} />
      <Route path="/players/:userId" component={PlayerProfile} />
      {/* /scores/:id handles both week1-week6 (schedule) and matchIds (box score) */}
      <Route path="/scores/:id" component={Scores} />
      <Route path="/rulebook" component={Rulebook} />
      <Route path="/legacy/season2" component={LegacySeason2} />
      <Route path="/legacy" component={Legacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Header />
        <Router />
        <Footer />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
