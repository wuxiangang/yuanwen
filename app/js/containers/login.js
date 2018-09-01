import React from 'react';
import Link from 'react-router/lib/Link';
import browserHistory from 'react-router/lib/browserHistory';

import mixins from '../modules/mixins';
import Callback from '../modules/callback';
import GLOBAL from '../modules/global';
import Header from '../components/header';
import Success from '../components/success';
import storage from '../modules/storage';

if (typeof window !== 'undefined') {
  require('../../sass/login.scss');
  var confirm = require('../modules/confirm');
}

class Login extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            status: false,
            timing: false,
            sec: 59, 
            register_success: false
        }
        this.mixins = mixins.bind(this)();
        this.toggleBlock = this.toggleBlock.bind(this);
        this.getCode = this.getCode.bind(this);
        this.doRegister = this.doRegister.bind(this);
        this.goback = this.goback.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }
    goback() {
        try {
            this.mixins.goBack();
        }catch(e){
            browserHistory.goBack()
        }
    }
    toggleBlock() {
        if (this.state.status)
            this.refs.r_num.value = this.refs.r_code.value = this.refs.r_password.value = ''
        else
            this.refs.password.value = this.refs.user.value = '';
        this.setState( {
            status: !this.state.status
        } );
    }
    getCode() {
        const user_name = this.refs.r_num.value;
        if (!user_name) { return confirm._alert('请输入手机号码'); }
        if (!/^1[34578]\d{9}$/.test(user_name)) {return confirm._alert('手机号码错误');}
        this.mixins.fetchRequest('code',{
            user_name,
            type: 'register'
        },() => {
            this.setState({ timing: true });
            const time = setInterval(() => {
                const t = this.state.sec - 1;
                if ( t <= 0 ) {
                    this.setState({ sec: 59, timing: false });
                    clearInterval(time);
                    return;
                }
                this.setState({ sec: t })
            },1000);
        }, (err) => {
            confirm._alert(err.reason);
        })
    }
    doLogin() {
        const user_name = this.refs.user.value;
        const password = this.refs.password.value;

        if (!user_name) { return confirm._alert('用户名不能为空'); }
        if (!password) { return confirm._alert('密码不能为空'); }

        this.mixins.fetchRequest('login', {
            user_name,
            password
        }, (res) => {
            GLOBAL.cookie('token', res.token, { expires: 6 });
            storage.set('yw_user', res.content);
            Callback.execCallback('login').then((type)=>{
                if (type) return;
                location.href = this.mixins.getFrontPath() || '/';
            });
        }, (error) => {
            confirm._alert(error.reason);
        });
    }
    componentWillUnmount() {
        delete Callback.callback['login'];
    }
    doRegister() {
        const mobile_num = this.refs.r_num.value;
        const password = this.refs.r_password.value;
        const code = this.refs.r_code.value;

        if (!mobile_num) { return confirm._alert('请输入手机号码'); }
        if (!/^1[34578]\d{9}$/.test(mobile_num)) {return confirm._alert('号码格式不正确');}
        if (!code ) { return confirm._alert('请输入验证码'); }
        if (!password) { return confirm._alert('请设置密码'); }
        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(password)) return confirm._alert('请输入6-20位英文和数字混合的密码'); 

        this.mixins.fetchRequest('register', {
            mobile_num,
            sign: code,
            password
        }, (res) => {
            GLOBAL.cookie('token', res.token, { expires: 6 });
            storage.set('yw_user', res.content);
            this.setState({ register_success: true });
        }, (error) => {
            confirm._alert(error.reason);
        });
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.state.status !== nextState.status
        || this.state.timing !== nextState.timing
        || this.state.sec !== nextState.sec
        || this.state.register_success !== nextState.register_success
        || this.props.children !== nextProp.children
    }
    render() {
        let content, success;
        if (this.state.status) {
            content = ( 
             <section className='u-register-block' >
                    <input className="u-input f-border-box" type="text" ref="r_num"  placeholder="手机号" />
                    <div className="u-input-box">
                        <input className="u-input f-border-box" type="text" ref="r_code" placeholder="验证码" />
                        <a className={'btn u-btn-s linear-blue' + (!this.state.timing ? '' : ' f-hide') } onClick={ this.getCode}>获取验证码</a>
                        <a className={'btn u-btn-s time' + (this.state.timing ? '' : ' f-hide')}>重新获取({this.state.sec})</a>
                    </div>
                    <input className="u-input f-border-box" type="password" ref="r_password" placeholder="密码" />
                    <a className="btn u-btn linear-blue u-blue-shadow " onClick={ this.doRegister }>注册</a>
                    <p>我已阅读并同意<Link to={GLOBAL.setHref('agreement')}>《用户服务协议》</Link></p>
                </section>)
        } else {
            content = (
                                <section className="u-login-block">
                    <input className="u-input f-border-box" type="text" ref="user" placeholder="邮箱/手机号/用户名" />
                    <div className="u-input-box">
                        <input className="u-input f-border-box" type="password" ref="password" placeholder="密码" />
                        <Link to={this.mixins.setHref('reset')} className='btn'>忘记密码</Link>
                    </div>
                    <a className="btn u-btn linear-blue u-blue-shadow " onClick={ this.doLogin }>登录</a>
                </section>)
        }

        if (this.state.register_success)
            success = (<div className='g-scroll'>
                <Header title='注册' route={this.props.route}  />
                <Success />
            </div>);
        
        return ( < div className='g-body m-login'>
            <div className={'g-scroll' + (!this.state.register_success ? '' : ' f-hide')}>
                <section className="u-login-header">
                    <div className="u-back"><span className="iconfont icon-left f-fl" onClick={this.goback}></span></div>
                    <div className="u-login-logo"></div>
                    <div className="u-login-btn">
                        <a className={ !this.state.status ? 'active' : '' } onClick={ this.toggleBlock.bind(this, 0) }>登录</a>
                        <a className={ this.state.status ? 'active' : '' } onClick={ this.toggleBlock.bind(this, 1) }>注册</a>
                    </div>
                </section>
                { content }
              < /div>
                {success}
                { this.props.children }
            < /div>
        );
    }
}
export default Login;
//ensure 
module.exports = Login;