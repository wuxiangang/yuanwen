import React from 'react';

import mixins from '../modules/mixins';
import Header from '../components/header';
import NoData from '../components/noData'
import Loading from '../components/loading'
import List from '../components/list'

class Category extends React.Component { 
    constructor(props) {
        super(props);
        this.mixins = mixins.bind(this)();
        this.page = 1;
        this.state = {
          data: null,
          noMore: false,
          code: null,
          end: 0,
          word: 0,
          updatetime: 0,
          name: '原文小说'
        }
        this.getAsynData = this.getAsynData.bind(this);
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.state.data !== nextState.data
        || this.state.end !== nextState.end
        || this.state.word !== nextState.word
        || this.state.updatetime !== nextState.updatetime
        || this.state.noMore !== nextState.noMore;
    }
    setCondition(type, id) {
      this.onselecting = true;
      switch(type) {
        case 'end': 
          this.setState({ end: id });
          break;
        case 'word': 
          this.setState({ word: id });
          break;
        default:
          this.setState({ updatetime: id });
      }
      this.setState({ noMore: false, data: null });
      this.page = 1;
      setTimeout(() => {
         this.getAsynData();
         this.onselecting = false;
      });
    }
    getAsynData() {
      if (this.Asyning || this.state.noMore) return;
      const  { tid, name } = this.props.location.query;
      let param = {
        tid,
        name,
        pages: this.page,
        wid: this.state.end,
        fsid: this.state.word,
        uid: this.state.updatetime
      };
      this.Asyning = true;

      this.mixins.fetchRequest('category', param, (res) => {
        this.page++;
        if (res.content.length < 20) this.setState({ noMore: true });
        this.setState({ data: !this.state.data ? res.content :  this.state.data.concat(res.content), name: res.name });
        this.Asyning = false;
      },(err) => {
        if (!this.state.data) this.setState({ code: err.code })
        this.Asyning = false;
      });
    }
    componentDidMount() {
      this.mixins.isRouter() && this.getAsynData();
    }
    componentDidUpdate() {
       if (this.mixins.isRouter() && !this.state.data && !this.onselecting) this.getAsynData();
       this.refs.container && this.mixins.lazyLoad(this.refs.container);
    }
    render() {
        let content,data = this.state.data, loading, len;
        if (data) {
          len = data.length;
          if ( !len ) content = <NoData type='emptySearch' />
          else {
           content = <List data={data} />
           loading = (this.state.noMore || len < 20) ? null : <Loading type='relative' />;
          }
        } else {
          content = <Loading type='blocker' />
        }

        if (this.state.code) content = <NoData type={this.state.code == 402 ? 'UFO' : 'emptyData'} />
        
        return ( < div className='g-body m-list'>
            <Header title={ this.state.name } route={this.props.route}  />
            <div className='g-scroll g-scroll-common' onScroll={ this.mixins.scrollHandle } ref="container">
              <section className="u-category-box">
                <p>是否完结</p>
                <div>
                {
                  ['不限', '连载', '完结'].map((v, i) => {
                    return <span key = {i} onClick={ this.setCondition.bind(this, 'end', i) } className={this.state.end === i ? 'active' : ''}>{ v }</span>
                  })
                }
                </div>
                <p>作品字数</p>
                <div>
                {
                  ['不限', '30万字以下', '30-50万字', '50-100万字', '100万字以上'].map((v, i) => {
                    return <span key = {i} onClick={ this.setCondition.bind(this, 'word', i) } className={this.state.word === i ? 'active' : ''}>{ v }</span>
                  })
                }
                </div>
                <p>更新时间</p>
                <div>
                {
                  ['不限', '三天内', '一周内', '半月内', '一月内'].map((v, i) => {
                    return <span key = {i} onClick={ this.setCondition.bind(this, 'updatetime', i) } className={this.state.updatetime === i ? 'active' : ''}>{ v }</span>
                  })
                }
                </div>
              </section>
              { content }
              { loading }
              < /div>
              { this.props.children } 
            < /div>
        );
    }
}

export default Category;
module.exports = Category;