import axios from "axios";

axios.defaults.withCredentials = true;

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
const msleep = (n) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
};
const sleep = (n) => {
  msleep(n * 1000);
};

class HttpUtils {
  constructor(interval_mode) {
    this.interval_mode = interval_mode;
  }
  checkRequest() {
    if (!this.interval_mode) return;
    if (!this.__pre_request_time) {
      this.__pre_request_time = Date.now();
      return;
    }
    const during_time = Date.now() - this.__pre_request_time;
    const during_ms = during_time / 1000;

    // 至少间隔1秒 随机达到无规律的效果
    if (during_ms < random(1000, 5000)) {
      const min_sleep_secs = 1;
      let max_sleep_secs = 10 - during_ms / 1000;
      if (max_sleep_secs <= min_sleep_secs) {
        max_sleep_secs = min_sleep_secs * 2;
      }
      const sleep_secs = random(min_sleep_secs, max_sleep_secs);
      sleep(sleep_secs);
    }
    this.__pre_request_time = Date.now();
  }
  async post(url, headers, data){
      let i = 0;
      while(i<3){
          try {
              this.checkRequest();
              const res = await axios.post(url,{ headers, data });
              return res;
          } catch (error) {
              i+=1;
          }
      }
  }
  async get(url, headers, params){
    let i = 0;
    while(i<3){
        try {
            this.checkRequest();
            const res = await axios.get(url,{ headers, params });
            return res;
        } catch (error) {
            i+=1;
        }
    }
}
}


export default HttpUtils;
