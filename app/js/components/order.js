import React from 'react';
import Link from 'react-router/lib/Link';
import browserHistory from 'react-router/lib/browserHistory';

import Header from './header'
import Popver from './popver'
import GLOBAL from '../modules/global';

if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
}

class Order extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
        this.doPay = this.doPay.bind(this);
        this.gotoRecharge = this.gotoRecharge.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
        this.didRecharge = this.didRecharge.bind(this);
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.data !== nextProp.data 
        || this.state.show !== nextState.show;
    }
    didRecharge() {
        this.toggleShow();
        this.props.didRecharge();
    }
    toggleShow() {
        this.setState({ show: !this.state.show });
    }
    gotoRecharge() {
        this.setState({ show: true });
        browserHistory.push(GLOBAL.setHref('recharge'));
    }
    doPay() {
        const { fee, balance } = this.props.data;
        if (balance < fee) return POP._alert('余额不足');
        this.props.didRecharge();
    }
    render() {

        const pop = this.state.show ? <Popver type="recharge" btn_success={this.didRecharge} cancel={this.toggleShow}  /> : null;
        const { chapter_name, book_name, fee, balance } = this.props.data;
        return ( < div className="m-order">
            <Header title='确认订购' route={this.props.route} />
            <section className="m-order-block">
                <div className="u-order-text">
                    <div className="u-title">《{ book_name }》</div>
                    <p className="u-chapter">{ chapter_name }</p>
                    <div className="u-pay">
                        <span>支付成功后将自动续订</span>
                        <span>{ fee }原文币</span>
                        <span>需支付</span>
                    </div>
                </div>
                <div className="u-order-fee">
                    <span>余额</span>
                    <span className="fee">{ balance }原文币</span>
                    <a className="btn ui-blue-light" onClick={this.gotoRecharge}>去充值</a>
                </div>
                <a className="btn u-btn linear-blue u-blue-shadow" onClick={ this.doPay }>确定</a>
            </section>
            { pop }
        < /div>
        );
    }
}

export default Order;