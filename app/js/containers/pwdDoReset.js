import React from 'react';

import mixins from '../modules/mixins';
import Header from '../components/header'
import Success from '../components/success';

if (typeof window !== 'undefined') {
  require('../../sass/login.scss');
  var POP = require('../modules/confirm');
}

class PwdDoReset extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            success: false,
        }
        this.doReset = this.doReset.bind(this);
        this.mixins = mixins.bind(this)();
    }
    doReset() {
        const user = this.props.location.query.user;
        const sign = this.props.location.query.sign;
        let mobile_num, email;
        if (!user || !sign) return POP._alert('参数错误');
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        const new_password = this.refs.new_password.value;
        const old_password = this.refs.sec_password.value
        if (!new_password) return POP._alert('密码不能为空');
        if (!reg.test(new_password)) return POP._alert('密码格式不正确');
        if (new_password !== old_password) return POP._alert('密码不一致');

        const isemail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(user);
        const istel = /^1[34578]\d{9}$/.test(user);

        if (isemail) email = user;
        if (istel) mobile_num = user;

        this.mixins.fetchRequest('resetpwd', {
            sign,
            user_name: user,
            password: new_password
        },() => {
            this.setState({ success: true });
        },(err) => {
            POP._alert(err.reason);
        });
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.state.success !== nextState.success
    }
    render() {
        let content;
            content = (
                <div className='g-scroll g-scroll-common'>
                 <section className="u-login-block">
                    <div className="u-input-box">
                        <input className="u-input f-border-box" type="password" ref="new_password" placeholder="6-20位英文和数字混合" />
                        <input className="u-input f-border-box" type="password" ref="sec_password" placeholder="密码" />
                    </div>
                    <a className="btn u-btn linear-blue u-blue-shadow " onClick={ this.doReset }>下一步</a>
                </section>
              </div>)

        if (this.state.success) 
            content = <Success type='password' />
        
        return ( < div className='g-body m-login m-reseting'>
            <Header title='重置密码' route={this.props.route} />
              { content }
            < /div>
        );
    }
}

export default PwdDoReset;
module.exports = PwdDoReset;