import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const { id, password, name, message, isLoading, 
          handleIdChange, handlePasswordChange, handleNameChange, handleRegister } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2>ERP 시스템 회원가입</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="성함" value={name} onChange={handleNameChange} style={{ padding: '10px' }} required />
        <input type="text" placeholder="아이디" value={id} onChange={handleIdChange} style={{ padding: '10px' }} required />
        <input type="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} style={{ padding: '10px' }} required />
        
        <button type="submit" disabled={isLoading} style={{ padding: '10px', cursor: 'pointer' }}>
          {isLoading ? '처리 중...' : '가입하기'}
        </button>
        <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer' }}>
          이미 계정이 있으신가요? 로그인
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: message.includes('성공') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default Register;