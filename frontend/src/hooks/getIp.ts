import axios from 'axios';

// 사용자의 IP 주소를 가져오는 함수
export const getUserIp = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip; // 예: "123.456.78.90"
  } catch (error) {
    console.error("IP 주소를 가져오는데 실패했습니다.", error);
    return null;
  }
};