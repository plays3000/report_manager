import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 임포트 확인

interface ErrorResponse {
  message: string;
}

const Login: React.FC = () => {
  const [id, setId] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // 2. isLoading 선언 추가

  const navigate = useNavigate(); // 3. navigate 함수 초기화

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => setId(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // 포트가 8888이 맞는지 다시 한번 확인하세요!
      const response = await axios.post('http://localhost:8888/api/auth/login', {
        id,
        password
      });

      console.log('서버 응답 데이터 전체:', response.data);

      // 서버 응답 구조가 { success: true, result: { token, user } } 형태일 때
      const result = response.data.result || response.data; 
      
      if (result) {
        const token = result.token;
        const user = result.user;

        if (token) {
          localStorage.setItem('token', token);
          if (user && user.name) {
            localStorage.setItem('userName', user.name);
          }
          
          console.log('이동 직전 - 토큰 저장됨:', token);
          setMessage('로그인 성공! 이동 중...');

          // 4. 페이지 이동 실행
          setTimeout(() => {
            navigate('/dashboard');
          }, 100);
        }
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      const err = error as AxiosError<ErrorResponse>;
      setMessage(err.response?.data?.message || '아이디 또는 비밀번호를 확인하세요.');
    } finally {
      setIsLoading(false);
    }
  };

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
      </form>
      {message && <p style={{ marginTop: '10px', color: message.includes('성공') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default Login;