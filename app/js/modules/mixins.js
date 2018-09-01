import browserHistory from 'react-router/lib/browserHistory';
import {fetchList, fetchRequest, clearProps, fetchFile, AssignProps, addShelf} from '../state/actions/index'
import GLOBAL from './global';

const mixins = function () {
  const _this = this;
  return {
    fetchRequest,
    fetchList,
    fetchFile,
    clearProps,
    AssignProps,
    addShelf,
    isRouter() {
      return _this.props.children === null;
    },
    getProps() {
      const url = global.pathname || window.location.pathname;
      let key = url.replace(/\?.*$/, '').replace(/^\//, '').replace(/\/$/, '').split('/');
      key = key[key.length - 1];

      return key;
    },
    getParts() { 
      return this.getKey(_this.props).split('.');
    },
    getId() { // get router last param
      const url = global.pathname || window.location.pathname;
      let key = url.replace(/\?.*$/, '').replace(/^\//, '').replace(/\/$/, '').split('/');
      key = key[key.length - 1].split('.');
      return key[key.length-1];
    },
    getKey(props) {   // get current router param key
      for (let key  in props.routeParams) {
        return props.routeParams[key]
      }
    },
    getFrontPath() {
        let path = _this.props.route.path.replace(/:([^"]*)/, '');
        path = location.pathname.split(`/${path}`)[0];
        return path;
    },
    goBack() {
       let path = _this.props.route.path.replace(/:([^"]*)/, '');
       path = location.pathname.split(`/${path}`)[0];
      if (typeof path === 'string')     {
        browserHistory.push(path);
      } else      {
        browserHistory.goBack();
      }
    },
    getData() {
        _this.props.dispatch(fetchList(this.getProps())).then((res)=>{
          this.doing = false;
        });
    },
    whetherFetch() {
      if (this.doing) return Promise.resolve();
      if (this.isRouter() && !_this.props[this.getProps()]) { this.doing=true; this.getData();}
    },
    lazyLoad(parent) {
      const imgs = parent.getElementsByTagName('img');
      if ( !imgs.length ) return;

      let tid = 0;
      this.checkImg(imgs);
      parent.onscroll = (e) => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          this.checkImg(imgs);
        }, 80);
      }
    },
    checkImg(imgs) {
      Array.prototype.slice.call(imgs).map((v,i) => {
        if (this.inScreen(v))  {
          if (v.dataset.src === 'loaded') return;
          const url = v.dataset.src;
          var im = new Image();
          im.src = url;
          im.onload = () => {
              im.onload =null; 
              v.src = url;
              v.dataset.src = 'loaded';
              // v.className = v.className + ' lazy-show';
          }
          im.onerror = () => {
            v.dataset.src = 'loaded';
          }
        }
      })
    },
    inScreen(img) {
      const rect = img.getBoundingClientRect();
        return ((rect.top > 0 && rect.top < window.innerHeight && 0x02)
        | (rect.right > 0 && rect.right < window.innerWidth && 0x01)
        | (rect.bottom > 0 && rect.bottom < window.innerHeight && 0x02)
        | (rect.left > 0 && rect.left < window.innerWidth && 0x01)
         ) == 0x03;
    },
    skipUrl(path) {
      browserHistory.push(GLOBAL.setHref(path) );
    },
    go(path){
      browserHistory.push(path);
    },
    setHref(path) {
      return GLOBAL.setHref(path);
    },
    isWx() {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') return true;
      return false;
    },
    isLogin() {
      return !!GLOBAL.cookie('token');
    },
    checkLogin() {
      if (!this.isLogin()) {
        if (!this.isWx()) {
          this.goBack();
        }
        return false;
      }
      return true;
    },
    scrollHandle(e){
      const list = e.target;
      clearTimeout(list.timer);
      list.timer = setTimeout(() => {
        if (list.offsetHeight + list.scrollTop + 60 > list.scrollHeight || list.offsetHeight >= list.scrollHeight) {
           _this.getAsynData();
        }
      }, 300);
    }
    // getBacks() {
    //   const path = _this.props.route.path || '/';
    //   const route = path.replace(/:([^"]*)/, '');
    //   const arrs = window.location.pathname.split(`/${route}`);
    //   if (arrs.length > 2) {
    //     this.path = arrs[0];
    //     for (let i = 1; i < arrs.length - 1; i++) {
    //       this.path += `/${route}${arrs[i]}`;
    //     }
    //   } else {
    //     this.path = arrs[0];
    //   }
    //   return this.path;
    // },
    // goBack() {
    //   const path = this.getBacks();
    //   if (typeof path === 'string')     {
    //     browserHistory.push(path);
    //   } else      {
    //     browserHistory.goBack();
    //   }
    // }
  };
};

module.exports = mixins;
