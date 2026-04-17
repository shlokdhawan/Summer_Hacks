import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DailyBrief from './pages/DailyBrief';
import Inbox from './pages/Inbox';
import RelationGraph from './pages/RelationGraph';
import Settings from './pages/Settings';
import MessageThreadDetail from './pages/MessageThreadDetail';
import Onboarding from './pages/Onboarding';
import SearchResults from './pages/SearchResults';
import NotificationCenter from './pages/NotificationCenter';
import SenderProfile from './pages/SenderProfile';
import AIAnalysis from './pages/AIAnalysis';
import LandingPage from './pages/LandingPage';
import ChatInbox from './pages/ChatInbox';
import { NotFoundState } from './components/ui/ErrorState';

function App() {
  return (
    <Router>
      <Routes>
        {/* Full-screen routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Layout-wrapped routes */}
        <Route element={<AppLayout />}>
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/inbox/:threadId" element={<MessageThreadDetail />} />
          <Route path="/inbox/:threadId/analysis" element={<AIAnalysis />} />
          <Route path="/chat-inbox" element={<ChatInbox />} />
          <Route path="/daily-brief" element={<DailyBrief />} />
          <Route path="/relation-graph" element={<RelationGraph />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/sender/:senderId" element={<SenderProfile />} />
          <Route path="*" element={<NotFoundState />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

