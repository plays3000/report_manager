import { useState, type ChangeEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import {getUserIp} from './getIp';

export const useAuth = () => {
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>(''); // 이름 추가
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
            // const userIp = await getUserIp();
            // 🚨 수정: localhost 주소를 제거하고 상대 경로 사용
            const response = await axios.post('/api/auth/login', { 
            id, 
            password, 
            // lastIp: userIp // 👈 서비스의 currentIp 인자로 들어감
        });
            const result = response.data.result || response.data; 

            if (result?.token) {
                localStorage.setItem('token', result.token);
                const actualName = result.user?.name || result.name || id; 
                localStorage.setItem('userName', actualName);
                setMessage('로그인 성공! 이동 중...');
                setTimeout(() => navigate('/dashboard'), 100);
            }
        } catch (error) {
            const err = error as AxiosError<{message: string}>;
            setMessage(err.response?.data?.message || '아이디 또는 비밀번호를 확인하세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        // 세션이 끝났음을 알리고 로그인 페이지로 이동
        navigate('/login', { replace: true }); 
    };

    // 컴포넌트에서 사용할 값들을 내보냅니다.
    return {
        id, password,name, message, isLoading,
        handleIdChange, handlePasswordChange, handleLogin, handleLogout,
        handleNameChange, handleRegister
    };
};