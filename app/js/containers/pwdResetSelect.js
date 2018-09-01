import React from 'react';

import mixins from '../modules/mixins';
import storage from '../modules/storage';
import Header from '../components/header'
import Success from '../components/success';

if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
}


class PwdReset extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            timing: true,
            sec: 59,
            success: false,
            user: null
        }
        this.timeRelease = this.timeRelease.bind(this);
        this.emailSkip = this.emailSkip.bind(this);
        this.doReset = this.doReset.bind(this);
        this.getCode = this.getCode.bind(this);
        this.mixins = mixins.bind(this)();
    }
    timeRelease(){
        clearInterval(this.time);
        this.time = setInterval(() => {
            const t = this.state.sec - 1;
            if ( t <= 0 ) {
                this.setState({ sec: 59, timing: false });
                clearInterval(this.time);
                return;
            }
            this.setState({ sec: t })
        },1000);
    }
    getCode(){
         this.mixins.fetchRequest('code',{
            user_name: this.forget_name,
            type: 'reset'
        },() => {
            this.setState({timing: true})
            this.timeRelease();
            this.gettingcode = true;
        }, (err) => {
            POP._alert(err.reason);
        })
    }
    emailSkip() {
        const backLink = this.state.user.split('@')[1];
        location.href = 'http://mail.'+backLink;
    }
    doReset() {
        // if (!this.gettingcode) return POP._alert('请获取验证码');
        if (!this.refs.code.value) return POP._alert('请输入验证码');
        this.mixins.go(`/doreset?user=${this.forget_name}&sign=${this.refs.code.value}`)
    }
    componentDidMount() {
        if (this.props.location.query.status === 'activate') {
            this.forget_name = storage.get('yw_user').email;
        } else  this.forget_name = storage.get('user', 'string');

        if (!this.forget_name) {
            this.mixins.goBack();
            return;
        }
        //if (this.props.location.query.action !== 'email') {
            this.getCode();
        //}
        this.setState({ user: this.forget_name });
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.state.timing !== nextState.timing
        || this.state.sec !== nextState.sec
        || this.state.user !== nextState.user
        || this.state.success !== nextState.success
    }
    render() {
        let content;
        if (this.props.location.query.action === 'email') {
            content = (<div className="u-email-text">
                <p>重置密码邮件已发送至</p>
                <a className="u-email-link" onClick={this.emailSkip}>{this.state.user}</a>
                <p className="u-email-sfont">请点击邮箱中的链接继续</p>
                </div>)
        } else {
            content = (
                <div className='g-scroll g-scroll-common'>
                 <section className="u-login-block">
                    <div className="u-input-box">
                        <input className="u-input f-border-box" type="text" ref="code" placeholder="请输入验证码" />
                        <a className={'btn u-btn-s linear-blue' + (!this.state.timing ? '' : ' f-hide') } onClick={ this.getCode}>获取验证码</a>
                        <a className={'btn u-btn-s time' + (this.state.timing ? '' : ' f-hide')}>重新获取({this.state.sec})</a>
                    </div>
                    <a className="btn u-btn linear-blue u-blue-shadow " onClick={ this.doReset }>下一步</a>
                </section>
              </div>)
        }

        if (this.state.success) 
            content = <Success type='' />
        
        return ( < div className='g-body m-reseting'>
            <Header title='重置密码' route={this.props.route} />
              { content }
              { this.props.children }
            < /div>
        );
    }
}

export default PwdReset