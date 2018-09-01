const Callback = {
  callback: {},
  setCallback(page, func, type) {
    this.callback[page] = {
      func,
      type
    };
  },
  execCallback(page, keep) {
    const data = this.callback[page];
    return new Promise((resolve, reject) => {
    if (data) {
        try {
            // setTimeout(()=>{
              data.func();
              resolve(data.type);
            // }, 0);
        } catch (e) {
          reject('error')
        }
      if (!keep) {
        this.callback[page] = null;
      }
    } else {
      resolve();
    }
   })
  }
};

module.exports = Callback;
