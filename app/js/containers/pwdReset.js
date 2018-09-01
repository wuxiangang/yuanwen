import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';

import mixins from '../modules/mixins';
import storage from '../modules/storage';
import Header from '../components/header'

if (typeof window !== 'undefined') {
  var confirm = require('../modules/confirm');
}

class PwdReset extends React.Component { 
    constructor(props) {
        super(props);
        this.mixins = mixins.bind(this)();
        this.nextPage = this.nextPage.bind(this);
    }
    nextPage() {
        const user = this.refs.user.value;
        let query = '';

        if (!user)  {
            return confirm._alert('手机/邮箱不能为空');
        } else {
            const email = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(user);
            const tel = /^1[34578]\d{9}$/.test(user);
            if (!email && !tel) {
               return confirm._alert('手机/邮箱格式不正确'); 
            } else if (email) {
                query = '?action=email';
             }
        }
        this.mixins.fetchRequest('isRegister', {
            user_name: user,
            type: 'reset'
        }, (res) => {
            storage.set('user', user);
            browserHistory.push(this.mixins.setHref(`reseting${query}`));
        }, (err) => {
            confirm._alert(err.reason);
        });
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
    }
    render() {
        
        return ( < div className='g-body m-reset'>
            <Header title='重置密码' route={this.props.route} />
            <div className='g-scroll g-scroll-common'>
                 <div className="u-login-logo"></div>
                 <section className="u-login-block">
                    <input className="u-input f-border-box" type="text" ref="user" placeholder="请输入手机号/邮箱地址" />
                    <a className="btn u-btn linear-blue u-blue-shadow " onClick={ this.nextPage }>下一步</a>
                </section>
              </div>
              { this.props.children }
            < /div>
        );
    }
}

export default PwdReset