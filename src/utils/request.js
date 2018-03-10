import Axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'

import {
    Message
} from 'element-ui'

// 项目初始化的时候记住初始cookie 每次请求会比较cookie是否有更新
// const access_token = Cookies.get('access_token')

// 设置公共请求头
// Axios.defaults.headers.common['Authorization'] = `bearer ${access_token}`

/**
 * get
 * @param  {String} url    [地址]
 * @param  {Object} params [参数]
 * @return {Object}        [Promise]
 */
export const $get = (url, params) => {
    if (access_token != Cookies.get('access_token')) {
        window.location.reload()
        return
    }
    return new Promise((resolve, reject) => {
        Axios.get(url, {
            params: {
                ...params,
                _t: new Date().getTime(),
            }
        }).then((res) => {
            if (res.status === 200) {
                resolve(res.data)
            } else {
                failMessage()
                reject(res)
            }
        }).catch((mes) => {
            failMessage(mes.response.data.message)
            reject(mes.response.data)
        })
    })
}
/**
 * post
 * @param  {String} url     [地址]
 * @param  {Object} {Array} [参数,可直接传入一个数组]
 * @param  {String} type    [可不传，设定为form为formdata提交]
 * @return {Object}         [Promise]
 */
export const $post = (url, params, type) => {
    if (access_token != Cookies.get('access_token')) {
        window.location.reload()
        return;
    }
    if (type == 'form') {
        /**
         * @description qs.stringify(param, option)
         * option.arrayFormat 确定转换数组类型参数结果
         * brackets key[]
         * indices key[i]
         * repeat key
         */
        params = qs.stringify(params, {
            // arrayFormat: 'brackets'
        });
    } else if (type == 'multiple') {
        let data = new FormData()
        for (let key in params) {
            data.append(key, params[key])
        }
        params = data
    } else {
        let type = Object.prototype.toString.call(params)
        if (type !== '[object Array]') {
            params = { ...params }
        }
    }

    return new Promise((resolve, reject) => {
        Axios.post(url, params, {
            
        }).then((res) => {
            if (res.status === 200) {
                resolve(res.data)
            } else {
                failMessage()
                reject(res)
            }
        }).catch((mes) => {
            reject(mes)
        })
    })
}

const failMessage = (mes = '服务器繁忙') => {
    Message({
        showClose: true,
        message: mes,
        type: 'warning'
    })
}