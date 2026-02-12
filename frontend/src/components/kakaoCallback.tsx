import { useEffect, useRef } from 'react'; // useRef 추가
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const isProcessing = useRef(false); // 중복 요청 방지용 플래그

  useEffect(() => {
    // 1. URL에서 인가 코드 추출
    const code = new URLSearchParams(window.location.search).get('code');

    // 2. 중복 실행 방지 (React Strict Mode 대응)
    if (!code || isProcessing.current) return;
    isProcessing.current = true;

    // 3. 백엔드로 인가 코드 전달
    const loginWithKakao = async () => {
      try {
        // 백엔드 주소가 프론트엔드와 포트가 다르다면 전체 경로를 적어주거나 proxy 설정을 확인하세요.
        const response = await axios.post('http://localhost:3000/api/auth/kakao', { code });
        
        // 백엔드 result 구조에 맞춰 안전하게 추출 (res.data.result 또는 res.data)
        const data = response.data.result || response.data;
        const { token, user } = data;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('userName', user?.name || '사용자');
          
          // 성공 시 이동
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error("토큰이 없습니다.");
        }
      } catch (err: any) {
        // 1. 에러의 전체 내용을 콘솔에 상세히 찍습니다.
        console.log("에러 전체 구조:", err);
        
        // 2. 백엔드에서 보낸 구체적인 에러 메시지가 있다면 출력합니다.
        const errorMsg = err.response?.data?.message || err.message;
        console.error("백엔드 상세 에러:", errorMsg);
        
        alert(`로그인 실패: ${errorMsg}`);
        navigate('/login', { replace: true });
      }
    };

    loginWithKakao();
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column' 
    }}>
      <div className="loader"></div> {/* 로딩 애니메이션이 있다면 추가 */}
      <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
        카카오 인증 정보를 확인하고 있습니다...
      </p>
    </div>
  );
};

export default KakaoCallback;