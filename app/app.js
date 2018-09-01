import React from 'react'
import { render } from 'react-dom';
import { Router, Route, browserHistory} from 'react-router'
import routes from './js/router'
import './sass/reset.scss'
import './sass/common.scss'
import { Provider } from 'react-redux'
import configureStore from './js/state/store';
import GLOBAL from './js/modules/global';

const store = configureStore(window.__PRELOADED_STATE__);
if (!GLOBAL.cookie('yw_uuid')) GLOBAL.cookie('yw_uuid', new Date().getTime());

render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory}/>
	</Provider>, 
	document.getElementById('appContainer')
);