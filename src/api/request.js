import axios from 'axios';
// import { ElMessage } from 'element-plus'


import httpUrl from '@/api/httpUrl'

const controller = new AbortController();

// export const getBaseURL = (() => {
//   const baseURL = process.env.VUE_APP_ENV === 'development'
//     // 开发时path没有 /dev-gis-manager /pre-gis-manager /pro-gis-manager
//     // 直接使用 /dev-api
//     ? process.env.VUE_APP_BASE_API
//     // 打包后需要 /dev-gis-manager /pre-gis-manager /pro-gis-manager 路由
//     : window.location.pathname + '/' + process.env.VUE_APP_BASE_API
//   return baseURL;
// })

// Content-Type：https://blog.csdn.net/weixin_59237016/article/details/124053822
// 创建axios的实例
const service = axios.create({
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
    // baseURL: getBaseURL().replaceAll(/\/+/g, '/'), // url = base url + request url
    baseURL: process.env.NODE_ENV === 'production' ? `/` : '/', // 生产/开发环境

    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        // 'Content-Type': 'application/json;charset=utf-8'
    },
    withCredentials: false, // 跨域请求时是否需要使用凭证 cookie
    timeout: 30000,
    // `validateStatus` 定义对于给定的 HTTP 响应状态码是 resolve 或 reject  promise 。
    validateStatus() {
        // `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
        // 使用 async-await，处理 reject 情况较为繁琐，所以全部返回 resolve，在业务代码中处理异常
        return true;
    },
});

// 添加请求拦截器
// let requestWhiteList = [httpUrl.user.captchaImage, httpUrl.user.login] // 不需token的接口
service.interceptors.request.use((config) => {

    // 判断是否需要token
    // let noToken = requestWhiteList.includes(config.url)
    // if(!noToken){
    //   // 获取token，并将其添加至请求头中
    //   const token = getToken();
    //   if(token){
    //     config.headers.Authorization = token;
    //   }
    // }

    return config;
}, (error) => {

    // 错误抛到业务代码
    error.data = {
        message: '服务器异常，请联系管理员！'
    };

    return Promise.reject(error);
});

const responseError = (response) => {
    let message = showStatus(response.data.message)
    //   ElMessage({
    //     message: response.data.msg || message,
    //     type: 'error',
    //     showClose: true,
    //     grouping: true, // 合并相同内容的消息
    //   });

    throw response;// 抛出错误
}

// const statusList = [httpUrl.search.searchType, httpUrl.balance.getCommunity, httpUrl.cover.getCellResourceSrateByArea, httpUrl.cover.getRealtimetsPointGridData, httpUrl.cover.getEndServiceCommunityList, httpUrl.getUserInfo, httpUrl.getUserInfoByName]
//添加响应拦截器
service.interceptors.response.use((response) => {

    if (response.status == 200) {
        // if (response.data.status == 0) { // 百度
        //     return response.data
        // } else if (response.data.code == '200') {
        //     return response.data.data
        // }
        // // else if (response.config.url == httpUrl.cover.dataExport) { // 文件下载
        // //     return response
        // // }
        // else {
        //     // console.log('响应拦截器', response)
        //     // if (response.data.message.success) { // 退服小区
        //     //   return response.data
        //     // } else 
        //     if (response.data.code == '204') { // 阳豪接口，数据为空
        //         return response.data.data
        //     }
        //     responseError(response)
        // }
    } else {
        responseError(response)
    }

}, (error) => {
    // console.log('响应拦截器error', error.response)
    const message = '请求超时或服务器异常，请检查网络或联系管理员！';
    //   ElMessage({
    //     message,
    //     type: 'error',
    //     showClose: true,
    //     grouping: true,
    //   });

    return Promise.reject(error);
});

const showStatus = (status) => {
    let message = '';
    switch (status) {
        case 401:
            message = '未授权，请重新登录(401)';
            break;
        case 403:
            message = '拒绝访问(403)';
            break;
        case 404:
            message = '请求出错(404)';
            break;
        case 500:
            message = '服务器错误(500)';
            break;
        default:
            message = '连接出错';
    }
    return message
    // return `${message}，请检查网络或联系管理员！`
};

// 封装 get 方法，类型为 Get
const get = async (url, config) => {
    // if(!config){
    //   config = {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //     },
    //     signal: controller.signal
    //   }
    // }
    if (!config) config = {}
    config.signal = controller.signal

    const response = await service.get(url, config);
    return response;
};

// 封装 post 方法，类型为 Post
const post = async (url, params, config) => {
    if (!config) config = {}
    config.signal = controller.signal
    const response = await service.post(url, params, config);
    return response;
};

// 封装 post 方法，类型为 Post
const put = async (url, params, config) => {
    if (!config) config = {}
    const response = await service.put(url, params, config);
    return response;
};

// 封装 delete 方法，类型为 Delete
// delete 不能用做变量名
const deleteApi = async (url, params, config) => {
    if (!config) config = {}
    const response = await service.delete(url, {
        data: params
    }, config);
    return response;
};

// 取消请求
const cancelRequest = () => {
    controller.abort()
}

// 使用 request 统一调用，包括封装的 get、post、delete 方法
const request = {
    get,
    post,
    put,
    deleteApi,
    cancelRequest
};

export default request;

export { service };