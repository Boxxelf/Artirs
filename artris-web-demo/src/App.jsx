import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';

// Auth pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Student pages
import StudentHome from './pages/Student/Home';
import Mentors from './pages/Student/Mentors';
import MentorDetail from './pages/Student/MentorDetail';
import Booking from './pages/Student/Booking';
import OrderConfirm from './pages/Student/OrderConfirm';
import Appointments from './pages/Student/Appointments';
import Messages from './pages/Student/Messages';
import Chat from './pages/Student/Chat';
import Profile from './pages/Student/Profile';
import Portfolio from './pages/Student/Portfolio';
import Help from './pages/Student/Help';
import Payment from './pages/Student/Payment';
import Success from './pages/Student/Success';
import SuccessStory from './pages/Student/SuccessStory';

// Teacher pages
import TeacherHome from './pages/Teacher/Home';
import Schedule from './pages/Teacher/Schedule';
import Earnings from './pages/Teacher/Earnings';
import TeacherMessages from './pages/Teacher/Messages';
import TeacherChat from './pages/Teacher/Chat';
import TeacherProfile from './pages/Teacher/Profile';
import Verification from './pages/Teacher/Verification';
import Reviews from './pages/Teacher/Reviews';
import CourseHistory from './pages/Teacher/CourseHistory';
import StudentPortfolio from './pages/Teacher/StudentPortfolio';

// Layout
import Layout from './components/Layout/Layout';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'student' ? '/student' : '/teacher'} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'student' ? '/student' : '/teacher'} replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'student' ? '/student' : '/teacher'} replace />} />

      {/* Student routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <StudentHome />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/mentors"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Mentors />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/mentor/:id"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <MentorDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/booking/:id"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Booking />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/order-confirm/:id"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <OrderConfirm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/appointments"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Appointments />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/messages"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Messages />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/chat/:id"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Chat />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/portfolio"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Portfolio />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/help"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Help />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/payment/:id"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Payment />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/success"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <Success />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/success-story/:id"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <SuccessStory />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Teacher routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <TeacherHome />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/schedule"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <Schedule />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/earnings"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <Earnings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/messages"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <TeacherMessages />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/chat/:id"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <TeacherChat />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <TeacherProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/verification"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <Verification />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/reviews"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <Reviews />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/course-history"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <CourseHistory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/student-portfolio/:studentId"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Layout>
              <StudentPortfolio />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
