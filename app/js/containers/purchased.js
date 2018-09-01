import React from 'react';
import mixins from '../modules/mixins';
import Header from '../components/header';
import Loading from '../components/loading';
import NoData from '../components/noData';

var POP;
if (typeof window !== 'undefined') {
  POP = require('../modules/confirm');
}

class Shelf extends React.Component { 
  constructor(props) {
        super(props);
        this.state = {
          data: null,
        }
        this.mixins = mixins.bind(this)();
        this.skipIntroduce = this.skipIntroduce.bind(this);
        this.skipReading = this.skipReading.bind(this);
  }
  skipIntroduce(e) {
    e.stopPropagation();
    const id = e.target.dataset.id;
    this.mixins.skipUrl(`book/introduce.${id}`);
  }
  skipReading(v) {
    this.mixins.skipUrl(`reading/chapter.${ v.content_id }.${ v.chapter_id }`);
  }
  componentDidMount() {
    this.mixins.fetchRequest('purchased', null, (res) => {
      this.setState({ data: res })
    }, (err) => {
      POP._alert(err.reason)
    });
  }
  shouldComponentUpdate(nextProp, nextState) {
    return this.state.data !== nextState.data
    || this.props.children !== nextProp.children
    || this.state.onSet !== nextState.onSet;
  }
  render() {
    let content;
    if (!this.state.data) {
      content = <Loading />
    } else {
      if (!this.state.data.content.length) 
        content = <NoData type='emptyPurchase' />
      else 
        content = (<section className="g-scroll g-scroll-common">
          <div className='u-shelf-title'>共<a>{ this.state.data.total }</a>本 </div>
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
        <Header title={'已购'} route={this.props.route} />
          { content }
          { this.props.children }
      </div>
    );
  }
}
export default Shelf;
module.exports = Shelf;
