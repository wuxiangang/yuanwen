const GLOBAL = {
    isRouter(route) {
      return route.children === null;
    },
    setCookie(cookies, key) {
      const cookiesArr = cookies ? cookies.split('; ') : [];
      let result = key ? undefined : {};
      for (let i = 0, l = cookiesArr.length; i < l; i++) {
        const parts = cookiesArr[i].split('=');
        const name = decodeURI(parts[0]);
        const cookie = decodeURI(parts[1]);
        if (key && key === name) {
          result = cookie;
          break;
        } else if (!key) {
          result[name] = cookie;
        }
      }
      return result;
    },
    cookie(key, value, options) {
    if (value !== undefined) {
      options = options || {};
      let dt = options.expires;
      if (typeof dt === 'number') {
        const days = dt;
        dt = new Date();
        dt.setDate(dt.getDate() + days);
        dt = dt.toUTCString();
      }
      return (document.cookie = [
        encodeURIComponent(key),
        '=',
        encodeURIComponent(value),
        options.expires ? `; expires=${dt}` : '', // use expires attribute, max-age is not supported by IE
        options.path ? `; path=${options.path}` : '; path=/',
        options.domain ? `; domain=${options.domain}` : '',
        options.secure ? `; secure=${options.secure}` : ''
      ].join(''));
    }
    return this.setCookie(document.cookie, key);
  },
  isAndroid() {
    const userAgent = typeof window === 'undefined' ? global.userAgent : navigator.userAgent;
    return /linux|android/i.test(userAgent);
  },
    addClass(ele, name) {
    ele.className += ` ${name.trim()}`;
  },
    removeClass(ele, name) {
    let cls = ele.className.trim();
    if (cls.indexOf(name) !== -1) {
      cls = cls.replace(name, '');
      cls = cls.replace(/\s{2,}/g, ' ');
      cls = cls.trim();
      ele.className = cls;
    }
  },
  removeCookie(key, path, domain) {
    path = path || '/';
    // domain = domain || location.hostname;
    if (GLOBAL.cookie(key) !== undefined) {
      GLOBAL.cookie(key, '', { expires: 'Thu, 01-Jan-1970 00:00:01 GMT', path, domain });
      return true;
    }
    return false;
  },
  setHref(str) {
      if (typeof window === 'undefined') {
        return `${global.pathname}/${str}`;
      } else {
        return `${location.pathname}/${str}`;
      }
  },
  skipHref(v) {
    const type = v.content_type;
    const target = null;
    switch(type) {
      case 1: 
        return { to: GLOBAL.setHref(`book/introduce.${v.content_id}`), target};
      case 2:
        return { to: GLOBAL.setHref(`category?tid=${v.content_id}`), target};
      case 14:
        return { to: GLOBAL.setHref(`ndetail/${v.content_id}`), target};
      case 17:
        return { to: v.h5_redirect_url, target: '_self' };
      // case 18:
      //   return { to: GLOBAL.setHref(`reading/chapter.29091.1180605`), target}
      case 20:
        return { to: `/mall/page.${v.content_id}`, target}
      default:
        return { to: GLOBAL.setHref(`more/list.${v.content_id}.1`), target }
    }
  },
  replaceHref(reg, ids) {
      let path = typeof window === 'undefined' ? global.pathname : location.pathname;
      const reger = new RegExp(reg+"(.*)");
      const id = ids || '';
      if (reger.test(path))
        return path.replace(reger, reg+id);
      return `${path}/${reg}${id}`
    },
    prettyDate(date) {
    const day = date.substr(0,11);
    const d = new Date(date);
    const current = new Date();
    const deltaSecond = (current.getTime() - d.getTime()) / 1000;
    const yesterday = new Date(current.getTime() - 24 * 60 * 60 * 1000 * 1000);
    const yesterday_date = yesterday.getFullYear()+'-'+(yesterday.getMonth()+1)+'-'+(yesterday.getDate());

    if (yesterday_date === date.substr(0,10) ) {
      return '昨天';
    }

    if (deltaSecond < 15 * 60) {
      return '刚刚';
    }
    if (deltaSecond < 60 * 60) {
      return `${Math.floor(deltaSecond / 60)}分钟前`;
    }
    if (deltaSecond < 24 * 60 * 60) {
      return `${Math.floor(deltaSecond / 60 / 60)}小时前`;
    } else      {
      return day;
    }
  },
};

module.exports = GLOBAL;
