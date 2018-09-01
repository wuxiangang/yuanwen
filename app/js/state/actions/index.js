import Axios from '../../modules/fetch';
import GLOBAL from '../../modules/global';

//通用一次性, 用于服务端渲染
export function fetchList(param, kind, error) { 

    if(!param) return;
    const axios = new Axios(param);
    //接口不存在处理
    if ( !axios.api )  return (dispatch) => { () => dispatch({})} ;    

    let default_param = {
        key: param,
        type: 'FETCH_SUCCESS',
        payload: {code: 402}
    };
    
    const route = param.split('.');
    if (kind) default_param.key  = route[0];

    return (dispatch) => {
      return  axios.ajax()
        .then(json => { 
            default_param.payload = json;
            return dispatch(default_param)
        }).catch((err) => {
            //可插入错误处理
            error && error();
            //默认超时处理
            return dispatch(default_param)
        });
      }
}

export function fetchRequest(api, options, callback, error) {
    const axios = new Axios();
    return axios.request(api, options).then((res) => {
            if (res.code && res.code !== 200) {
                if (res.code === 1003) {
                    GLOBAL.removeCookie('token');
                    setTimeout(() => {
                        location.href = '/login';
                    },1000);
                }
                error && error(res);
            } else
                callback && callback(res);
        }).catch((e) => {
            error && error({code: 402, reason: '响应超时'});
        })
}

export function fetchFile(api, options, callback, error) {
    const axios = new Axios();
    return axios.upload(api, options).then((res) => {
            if (res.code && res.code !== 200)
                error && error(res);
            else
                callback && callback(res);
        }).catch((e) => {
            error && error({code: 402, reason: '响应超时'});
        })
}

//清楚某个数据
export function clearProps(key) {
    return (dispatch) => { 
        dispatch({ type: 'CLEAR_PROPS_DATA',  key: key })
    } ;    
};

export function addShelf(key, show) {
    return (dispatch) => { 
        dispatch({ type: 'ADD_SHELF',  key, show })
    } ; 
};

export function AssignProps(res, key) {
    return (dispatch) => { 
        dispatch({ type: 'ASSIGN_PROPS_DATA', payload: res,  key: key })
    } ;    
};