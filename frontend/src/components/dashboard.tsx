import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../style/css/dashboard.css'; // ✅ CSS 파일 임포트

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const { handleLogout } = useAuth();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      setUserName(storedName || '사용자');
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* 사이드바 */}
      <nav className="sidebar">
        <h2 className="sidebar-logo">Account ERP</h2>
        <ul className="nav-list">
          <li className="nav-item">📊 대시보드</li>
          <li className="nav-item">👤 계정 관리</li>
          <li className="nav-item">📑 리포트 생성</li>
          <li className="nav-item">⚙️ 시스템 설정</li>
        </ul>
      </nav>

      {/* 메인 컨텐츠 영역 */}
      <main className="main-content">
        <header className="dashboard-header">
          <h3>시스템 현황</h3>
          <div className="user-info">
            <span><strong>{userName}</strong> 님 환영합니다</span>
            <button onClick={handleLogout} className="logout-btn">로그아웃</button>
          </div>
        </header>

        {/* 대시보드 카드 섹션 */}
        <section className="card-grid">
          <div className="dashboard-card">
            <h4>전체 리포트</h4>
            <p className="card-number">1,284</p>
          </div>
          <div className="dashboard-card">
            <h4>활성 사용자</h4>
            <p className="card-number">56</p>
          </div>
          <div className="dashboard-card">
            <h4>오늘의 이슈</h4>
            {/* 여러 클래스를 조합할 때는 백틱(``)을 쓰면 편해요 */}
            <p className="card-number issue-number">3</p>
          </div>
        </section>

        <div className="content-placeholder">
          <p className="read-the-docs">여기에 주요 데이터 테이블이나 그래프가 들어갑니다.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;