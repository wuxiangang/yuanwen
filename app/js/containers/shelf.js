import React from 'react';
import mixins from '../modules/mixins';
import Header from '../components/header';
import Loading from '../components/loading';
import NoData from '../components/noData';
import { connect } from 'react-redux'

var POP;
if (typeof window !== 'undefined') {
  POP = require('../modules/confirm');
}

class Shelf extends React.Component { 
  constructor(props) {
        super(props);
        this.state = {
          data: null,
          onSet: false
        }
        this.mixins = mixins.bind(this)();
        this.setting = this.setting.bind(this);
        this.skipIntroduce = this.skipIntroduce.bind(this);
        this.skipReading = this.skipReading.bind(this);
        this.deleteShelf = this.deleteShelf.bind(this);
        this.getShelf = this.getShelf.bind(this);
  }
  setting() {
    this.setState({ onSet: !this.state.onSet });
  }
  skipIntroduce(e) {
     if ( this.state.onSet ) return;
    e.stopPropagation();
    const id = e.target.dataset.id;
    this.mixins.skipUrl(`book/introduce.${id}`);
  }
  deleteShelf(v) {
    this.mixins.fetchRequest('deleteshelf', { book_id: v.content_id }, (res) => {
      const data = JSON.parse(JSON.stringify(this.state.data));
      const i = this.state.data.content.indexOf(v);
      data.content.splice(i, true);
      data.total--;
      this.props.dispatch(this.mixins.addShelf(`introduce.${v.content_id}` ,0));
      this.setState({ data: data })
    }, (err) => {
      POP._alert(err.reason)
    });
    // deleteshelf
  }
  skipReading(v) {
    if ( this.state.onSet ) return;
    this.mixins.skipUrl(`reading/chapter.${ v.content_id }.${ v.chapter_id }`);
  }
  getShelf() {
      this.mixins.fetchRequest('shelf', null, (res) => {
      this.setState({ data: res })
    }, (err) => {
      POP._alert(err.reason)
    });
  }
  componentDidMount() {
    if (!this.mixins.isLogin()) {
      this.mixins.skipUrl('login');
      return;
    }
    this.mixins.isRouter() && this.getShelf();
  }
  componentDidUpdate() {
    if (this.mixins.isRouter() && !this.state.data) this.getShelf();
  }
  shouldComponentUpdate(nextProp, nextState) {
    return this.state.data !== nextState.data
    || this.props.children !== nextProp.children
    || this.state.onSet !== nextState.onSet;
  }
  render() {
    let content;
    const right = <a className="f-fr u-font-btn" onClick={this.mixins.skipUrl.bind(this,'purchased')}>已购</a>
    if (!this.state.data) {
      content = <Loading />
    } else {
      if (!this.state.data.content.length) 
        content = <NoData type='emptyShelf' />
      else 
        content = (<section className="g-scroll g-scroll-common m-shelf">
          <div className='u-shelf-title'>共<a>{ this.state.data.total }</a>本 <a className="f-fr" onClick={this.setting}>{ this.state.onSet ? '完成' : '管理' }</a></div>
        {
          this.state.data.content.map((v,i) => {
            const btn = this.state.onSet ? <a className="btn u-btn-delete" onClick={ this.deleteShelf.bind(this, v) }>删除</a> : null;
            return <a className='u-shelf-line' key={ i } onClick={ this.skipReading.bind(this, v) }>
              <img src={ v.image_url } />
              <div>
                <p className="title">{ v.content_name }</p>
                <p  className="detail" onClick={ this.skipIntroduce } data-id={ v.content_id }>详情</p>
                { btn }
              </div>
            </a>
          })
        }
          </section>);
    }
    return (
      <div className="g-body">
        <Header title={'我的书架'} route={this.props.route} right={right} />
          { content }
          { this.props.children }
      </div>
    );
  }
}
export default connect()(Shelf);
module.exports = connect()(Shelf);
