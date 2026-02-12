import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard'; // 1. 외부 파일에서 가져오기
import AdminDashboard from './adminDashboard';
import Admin2FA from './Admin2FA';
import KakaoCallback from './kakaoCallback';
import '../style/css/App.css';

// 2. (기존에 여기에 있던 const Dashboard = ... 코드는 삭제되었습니다.)

// 인증 보호용 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div id="root">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-verify" element={<Admin2FA />} /> 
          {/* 보호된 경로: 외부에서 가져온 Dashboard 컴포넌트 사용 */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/adminDashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;