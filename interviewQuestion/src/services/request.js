import axios from 'axios';
import { notification, message } from 'antd';

axios.defaults.timeout = 15000;
axios.defaults.baseURL = `/api`;
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
  config => {
    return config; //添加这一行
  },
  error => {
    return Promise.reject(error);
  },
);

export default function request(opt) {
  return new Promise((resolve, reject) => {
    const r = axios(opt)
      .then(response => {
        const msg = response.data.msg;
        if (msg) {
          if (msg.includes('成功')) {
            message.success(msg);
          } else {
            message.error(msg);
            return;
          }
        }
        // 请求成功
        resolve(response.data.result);
      })
      .catch(error => {
        let errorMessage = '抱歉,页面出错了';
        if (error.request) {
          // 如果是请求时的错误，且没有收到相应的code
          // `error.request`是一个浏览器的XMLHttpRequest实例
        } else {
          // 一些错误是在设置请求时触发的
          errorMessage = error.message;
        }
        notification.error({
          message: errorMessage,
          className: 'ant-notification-notice-error',
        });

        reject(errorMessage);
      });
    return r;
  });
}
