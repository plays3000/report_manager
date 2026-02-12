import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // 커스텀 훅 임포트



const Login: React.FC = () => {
  // window.location.replace('/login');
  const { id, password, message, isLoading, handleIdChange, handlePasswordChange, handleLogin, handleKakaoLogin} = useAuth();
  const navigate = useNavigate();
  
  
  // 5. 컴포넌트 UI 반환문 (이 부분이 있어야 화면이 보입니다)
  return (
    <div className="card">
      <h2>ERP 시스템 로그인</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={handleIdChange}
          style={{ padding: '10px' }}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={handlePasswordChange}
          style={{ padding: '10px' }}
          required
        />
        <button type="submit" disabled={isLoading} style={{ padding: '10px', cursor: 'pointer' }}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
        <button 
          type="button" 
          onClick={() => navigate('/register')} 
          style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer', marginTop: '10px' }}
        >
          계정이 없으신가요? 회원가입
        </button>
        <button type="button" onClick={handleKakaoLogin} style={{ backgroundColor: '#FEE500', color: '#000' }}>
          카카오로 시작하기
        </button>
        {/* <button type="button" onClick={handleNaverLogin} style={{ backgroundColor: '#03C75A', color: '#fff' }}>
          네이버로 시작하기
        </button> */}
      </form>
      {message && <p style={{ marginTop: '10px', color: message.includes('성공') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default Login;