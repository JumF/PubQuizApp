import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { QuizEditor } from './pages/QuizEditor';
import { SessionStarter } from './pages/SessionStarter';
import { QuizmasterView } from './pages/QuizmasterView';
import { PlayerJoin } from './pages/PlayerJoin';
import { PlayerView } from './pages/PlayerView';
import { ResultsView } from './pages/ResultsView';

function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/quiz/new" element={<QuizEditor />} />
            <Route path="/admin/quiz/:quizId" element={<QuizEditor />} />
            <Route path="/admin/session/new" element={<SessionStarter />} />
            <Route path="/quizmaster/:sessionId" element={<QuizmasterView />} />
            <Route path="/play" element={<PlayerJoin />} />
            <Route path="/play/:sessionId" element={<PlayerView />} />
            <Route path="/results/:sessionId" element={<ResultsView />} />
          </Routes>
        </Router>
      </SessionProvider>
    </AuthProvider>
  );
}

export default App;
