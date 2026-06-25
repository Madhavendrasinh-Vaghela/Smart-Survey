import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Surveys from './pages/Surveys'
import CreateSurvey from './pages/CreateSurvey'
import Responses from './pages/Responses'
import Analysis from './pages/Analysis'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="surveys" element={<Surveys />} />
          <Route path="surveys/create" element={<CreateSurvey />} />
          <Route path="responses/:surveyId" element={<Responses />} />
          <Route path="analysis/:surveyId" element={<Analysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}