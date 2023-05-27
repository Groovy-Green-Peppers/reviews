import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 140,
  duration: '30s',
};

export default function () {
  const randomID = Math.floor(Math.random() * 1000000);
  const res = http.get(`http://127.0.0.1:3000/reviews/?product_id=${randomID}&`);

  sleep(0.5);
}
