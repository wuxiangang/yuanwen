import React from 'react';
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import mixins from '../modules/mixins';
import Header from '../components/header';
import NoData from '../components/noData'
import Loading from '../components/loading'
import List from '../components/list'

const data = (state) => {
    return state;
};

const mapStateToProps= createSelector(
    [data],
    (data) => {
        return data;
    }
)

class Lister extends React.Component { 
    constructor(props) {
        super(props);
        this.mixins = mixins.bind(this)();
        this.state = {
          update: 1,
          noMore: false
        }
        this.getAsynData = this.getAsynData.bind(this);
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.props[this.mixins.getKey(this.props)] !== nextProp[this.mixins.getProps(nextProp)]
        || this.state.update !== nextState.update
        || this.state.noMore !== nextState.noMore;
    }
    getAsynData() {
      if (this.Asyning || this.state.noMore) return;
      const key = this.mixins.getProps(this.props);
      const data = this.props[key];
      const opt = this.mixins.getParts();
      this.Asyning = true;
      this.mixins.fetchRequest(opt[0],{ block_id: opt[1], pages: data.page+1 }, (res) => {
         this.Asyning = false;
         if (res.content.list.length === 0) {
            this.setState({ noMore: true });
            return;
         }
         if (res.content.list.length < 20) this.setState({ noMore: true });
         this.props.dispatch(this.mixins.AssignProps(res, key));
         this.setState({ update: this.state.update++ });
      },(err) => {
          this.Asyning = false;
      });
    }
    componentDidMount() {
       this.mixins.whetherFetch();
       this.refs.container && this.mixins.lazyLoad(this.refs.container);
    }
    componentDidUpdate() {
       this.mixins.whetherFetch();
       this.refs.container && this.mixins.lazyLoad(this.refs.container);
    }
    render() {
        let content,data = this.props[this.mixins.getKey(this.props)], title, loading, len;
        if (data) {
                if (data.code === 200) {
                    title = data.content.block_title;
                    len = data.content.list.length;
                    if ( !len ) content = <NoData type='emptyData' />
                    else {
                     content = <List data={data.content.list} />
                     loading = (this.state.noMore || len < 20) ? null : <Loading type='relative' />;
                   }
                } else content = <NoData type={data.code == 402 ? 'UFO' : 'emptyData'} />
        } else {
          content = <Loading />
        }
        
        return ( < div className='g-body m-list'>
            <Header title={ title } route={this.props.route}  />
            <div className='g-scroll g-scroll-common' onScroll={ this.mixins.scrollHandle } ref="container">
              { content }
              { loading }
              < /div>
              { this.props.children } 
            < /div>
        );
    }
}

export default connect(mapStateToProps)(Lister)