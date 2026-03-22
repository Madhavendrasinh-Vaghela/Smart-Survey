import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SurveysPage from './pages/SurveysPage';
import CreateSurveyPage from './pages/CreateSurveyPage';
import AnalysisPage from './pages/AnalysisPage';
import SurveyDetailPage from './pages/SurveyDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="surveys" element={<SurveysPage />} />
        <Route path="surveys/new" element={<CreateSurveyPage />} />
        <Route path="surveys/:surveyId" element={<SurveyDetailPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
