import common from './common';

const token = localStorage.getItem('token') || '';

if (!token) {
  window.location.hash = '/login';
} else {
  if (window.location.hash === '#/login') {
    window.location.hash = '/main/goodsList';
  }
}

module.exports.request = function (url, option, data) {
  const token = localStorage.getItem('token')||'';
  let queryString = '';
  if (data) {
    Object.keys(data).forEach((value, index) => {
      queryString += `&${value}=${data[value]}`;
    })
  }
  const opt = Object.assign({}, {
    headers: {
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }, option);
  url += `?token=${token}${queryString}`;
  return new Promise(function (resolve, reject) {
    fetch(`${common.apiPrefix}${url}`, opt)
      .then(function (response) {
        if (response.status === 200) {
          return response.json()
        } else {
          reject(resolve);
        }
      })
      .then(function (res) {
        if (res.retCode === 0) {
          resolve(res);
        }else if(res.retCode === -13){
          alert(res.msg);
          localStorage.removeItem('token');
          window.location.hash = '/login';
        }
        else {
          reject(res);
        }
      })
  })
    .catch(function (res) {
      alert('请求出错，请稍后重试！');
      return res;
    });
};