import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50, // 50 usuários simultâneos exigidos no requisito
  duration: '10s',
};

export default function () {
  const url = 'http://localhost:3000/transfers';
  const payload = JSON.stringify({
    transactionId: `tx-${Math.random()}`,
    sourceId: 'acc-1',
    targetId: 'acc-2',
    amount: 1,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);
  check(res, {
    'status is 200 or 400 (expected due to balance)': (r) => r.status === 200 || r.status === 400,
  });
  sleep(0.1);
}