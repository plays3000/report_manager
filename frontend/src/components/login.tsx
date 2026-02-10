import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
  };
  message?: string;
}

interface ErrorResponse {
  message: string;
}

const Login: React.FC = () => {
  // 스키마에 맞춰 email 대신 id를 사용합니다.
  const [id, setId] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => setId(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      id,
      password
    });

    // 서버 응답 구조가 { success, result: { token, user } } 인 경우
    if (response.data.success) {
      const { token, user } = response.data.result; // result에서 꺼내기
      
      localStorage.setItem('token', token);
      setMessage(`반가워요, ${user.name}님!`);
    }
  } catch (error) {
    // ... 에러 처리 로직
    console.error('Full Error Object:', error);
    const err = error as AxiosError<any>;
    setMessage(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
  }
};
  // const [userId, setId] = useState<string>(''); // id -> userId로 변경 (가독성)
  // const [password, setPassword] = useState<string>('');
  // const [message, setMessage] = useState<string>('');

  // const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setMessage('로그인 시도 중...');
  // try {
  //     console.log('보내는 데이터:', { id: userId, password }); // 데이터 확인용

  //     const response = await axios.post<LoginResponse>('/api/login', {
  //       id: userId, // 백엔드 스키마의 id 필드와 매칭
  //       password
  //     });

  //     if (response.data.success) {
  //       localStorage.setItem('token', response.data.token);
  //       setMessage(`반가워요, ${response.data.user.name}님!`);
  //     }
  //   } catch (error) {
  //     const err = error as AxiosError<ErrorResponse>;
  //     // 404라면 경로 문제, 401이라면 비번 문제일 확률이 높음
  //     console.error('에러 상태 코드:', err.response?.status); 
  //     setMessage(err.response?.data?.message || '서버와 통신할 수 없습니다.');
  //   }
  // };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>로그인 테스트</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ display: 'block' }}>아이디(ID)</label>
          <input 
            type="text" 
            value={id} 
            onChange={handleIdChange} 
            style={{ width: '100%', padding: '8px' }}
            placeholder="아이디를 입력하세요"
            required 
          />
        </div>
        <div>
          <label style={{ display: 'block' }}>비밀번호</label>
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            style={{ width: '100%', padding: '8px' }}
            required 
          />
        </div>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          로그인
        </button>
      </form>
      {message && (
        <p style={{ marginTop: '15px', color: message.includes('반가워요') ? 'green' : 'red', textAlign: 'center' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;