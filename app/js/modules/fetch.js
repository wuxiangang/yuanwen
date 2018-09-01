import 'babel-polyfill';
import axios from 'axios';
import qs from 'qs';
import GLOBAL from './global';

//vision control
const vision = 1;

// ajax constructor
Axios.prototype.API = {
  page: { method: 'GET', base: `/yw/rest/v${vision}/page/content`, param: { page_id: 1, pages: 1,  contents: 20 } },
  introduce: { method: 'GET', base: `/yw/rest/v${vision}/book/info`, param: { book_id: 1 } },
  comment: { method: 'GET', base: `/yw/rest/v${vision}/review/book/list`, param: { book_id: 1, pages: 1, contents: 10 } },
  addcomment: { method: 'POST', base: `/yw/rest/v${vision}/review/add`, param: { book_id: 1, chapter_id: null, title: null, content:null, type: 0 } },
  deletecomment: { method: 'POST', base: `/yw/rest/v${vision}/review/delete`, param: { review_id: null } },
  chapter: { method: 'GET', base: `/yw/rest/v${vision}/content/index`, param: { book_id: 1, chapter_id: 1} },
  order: { method: 'POST', base: `/yw/rest/v${vision}/book/order/pay`, param: { chapter_id: null } },
  list: { method: 'GET', base: `/yw/rest/v${vision}/block/content`, param: { block_id: null, pages: 1,contents: 20 } },
  author: { method: 'GET', base: `/yw/rest/v${vision}/book/list`, param: { author_id: null, pages: 1,contents: 20 } },
  notice: { method: 'GET', base: `/yw/rest/v${vision}/block/content`, param: { block_id: 23, pages: 1,contents: 100 } },
  baidu: { method: 'GET', base: 'https://openapi.baidu.com/oauth/2.0/token', param: { client_id: '', client_secret: '',grant_type: 'client_credentials'} },
  catalogue: { method: 'GET', base:  `/yw/rest/v${vision}/book/chapters`, param: { book_id: 1, order: ''} },
  register: { method: 'POST', base:  `/yw/rest/v${vision}/auth/register`, param: { mobile_num: null, promot: 'html5_web', channel: 5, password: null, sign: null} },
  login: { method: 'POST', base:  `/yw/rest/v${vision}/auth/login/custom`, param: { user_name: null, password: null} },
  resetpwd: { method: 'POST', base:  `/yw/rest/v${vision}/auth/reset/passwd`, param: { user_name: null, password: null, sign: null} },
  code: { method: 'POST', base:  `/yw/rest/v${vision}/auth/resend/key`, param: { user_name: null} },
  me: { method: 'GET', base:  `/yw/rest/v${vision}/me`, param: {} },
  shelf: { method: 'GET', base:  `/yw/rest/v${vision}/shelf/list`, param: {pages:1, contents: 100, order: 1, order_type: 'desc'} },
  purchased: { method: 'GET', base:  `/yw/rest/v${vision}/me/purchased`, param: {pages:1, contents: 1000} },
  addshelf: { method: 'POST', base:  `/yw/rest/v${vision}/shelf/add`, param: {book_id: null} },
  deleteshelf: { method: 'POST', base:  `/yw/rest/v${vision}/shelf/delete`, param: {book_id: null} },
  logout: { method: 'POST', base:  `/yw/rest/v${vision}/auth/logout`, param: {} },
  portrait: { method: 'POST', base:  `/yw/rest/v${vision}/file/portrait`, param: {} },
  feedback: { method: 'POST', base:  `/yw/rest/v${vision}/me/feedback`, param: {content: null} },
  reset: { method: 'POST', base:  `/yw/rest/v${vision}/auth/reset/user`, param: {user_name:null,  mobile_num: null,  email: null,  new_password:null,  old_password:null,  gender:null,  birthday:null  } },
  category: { method: 'GET', base:  `/yw/rest/v${vision}/category/content`, param: {tid: null, name: null, pages:1, contents: 20} },
  balance: { method: 'GET', base:  `/yw/rest/v${vision}/me/balance`, param: {} },
  detail: { method: 'GET', base:  `/yw/rest/v${vision}/me/consume/list`, param: {pages: 1, contents: 20} },
  pay_zfb: { method: 'POST', base:  `/yw/rest/v${vision}/pay`, param: {productId:null,  callback: null} },
  isRegister: { method: 'GET', base:  `/yw/rest/v${vision}/auth/check/user`, param: {user_name: null, type: 'reset'} },
  notice_detail: { method: 'GET', base:  `/yw/rest/v${vision}/text/content`, param: {id: null} }
};

Axios.prototype.setHeader = function() {
  const isNode = typeof window === 'undefined';
  const token = isNode ? global.cookie.token : GLOBAL.cookie('token');
  const uuid = isNode ? global.cookie.yw_uuid : GLOBAL.cookie('yw_uuid');
  return {
    'info-uuid': uuid || '',
    'info-deviceType': GLOBAL.isAndroid() ? 'Android' : 'Ios',
    'info-platform': 4,
    'info-ostype': '',
    'info-vcode': '',
    'token': token || ''
  };
};

// const baseURL = 'http://192.168.0.34:9090';
// const baseURL = 'http://101.200.141.73:9095';
const baseURL = 'http://api.yuanwen.org';
Axios.prototype.ajax = function(){
  const isGet = this.api.method.toLowerCase() === 'get';
  let headers = this.setHeader();
  if (!isGet)  headers["Content-Type"] = "application/x-www-form-urlencoded;";

  const options = {
    method: this.api.method,
    url: this.api.base,
    baseURL: baseURL,
    timeout: 10000,
    headers,
    withCredentials: true,
    params: isGet ? this.api.param : null,
    data: !isGet ? qs.stringify(this.api.param) : null,
    responseType: 'json'
  }

  return axios(options).then((res)=>{
    return res.data;
  });
};

Axios.prototype.request = function(api, options){
  this.api = this.API[api];
  if (options)  this.api.param = Object.assign({},this.api.param, options);
  return this.ajax();
};

Axios.prototype.upload = function(api, options){
  this.api = this.API[api];
  let headers = this.setHeader();
  headers["Content-Type"] = "multipart/form-data";
  const config = {
    timeout: 10000,
    headers,
    withCredentials: true
  };
  return axios.post(baseURL+this.api.base, options, config).then((res)=>{
    return res.data;
  });
};


function Axios(param){
  if (!param) return;
  const options = param.split('.');
  const api = this.API[options.shift()];
  if (!api)  {this.api = null; return;}
  let i = 0;
  for (let key in api.param) {
    if(options[i] && options[i] !== '-')
      api.param[key] = options[i];
    i ++;
  };
  this.api = api;
};

module.exports = Axios;
