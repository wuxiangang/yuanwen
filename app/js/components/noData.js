import React from 'react';
import Link from 'react-router/lib/Link';
import browserHistory from 'react-router/lib/browserHistory';

class NoData extends React.Component { 
  constructor(props) {
    super(props);
    this.reload = this.reload.bind(this);
  }
  reload() {
    document.location.reload();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    let cls;
    let text = '抱歉!没有找到相关数据..';
    let btn = <Link className="u-btn linear-blue u-blue-shadow" to="/mall">去书城逛逛</Link>;
    switch (this.props.type) {
      case 'emptyShelf':
        cls = 'empty-shelf';
        text = (<div>
          <p>书架上还没有书</p>
          <p>把喜欢的书加入书架可以随时阅读、追更哦</p>
          </div>
          )
        btn = null;
        break;
      case 'UFO':
        cls = 'empty-ufo';
        text = '网络遇到问题,请重试';
        btn = <a className="u-btn linear-blue u-blue-shadow" onClick={this.reload}>重新加载</a>;
        break;
      case 'recentRead':
        text = '暂无阅读记录';
        break;
      case 'emptyPurchase':
        cls = 'empty-purchase'
        text = '暂无订购记录';
        btn = null;
        break;
      case 'emptyDetail':
        cls = 'empty-detail'
        text = '暂无充值或消费记录';
        btn = null;
        break;
      case 'emptySearch':
        cls = 'empty-search';
        text = '没有找到符合条件的书';
        btn = null;
        break;
     case 'emptySearchlist':
        text = '暂无搜索记录';
        btn=null;
        break;
      case 'emptyData':
        text = '抱歉!没有找到相关数据..';
        btn=null;
        break;
      case 'emptyBook':
        text = '该书不存在';
        btn=null;
        break;
      default:
        break;
    }

    return (
      <div className={`f-vl-md ${cls}`}>
        <div className="m-noData f-tc">
          <div className={`icon-img ${cls}`}></div>
          <i className="tip">{text}</i>
          {btn}
        </div>
      </div>
    );
  }
}

module.exports = NoData;
