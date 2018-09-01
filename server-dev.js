import express from 'express'
import path from 'path'
import React from 'react'
import { match } from 'react-router'
import { renderToString } from 'react-dom/server'
import { RouterContext } from 'react-router'
import routes from './app/js/router'
import { Provider } from 'react-redux';

//for server rendering
import GLOBAL from './app/js/modules/global';
import configureStore from './app/js/state/store';
import { fetchList } from './app/js/state/actions/index'
import compression from 'compression';

var app = express();
app.disable('x-powered-by');
app.use(compression());

app.use(express.static(path.join(__dirname, '/client')))

// 语音朗读api
app.get('/baiduClientCredentials', (req, res) => {
  const store = configureStore();
  store.dispatch(fetchList('baidu.RKGTGGGr2DHak0uBVHo7a6nO.fT9ebKBzjjZFn24aCihwM1DuoKRtEsIY')).then((data)=>{
      res.send(data.payload);
  });
});

app.get(/\/feedback|\/login|\/userinfo|\/shelf|\/doreset|\/agreement|\/404|\/category|\/notice|\/search|\/recharge/, (req, res) => {
  res.send(renderFullPage('', {}));
});

app.get('*', function (req, res) {	
	match({ routes, location: req.url }, (err, redirect, props) => {
            if (err) {
              res.status(500).send(err.message);
            } else if (redirect) {
              res.redirect(redirect.pathname + redirect.search);
            } else if (props) {
              res.setHeader('Cache-Control', 'private,no-cache');

              /*server*/
              global.cookie = GLOBAL.setCookie(req.headers.cookie);
              global.userAgent = req.headers['user-agent'];
              global.pathname = req.url.replace(/\?.*$/, ''); 

              const store = configureStore();
              //const state = store.getState();

              const path = req.url.replace(/\?.*$/, '').replace(/^\//, '').replace(/\/$/, '').split('/');
              let param = path[path.length - 1];
              let queue = [store.dispatch(fetchList(param))];

              Promise.all(queue).then((m)=>{

                //地址不存在时候处理
                if(!m[0])  { res.redirect('/'); return; }

                const appHtml = renderToString(
                  <Provider store={store}>
                    <RouterContext {...props} />
                  </Provider>);
                res.send(renderFullPage(appHtml, store.getState()));
              });
            } else {
              res.status(404).send('Not Found');
            }
    })
})


var renderFullPage = (html, preloadedState)=>{
    return `
    <!doctype html>
        <html lang="utf-8">
            <head>
                <title>原文小说网</title>
                <meta name="keywords" content="">
                <meta name="description" content="">
                <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta http-equiv="pragma" content="no-cache">   
                <meta http-equiv="cache-control" content="no-cache">   
                <meta http-equiv="expires" content="0">
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
                <link href="/p/style.css" rel="stylesheet" type="text/css"></link>
                <link href="//at.alicdn.com/t/font_210794_gi9igagscreh4cxr.css" rel="stylesheet" type="text/css"></link>
            </head>
            <body>
                <section id="appContainer" >${html}</section>
                <script>
                  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
                </script>
                <script src="/p/bundle.js"></script>
            </body>
        </html>
    `
};


var PORT = process.argv[2] || 80
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
