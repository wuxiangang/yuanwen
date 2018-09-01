import React from 'react';
import mixins from '../modules/mixins';
import Header from '../components/header';
import NoData from '../components/noData'
import Loading from '../components/loading'

class NoticeDetail extends React.Component { 
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
        || this.state.data !== nextState.data
        || this.state.code !== nextState.code;
    }
    getAsynData() {
      this.mixins.fetchRequest('notice_detail', {id: this.props.params.noticeId}, (res) => {
        this.setState({ data: res.content })
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
        let content,data = this.state.data, name;
        if (data) {
            name = <h2>{ data.name }</h2>;
           content =( <div className="m-notice-detail" style={{ paddingTop: '10px'}} dangerouslySetInnerHTML={{ __html: data.content }}></div>);
        } else {
          content = <Loading />
        }

        if (this.state.code) content = <NoData type={this.state.code == 402 ? 'UFO' : 'emptyData'} />
        
        return ( < div className='g-body m-agreement'>
            <Header title={ '公告详情' } route={this.props.route}  />
            <div className='g-scroll g-scroll-common'>
              { name }
              { content }
              < /div>
              { this.props.children } 
            < /div>
        );
    }
}

export default NoticeDetail;
module.exports = NoticeDetail;