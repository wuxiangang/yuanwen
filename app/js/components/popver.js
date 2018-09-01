import React from 'react';
import Link from 'react-router/lib/Link';
import browserHistory from 'react-router/lib/browserHistory';

class Popver extends React.Component { 
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    let content;
    switch(this.props.type) {
      case 'recharge':
          content = (
              <div className="m-popver">
                <div className="u-header recharge"></div>
                <div className="f-flow-hidden">
                  <a className="btn u-btn linear-blue" onClick={this.props.btn_success}>已完成充值</a>
                  <a className="btn u-btn ui-blue-light " onClick={this.props.btn_success}>取消支付</a>
                </div>
                <p className="zx">如遇充值问题请加读者交流qq群咨询559844556</p>
                <a className="iconfont icon-cuowu" onClick={this.props.cancel}></a>
              </div>
            )
          break;
      default: 
          content = (
            <div className="m-popver">
              <div className="u-header"></div>
              <div className="u-text-line">您已经阅读到小说的付费章节，作者需要您的支持，请订购后阅读哦</div>
              <p className="u-text-order">订购本章</p>
              <a className="btn u-btn linear-blue" onClick={this.props.btn_success}>{this.props.fee}原文币</a>
              <a className="iconfont icon-cuowu" onClick={this.props.cancel}></a>
            </div>
            )
    }

    return (
      <div className='m-pop-wrapper'>
        { content }
      </div>
    );
  }
}

module.exports = Popver;
