import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Admin2FA: React.FC = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // 로그인 단계에서 임시로 전달받은 ID나 정보를 가져옴
  const adminId = location.state?.adminId;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/verify-2fa', { id: adminId, code });
      const result = response.data;

      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userName', result.name || '관리자');
        navigate('/adminDashboard');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || '인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="card">
      <h2>관리자 2차 인증</h2>
      <p>이메일로 발송된 인증 키를 입력하세요.</p>
      <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="인증 키 입력" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          style={{ padding: '10px' }}
          required 
        />
        <button type="submit" style={{ padding: '10px' }}>확인</button>
      </form>
      {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default Admin2FA;