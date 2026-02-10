import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // 로그인 시 저장했던 사용자 정보 가져오기
    const storedName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');

    // 토큰이 없으면 로그인 페이지로 튕겨내기 (이중 보안)
    if (!token) {
      navigate('/login');
    } else {
      setUserName(storedName || '관리자');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* 사이드바 */}
      <nav style={styles.sidebar}>
        <h2 style={styles.logo}>PLAYS 3000</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}>📊 대시보드</li>
          <li style={styles.navItem}>👤 계정 관리</li>
          <li style={styles.navItem}>📑 리포트 생성</li>
          <li style={styles.navItem}>⚙️ 시스템 설정</li>
        </ul>
      </nav>

      {/* 메인 컨텐츠 영역 */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h3>시스템 현황</h3>
          <div style={styles.userInfo}>
            <span><strong>{userName}</strong> 님 환영합니다</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>로그아웃</button>
          </div>
        </header>

        {/* 대시보드 카드 섹션 */}
        <section style={styles.cardGrid}>
          <div style={styles.card}>
            <h4>전체 리포트</h4>
            <p style={styles.cardNumber}>1,284</p>
          </div>
          <div style={styles.card}>
            <h4>활성 사용자</h4>
            <p style={styles.cardNumber}>56</p>
          </div>
          <div style={styles.card}>
            <h4>오늘의 이슈</h4>
            <p style={{...styles.cardNumber, color: '#ff4d4f'}}>3</p>
          </div>
        </section>

        <div style={styles.contentPlaceholder}>
          <p className="read-the-docs">여기에 주요 데이터 테이블이나 그래프가 들어갑니다.</p>
        </div>
      </main>
    </div>
  );
};

// 기본 인라인 스타일 (추후 CSS 파일로 분리 추천)
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f0f2f5', color: '#333' },
  sidebar: { width: '240px', backgroundColor: '#001529', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' },
  logo: { fontSize: '20px', marginBottom: '40px', color: '#1890ff', textAlign: 'center' },
  navList: { listStyle: 'none', padding: 0 },
  navItem: { padding: '15px 10px', cursor: 'pointer', borderBottom: '1px solid #1f2d3d', fontSize: '14px' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  header: { height: '64px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', boxShadow: '0 1px 4px rgba(0,21,41,.08)' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoutBtn: { padding: '5px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '24px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardNumber: { fontSize: '24px', fontWeight: 'bold', marginTop: '10px' },
  contentPlaceholder: { margin: '0 24px 24px', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', minHeight: '300px', textAlign: 'center' }
};

export default Dashboard;