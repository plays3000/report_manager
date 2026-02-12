import { useState, type ChangeEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
// import {getUserIp} from './getIp';

const REST_API_KEY = import.meta.env.VITE_REST_API; 
const REDIRECT_URI = "http://localhost:3000/auth/kakao/callback";
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export const useAuth = () => {
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>(''); // 이름 추가
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tempUserId, setTempUserId] = useState<string>(''); // 2차 인증을 위해 ID 임시 저장
    const navigate = useNavigate();

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => setId(e.target.value);
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // const lastIp = await getUserIp();
            await axios.post('/api/auth/register', {
                id,
                password,
                name,
                // lastIp
            });
            setMessage('회원가입 성공! 로그인해주세요.');
            setTimeout(() => navigate('/login'), 1500);
        } 
        catch (error) {
            const err = error as AxiosError<{message: string}>;
            setMessage(err.response?.data?.message || '회원가입에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/api/auth/login', { id, password });
            const result = response.data.result || response.data;

            // 1. 관리자(Admin) 분기: 2차 인증이 필요한 경우
            if (result.role === 'admin' || result.requires2FA) {
                setMessage('관리자 인증 코드가 발송되었습니다.');
                
                // Admin2FA 페이지로 이동할 때 adminId를 state로 전달
                setTimeout(() => {
                    navigate('/admin-verify', { state: { adminId: id } });
                }, 1000);
                return; // 관리자는 여기서 로직 종료 (2FA 페이지에서 최종 토큰 저장)
            }

            // 2. 일반 사용자(User) 분기: 즉시 로그인 성공 처리
            else{
                if (result.token) {
                    localStorage.setItem('token', result.token);
                    const actualName = result.user?.name || result.name || id;
                    localStorage.setItem('userName', actualName);
                    
                    setMessage('로그인 성공! 이동 중...');
                    setTimeout(() => navigate('/dashboard'), 100);
                }
                
            }
            
        } catch (error) {
            const err = error as AxiosError<{message: string}>;
            setMessage(err.response?.data?.message || '아이디 또는 비밀번호를 확인하세요.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleKakaoLogin = () => {
        // REST_API_KEY가 정상적으로 로드되었는지 확인
        if (!REST_API_KEY) {
        alert("카카오 API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.");
        return;
        }
        window.location.href = KAKAO_AUTH_URL;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        
        // 세션이 끝났음을 알리고 로그인 페이지로 이동
        navigate('/login', { replace: true }); 
    };

    // 컴포넌트에서 사용할 값들을 내보냅니다.
    return {
        id, password,name, message, isLoading,tempUserId,
        handleIdChange, handlePasswordChange, handleLogin, handleLogout,
        handleNameChange, handleRegister, handleKakaoLogin 
    };
};