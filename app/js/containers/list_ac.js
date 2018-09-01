import React from 'react';

import mixins from '../modules/mixins';
import Header from '../components/header';
import NoData from '../components/noData'
import Loading from '../components/loading'
import List from '../components/list'

class Lister extends React.Component { 
    constructor(props) {
        super(props);
        this.mixins = mixins.bind(this)();
        this.page = 1;
        this.state = {
          data: null,
          noMore: false,
          code: null,
          name: ''
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
    getAsynData() {
      if (this.Asyning || this.state.noMore) return;
      const opt = this.mixins.getParts();
      let param = {
        block_id: opt[1],
        pages: this.page,
      };
      this.Asyning = true;

      this.mixins.fetchRequest(opt[0], param, (res) => {
        this.page++;
        if (res.content.list.length < 20) this.setState({ noMore: true });
        this.setState({ data: !this.state.data ? res.content.list :  this.state.data.concat(res.content.list), name: res.content.block_title });
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
       if (this.mixins.isRouter() && !this.state.data) this.getAsynData();
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
          content = <Loading />
        }

        if (this.state.code) content = <NoData type={this.state.code == 402 ? 'UFO' : 'emptyData'} />
        
        return ( < div className='g-body m-list'>
            <Header title={ this.state.name } route={this.props.route}  />
            <div className='g-scroll g-scroll-common' onScroll={ this.mixins.scrollHandle } ref="container">
              { content }
              { loading }
              < /div>
              { this.props.children } 
            < /div>
        );
    }
}

export default Lister;
module.exports = Lister;