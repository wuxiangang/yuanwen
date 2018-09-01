import React from 'react';

import mixins from '../modules/mixins';
import Header from '../components/header'
import NoData from '../components/noData'
import Loading from '../components/loading'
import POP from '../modules/confirm';

class Recharge extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            active: 0,
            loading: false,
            form: null
        }
        this.mixins = mixins.bind(this)();
        this.setActive = this.setActive.bind(this);
        this.getData = this.getData.bind(this);
        this.doPay = this.doPay.bind(this);
    }
    setActive(i) {
        this.setState({ active: i });
    }
    getData() {
        if (this.mixins.isRouter())
            this.mixins.fetchRequest('balance', {}, (res) => {
                this.setState({ data: res })
            }, (err) => {
                POP._alert(err.reason);
            });
    }
    doPay() {
        const productId = this.state.data.content.product_list[this.state.active].productId;
        const callback = location.href;
        this.setState({ loading: true });
         this.mixins.fetchRequest('pay_zfb', { productId, callback }, (res) => {
               this.setState({ loading: false, form: res.content });
               setTimeout(() => {
                    document.forms[0].submit();
               }, 500)
         }, (err) => {
            this.setState({ loading: false });
            POP._alert(err.reason);
         });
    }
    componentDidMount() {
        this.getData();
    }
    componentDidUpdate() {
        if (!this.state.data) this.getData();
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.state.data !== nextState.data
        || this.state.active !== nextState.active
        || this.state.loading !== nextState.loading
        || this.state.form !== nextState.form
        || this.props.children !== nextProp.children;
     }
    render() {
        const right = <a className="f-fr u-font-btn" onClick={this.mixins.skipUrl.bind(this, 'detail')}>明细</a>
        let content, loading;
        if (!this.state.data) content = <Loading />
        else {
            if (this.state.data.code === 200) {
                if (this.state.loading) loading = <Loading />;
                const data = this.state.data.content;
                content = (<div>
                        { loading }
                        <section>
                        <div className="u-fee">
                            <span>余额</span> 
                            <span className="f-fr"><i>{ data.balance }</i>原文币</span>
                        </div>
                        <div className="u-list">
                            <h3>充值额度</h3>
                            <ul>
                                {
                                    data.product_list.map((v, i) => {
                                        return (
                                            <li className={'f-border-box' + (this.state.active === i ? ' active' : '')} onClick={this.setActive.bind(this, i)}>
                                                <p>{ v.productPrice }币</p>
                                                <p>￥{ v.fee.toFixed(2) }</p>
                                            </li>
                                            )
                                    })
                                }
                            </ul>
                            <a className="btn u-btn linear-blue u-blue-shadow" onClick={this.doPay}>支付宝充值</a>
                            <p className="u-notice-text">如遇充值问题请加读者交流群咨询</p>
                        </div>
                    </section>
                    <div className="m-feedback-bottom">
                        <div>
                            <span className="iconfont icon-xiangqing-qunzhuangtai"></span>
                            <span>读者交流群  559844556</span>
                            <a href="https://jq.qq.com/?_wv=1027&k=43tSfs3" target="_blank">去加入</a>
                        </div>
                    </div>
                    </div>)
                }  else {
                    content = <NoData type="UFO" />
                }
        }

        if (this.state.form) content = (
            <div dangerouslySetInnerHTML={{ __html: this.state.form }} >
            </div>
            )


        return ( < div className='g-body m-recharge'>
            <Header title='充值中心' route={this.props.route}  right={right} />
            <div className='g-scroll g-scroll-common'>
                { content }
              < /div>
                            { this.props.children } 
            < /div>
        );
    }
}

export default Recharge;
//ensure 
module.exports = Recharge;