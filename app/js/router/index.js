import React from 'react'
import {Route, IndexRoute, WithRoute, IndexRedirect, RouterContext, Redirect} from 'react-router';

import App from '../components/app'
import Mall from '../containers/mall'
import Introduce from '../containers/introduce'
import Reading from '../containers/reading'
import List from '../containers/list'
import Catalogue from '../containers/catalogue'
import PwdReset from '../containers/pwdReset'
import PwdResetSelect from '../containers/pwdResetSelect'
import Search from '../containers/search'

function getLogin(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/login'));
  });
}

function getAgreement(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/agreement'));
  });
}

function getReset(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/pwdDoReset'));
  });
}

function getFeedback(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/feedback'));
  });
}

function getShelf(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/shelf'));
  });
}

function getUserInfo(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/userInfo'));
  });
}

function getPurchased(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/purchased'));
  });
}

function getEditName(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/editUserame'));
  });
}

function getNotFound(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/404'));
  });
}

function getCategory(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/category'));
  });
}

function getNotice(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/notice'));
  });
}
function getNoticeDetail(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/notice_detail'));
  });
}

function getRecharge(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/recharge'));
  });
}

function getDetail(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/detail'));
  });
}


function getNotice1(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/notice_1'));
  });
}

function getNotice2(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/notice_2'));
  });
}

function getNotice3(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../containers/notice_3'));
  });
}

const LoginWrap = (
	<Route path="login" getComponent={getLogin}>
		<Route path="reset" component={PwdReset}>
			<Route path="reseting" component={PwdResetSelect} />
		</Route>
		<Route path="agreement" getComponent={getAgreement} />
	</Route>
	)

const readingWrap = (
	<Route path="reading/:chapterId" component={Reading}>
		{ LoginWrap }
		<Route path="recharge" getComponent={getRecharge}>
			<Route path="detail" getComponent={getDetail}/>
		</Route>
	</Route>
	)



const CatalogueWrap = (
	<Route path="menu/:cataId" component={Catalogue}>
		{ readingWrap }
	</Route>
	)

const IntroduceWrap = (
	<Route path="book/:introId" component={Introduce}>
		<Route path="user/:authorId" component={List} />
		{ CatalogueWrap }
		{ LoginWrap }
		{ readingWrap }
	</Route>
	)

const ShelfWrap = (
	<Route path="shelf" getComponent={getShelf}>
		<Route path="purchased" getComponent={getPurchased}>
			{ IntroduceWrap }
			{ readingWrap }
		</Route>
		{ IntroduceWrap }
		{ LoginWrap }
		{ readingWrap }
	</Route>
	)

const ListWrap = (
	<Route path="more/:listId" component={List}>
		{ IntroduceWrap }
		{ ShelfWrap }
	</Route>
	)

const CategoryWrap = (
	<Route path="category" getComponent={getCategory}>
		{ ShelfWrap }
		{ IntroduceWrap }
	</Route>)

module.exports = (
	<Route path="/" component={App}>
		<IndexRedirect to="/mall/page.1" />
		<Route path="/mall(/:page)" component={Mall}>
			<Route path="reseting" component={PwdResetSelect} />
			<Route path="ndetail/:noticeId" getComponent={getNoticeDetail} />
			{ IntroduceWrap }
			{ ListWrap }
			<Route path="notice" getComponent={getNotice} >
				<Route path="ndetail/:noticeId" getComponent={getNoticeDetail} />
			</Route>
			<Route path="recharge" getComponent={getRecharge}>
				<Route path="detail" getComponent={getDetail}/>
			</Route>
			<Route path="userinfo" getComponent={getUserInfo}>
				<Route path="editname" getComponent={getEditName} />
			</Route>
			<Route path="search" component={Search}>
				{ CategoryWrap }
			</Route>
			{ CategoryWrap }
			{ readingWrap }
			{ ShelfWrap }
		</Route>
		<Route path="feedback" getComponent={getFeedback} />
		<Route path="doreset" getComponent={getReset} />
		{ LoginWrap }
		{ CategoryWrap }
		<Route path='/404' getComponent={getNotFound} />
		<Route path="notice1" getComponent={getNotice1} />
		<Route path="notice2" getComponent={getNotice2} />
		<Route path="notice3" getComponent={getNotice3} />
        	<Redirect from='*' to='/404' />
	</Route>
)

