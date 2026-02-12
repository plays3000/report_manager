import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../style/css/dashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const { handleLogout } = useAuth();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    // const token = localStorage.getItem('token');

    setUserName(storedName || 'Admin');

    // --- 뒤로가기 감지 및 로그아웃 로직 추가 ---
    
    // 현재 페이지 상태를 push하여 뒤로가기 시 한 번 가로챌 수 있게 만듭니다.
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      const isConfirm = window.confirm("뒤로가기를 누르면 로그아웃됩니다. 계속하시겠습니까?");
      
      if (isConfirm) {
        // 사용자가 '확인'을 누르면 로그아웃 처리
        handleLogout();
      } else {
        // '취소'를 누르면 다시 현재 페이지 상태를 밀어넣어 페이지를 유지합니다.
        window.history.pushState(null, '', window.location.href);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('popstate', handlePopState);

    // 컴포넌트 언마운트 시 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, handleLogout]);

  return (
    <div className="dashboard-container">
      {/* ... 기존 사이드바 및 메인 컨텐츠 UI 생략 ... */}
      <nav className="sidebar">
        <h2 className="sidebar-logo">Account ERP</h2>
        <ul className="nav-list">
          <li className="nav-item">📊 관리자 대시보드</li>
          <li className="nav-item">👤 관리자 계정 관리</li>
          <li className="nav-item">📑 관리자 리포트 생성</li>
          <li className="nav-item">⚙️ 관리자 시스템 설정</li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="dashboard-header">
          <h3>시스템 현황</h3>
          <div className="user-info">
            <span><strong>{userName}</strong> 님 환영합니다</span>
            <button onClick={handleLogout} className="logout-btn">로그아웃</button>
          </div>
        </header>
        {/* ... 카드 섹션 등 기존 코드 ... */}
      </main>
    </div>
  );
};

export default AdminDashboard;