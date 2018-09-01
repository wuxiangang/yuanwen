import React from 'react';
import Link from 'react-router/lib/Link';
import browserHistory from 'react-router/lib/browserHistory';
import NoData from '../components/noData'
import GLOBAL from '../modules/global';
import storage from '../modules/storage';
import mixins from '../modules/mixins';

class Search extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
          list: []
        }
        this.doSearch = this.doSearch.bind(this);
        this.clearStore = this.clearStore.bind(this);
        this.mixins = mixins.bind(this)();
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.state.list !== nextState.list;
    }
    clearStore() {
      this.setState({ list: [] });
      storage.set('yw_search', []);
    }
    doSearch() {
      const val = this.refs.search.value;
      const list = [...this.state.list];
      if (!val) return;
      if (list.indexOf(val) < 0) {
        list.push(val);
        storage.set('yw_search', list);
        this.setState({ list });
      }
      this.refs.search.value = '';
      browserHistory.push(GLOBAL.setHref(`category?name=${encodeURIComponent(val)}`))
    }
    componentDidMount() {
      const list = storage.get('yw_search', 'array');
      this.setState({ list });
    }
    render() {
        let nodata;
        if (!this.state.list.length) nodata = <NoData type="emptySearchlist" />;
        return ( < div className='g-body m-search'>
            < header  className='m-header'>
              <span><a className="iconfont icon-left f-fl" onClick={this.mixins.goBack} /></span>
              <div className='u-header-line'>
                <input type='text' className="u-input-search f-border-box" ref="search" placeholder="书名 / 作者" />
                <a className="iconfont icon-sousuo f-fr" onClick={this.doSearch} />
              </div>
            < /header>
            <div className='g-scroll g-scroll-common'>
                <div className="m-catalogue-title f-13">
                  <span>最近搜索</span>
                  <a className="iconfont icon-lajitong f-14 f-fr" onClick={this.clearStore}/>
                </div>
                <section className="m-block  u-style-6">
                  {
                    this.state.list.map((v,i) => {
                      return (
                          <Link className="line-clamp" to={GLOBAL.setHref(`category?name=${encodeURIComponent(v)}`)}>{ v }</Link>
                        )
                    })
                  }
                </section>
                {nodata}
              < /div>
              { this.props.children } 
            < /div>
        );
    }
}

export default Search;
module.exports = Search;