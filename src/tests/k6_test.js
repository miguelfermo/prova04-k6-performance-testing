import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export const get_duration = new Trend('get_duration');
export const status_ok = new Rate('status_ok');

export let options = {
  stages: [
    { duration: '30s', target: 7 },
    { duration: '1m', target: 30 },
    { duration: '1m', target: 60 },
    { duration: '1m', target: 92 },
  ],
  thresholds: {
    'http_req_duration': ['p(90)<6800'],
    'http_req_failed': ['rate<0.25'],
    'get_duration': ['p(90)<6800'],
    'status_ok': ['rate>0.75'],
  },
};

const BASE = 'https://jsonplaceholder.typicode.com';

export default function () {
  const res = http.get(`${BASE}/todos/1`);
  get_duration.add(res.timings.duration);
  status_ok.add(res.status === 200);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(10);
}
