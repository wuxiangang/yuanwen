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

//run dev
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import compression from 'compression';
import webpackConfig from './webpack.config';
//--------------


var app = express();
app.disable('x-powered-by');

//run dev
app.use(compression());
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
//---------------

app.use(express.static(path.join(__dirname, '/client')))

// 语音朗读api
app.get('/baiduClientCredentials', (req, res) => {
  const store = configureStore();
  store.dispatch(fetchList('baidu.RKGTGGGr2DHak0uBVHo7a6nO.fT9ebKBzjjZFn24aCihwM1DuoKRtEsIY')).then((data)=>{
      res.send(data.payload);
  });
});

app.get(/\/feedback|\/login|\/userinfo|\/shelf|\/doreset|\/agreement|\/404|\/category|\/notice|\/search|\/recharge|\/ndetail/, (req, res) => {
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
              }).catch((err) => {});
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
                <meta name="keywords" content="小说,小说网,玄幻小说,武侠小说,都市小说,历史小说,网络小说,言情小说,青春小说,原创网络文学">
                  <meta name="description" content="小说阅读,原文小说网. 原文小说网提供玄幻小说,武侠小说,原创小说,网游小说,都市小说,言情小说,青春小说,历史小说,军事小说,网游小说,科幻小说,恐怖小说,首发小说,最新章节免费">
                <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta http-equiv="pragma" content="no-cache">   
                <meta http-equiv="cache-control" content="no-cache">   
                <meta http-equiv="expires" content="0">
                <link rel="icon" href="/favicon.png" type="image/x-icon">
                <link rel="shortcut icon" href="/favicon.png" type="image/x-icon">
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


var PORT = process.argv[2] || 8080
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
