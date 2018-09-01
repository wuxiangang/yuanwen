import React from 'react';
import Link from 'react-router/lib/Link';
import mixins from '../modules/mixins';
import Header from '../components/header';
import NoData from '../components/noData'
import Loading from '../components/loading'
import GLOBAL from '../modules/global';

class Notice extends React.Component { 
    constructor(props) {
        super(props);
        this.mixins = mixins.bind(this)();
        this.state = {
          data: null,
          code: null
        }
        this.getAsynData = this.getAsynData.bind(this);
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.state.code !== nextState.code
        || this.state.data !== nextState.data;
    }
    getAsynData() {
      this.mixins.fetchRequest('notice', {block_id: 23, pages: 1}, (res) => {
        this.setState({ data: res.content.list })
      },(err) => {
        this.setState({ code: err.code })
      });
    }
    componentDidMount() {
      this.mixins.isRouter() && this.getAsynData();
    }
    componentDidUpdate() {
       if (this.mixins.isRouter() && !this.state.data ) this.getAsynData();
    }
    render() {
        let content,data = this.state.data, len;
        if (data) {
          len = data.length;
          if ( !len ) content = <NoData type="emptyData"  />
          else {
           content = <div className="m-notice">
           <div className="m-catalogue-title"><span className="f-fl">最新公告</span><span className="f-fr">时间</span></div>
           <div className="m-catalogue-box">
           {
            data.map((v, i) => {
              const href = GLOBAL.skipHref(v);
              return <Link to={ href.to } target={ href.target } key={ i }><span className="f-fl line-clamp">{ v.name }</span> <span className="f-fr">{ GLOBAL.prettyDate(v.modify_time) }</span></Link>
            })
           }
           </div>
           </div>;
          }
        } else {
          content = <Loading />
        }

        if (this.state.code) content = <NoData type={this.state.code == 402 ? 'UFO' : 'emptyData'} />
        
        return ( < div className='g-body m-list'>
            <Header title={ '公告' } route={this.props.route}  />
            <div className='g-scroll g-scroll-common'>
              { content }
              < /div>
              { this.props.children } 
            < /div>
        );
    }
}

export default Notice;
module.exports = Notice;