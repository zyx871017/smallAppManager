import common from './common';

var token = localStorage.getItem('token');
console.log(token);
if(!token){
    window.location.hash = '/login';
}

module.exports.request = function (url, option) {
    const opt = Object.assign({} , {
        header: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }, option);
    return new Promise(function (resolve, reject) {
        console.log(opt);
        fetch(`${common.apiPrefix}${url}`, opt)
            .then(function (response) {
                console.log(response);
                if(response.status === 200){
                    return response.json()
                }else{
                    reject(resolve);
                }
            })
            .then(function (res) {
                if(res.retCode === 0) {
                    resolve(res);
                }else{
                    reject(res);
                }
            })
            .catch(function (res) {
                console.log(res);
                alert('请求出错，请稍后重试！')
            });
    })
};