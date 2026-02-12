import { Request } from 'express';

export const getClientIp = (req: Request) => {
  let ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  
  // 1. 만약 여러 개의 IP가 전달된 경우 (프록시 여러 번 거침), 첫 번째 IP 선택
  if (ip.includes(',')) {
    ip = ip.split(',')[0]!.trim();
  }

  // 2. IPv6 매핑된 IPv4 주소 정리 (::ffff:192.168.0.33 -> 192.168.0.33)
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  // 3. 로컬 호스트 IPv6 처리 (::1 -> 127.0.0.1)
  if (ip === '::1') {
    ip = '127.0.0.1';
  }

  return ip;
};