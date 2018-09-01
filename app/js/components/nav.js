import React from 'react';
import Link from 'react-router/lib/Link';
import browserHistory from 'react-router/lib/browserHistory';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import Callback from '../modules/callback';
import storage from '../modules/storage';

class Nav extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            show_menu: false,
            login: false,
            activated: true
        }
        this.toggleNav = this.toggleNav.bind(this);
        this.skipLogin = this.skipLogin.bind(this);
        this.goto = this.goto.bind(this);
        this.mixins = mixins.bind(this)();
        this.gotoActive = this.gotoActive.bind(this);
        this.closeNav = this.closeNav.bind(this);
    }
    componentDidMount() {
        this.user = storage.get('yw_user');
        if (this.mixins.isLogin()) this.setState({ login: true, activated: this.user.activated});
    }
    toggleNav() {
        this.setState({ show_menu: !this.state.show_menu });
    }
    closeNav() {
        this.setState({ show_menu: false });
    }
    goto(path) {
        if (!this.mixins.isLogin()) {
            this.skipLogin(GLOBAL.setHref(path));
        } else {
            this.mixins.skipUrl(path);
        }
    }
    skipLogin(path) {
        Callback.setCallback('login', () => {
            this.user = storage.get('yw_user');
            this.setState({ login: true, activated: this.user.activated });
            if (path) browserHistory.push(path);
        }, true);
        browserHistory.push('/login');
    }
    gotoActive(){
        storage.set('user', this.user.email);
        browserHistory.push(GLOBAL.setHref("reseting?action=email&status=activate"))
    }
    render(){
        const  pagelist = [{
            name: '首页',
            pgid: 1
        },{
            name: '新书',
            pgid: 2
        },{
            name: '排行',
            pgid: 3
        },{
            name: '男生',
            pgid: 4
        },{
            name: '女生',
            pgid: 5
        },{
            name: '书库',
            pgid: 6
        }];

        let btn = !this.state.login ?<a onClick={this.skipLogin} className="btn">注册 / 登录</a> :
                    <Link to={GLOBAL.setHref("userinfo")} className="btn">账户设置</Link>;
        if (!this.state.activated) btn = <a onClick={this.gotoActive} className="btn">激活账号</a>;
        return (
            <header style={{paddingTop: '5rem'}}>
                <section className="m-top linear-blue">
                    <a className='logo' href="/"></a>
                    <div className='u-icon-r'>
                        <Link className='iconfont icon-sousuo' to={ GLOBAL.setHref('search') } onClick={this.closeNav}></Link>
                        <a className={ 'menu' + (this.state.show_menu ? ' active' : '') }  onClick={this.toggleNav}></a>
                    </div>
                </section>
                <section className={ "menu-list linear-blue u-box-shadow" + (this.state.show_menu ? ' active' : '') }>
                    <div className="flex-box">
                        <a onClick={this.goto.bind(this, 'shelf')}  className="flex">
                            <i className="i-shelf"></i>
                            <p>书架</p>
                        </a>
                        <a onClick={this.goto.bind(this, 'recharge')}  className="flex">
                            <i className="i-charge"></i>
                            <p>充值</p>
                        </a>
                        <Link to={GLOBAL.setHref('notice')}  className="flex">
                            <i className="i-notice"></i>
                            <p>公告</p>
                        </Link>
                    </div>
                    { btn }
                </section>
                <ul className="m-nav flex-box">
                    {
                        pagelist.map((v,i) => {
                            return (
                                <li key={i} className='flex'>
                                    <Link to={ `/mall/page.${v.pgid}` } key={i}  activeClassName="active">
                                        { v.name }
                                    </Link>
                                </li>
                                )
                        })
                    }
                </ul>
                <section className={'wrapper' + (!this.state.show_menu ? ' f-hide' : '') } onClick={this.closeNav}>
                </section>
            </header>
            )
    }
}

export default Nav;