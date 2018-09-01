import React from 'react';
import Link from 'react-router/lib/Link';
import mixins from '../modules/mixins';
import Header from '../components/header';
import NoData from '../components/noData'
import Loading from '../components/loading'
import GLOBAL from '../modules/global';

class Detail extends React.Component { 
    constructor(props) {
        super(props);
        this.mixins = mixins.bind(this)();
        this.page = 1;
        this.state = {
          data: null,
          code: null,
          noMore: false
        }
        this.getAsynData = this.getAsynData.bind(this);
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.state.data !== nextState.data;
    }
    getAsynData() {
      if (this.state.noMore || this.Asyning) return;
      this.Asyning = true;
      this.mixins.fetchRequest('detail', {pages: this.page, contents: 20}, (res) => {
        this.page++;
        this.Asyning = false;
        if (res.content.length < 20) this.setState({ noMore: true });
        this.setState({ data: !this.state.data ? res.content :  this.state.data.concat(res.content)});
      },(err) => {
        this.Asyning = false;
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
        let content,data = this.state.data, len, loading;
        if (data) {
          len = data.length;
          loading = this.state.noMore ? null : <Loading type="relative" />
          if ( !len ) content = <NoData type="emptyDetail"  />
          else {
           content = <div className="m-notice">
           <div className="m-catalogue-title"><span className="f-fl">操作</span><span className="f-fr">金额</span></div>
           <ul className="m-detail-box">
           {
            data.map((v, i) => {
              const situation = v.situation === 1;
              return (<li key={ i }>
                  <div className="f-fl">
                  <p className="line-clamp">{ v.content_name }</p>
                  <p className="line-clamp">{ GLOBAL.prettyDate(v.create_time) }</p>
                   </div>
                  <span className={'f-fr' + (!situation ? ' active' : '')}>{ (situation? '-' : '+') + v.consume_fee }</span></li>)
            })
           }
           </ul>
           { loading }
           </div>;
          }
        } else {
          content = <Loading />
        }

        if (this.state.code) content = <NoData type={this.state.code == 402 ? 'UFO' : 'emptyData'} />
        
        return ( < div className='g-body m-detail'>
            <Header title={ '明细' } route={this.props.route}  />
            <div className='g-scroll g-scroll-common' onScroll={ this.mixins.scrollHandle } ref="container">
              { content }
              < /div>
            < /div>
        );
    }
}

export default Detail;
module.exports = Detail;