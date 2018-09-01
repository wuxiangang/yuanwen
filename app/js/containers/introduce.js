import React from 'react';
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import browserHistory from 'react-router/lib/browserHistory';

import mixins from '../modules/mixins';
import Callback from '../modules/callback';
import Introduce from '../components/introduce';
import Comment from '../components/comment';
import Header from '../components/header'
import NoData from '../components/noData'
import Loading from '../components/loading'
import Style1 from '../components/styles/style1';

let POP;
if (typeof window !== 'undefined') {
  require('../../sass/introduce.scss');
  POP = require('../modules/confirm');
}

const data = (state) => {
    return state;
};

const mapStateToProps= createSelector(
    [data],
    (data) => {
        return data;
    }
)

class Introducer extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            collect_status: false,
            c_loading: false,
            comment: null
        }
        this.getComments = this.getComments.bind(this);
        this.mixins = mixins.bind(this)();
        this.addShelf = this.addShelf.bind(this);
        this.doAddShelf = this.doAddShelf.bind(this);
        this.skipShelf = this.skipShelf.bind(this);
        this.deleteComments = this.deleteComments.bind(this);
    }
    getComments(p) {
        // if (this.props.comment && this.props.comment.pageNumber === p) return;
        // const id = this.mixins.getId();
        // const page = p || 1;
        // this.props.dispatch(this.mixins.fetchList(`comment.${id}.${page}`, 1)).then(()=>{
        //     this.setState({ c_loading: false })
        // });

         if (this.state.comment && this.state.comment.pageNumber === p) return;
        const id = this.mixins.getId();
        const page = p || 1;
        this.mixins.fetchRequest('comment' ,{
            book_id: id,
            pages: page
        }, (res) => {
            this.setState({ c_loading: false, comment: res })
        })
    }
    deleteComments(i) {
        let arr = JSON.parse(JSON.stringify(this.state.comment));
        arr.content.splice(i, 1);
        this.setState({ comment: arr })
    }
    skipShelf() {
        let path = location.pathname;
        const hasShelf = /shelf(.*)/.test(path);
        if (hasShelf) path = path.replace(/shelf(.*)/, 'shelf');
        else path = path.replace(/book(.*)/, 'shelf');
        browserHistory.push(path);
    }
    addShelf() {
        const isLogin = this.mixins.isLogin();
        if (isLogin)
            this.doAddShelf();
        else {
            this.mixins.skipUrl('login');
            Callback.setCallback('login', this.doAddShelf)
        }
    }
    doAddShelf() {
        this.mixins.fetchRequest('addshelf',{ book_id: this.book_id}, (res) => {
            this.setState({ collect_status: true });
            this.props.dispatch(this.mixins.addShelf(this.mixins.getKey(this.props) ,1));
        },() =>{
            POP._alert('加入失败');
        })
    }
    componentDidMount() {
       this.book_id = this.mixins.getId();
       this.mixins.whetherFetch();
       this.mixins.isRouter() && this.getComments();
       this.refs.container && this.mixins.lazyLoad(this.refs.container);
    }
    componentDidUpdate(nextProp) {
       this.mixins.whetherFetch();
       if( this.mixins.isRouter() ) {
            if((this.props.children !== nextProp.children) || this.props.params.introId !== nextProp.params.introId){
                        this.setState({ c_loading: true })
                        this.getComments();
            }
        }
       this.refs.container && this.mixins.lazyLoad(this.refs.container);
    }
    // componentWillUnmount() {
    //     this.props.dispatch(this.mixins.clearProps('comment'));
    // }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.props[this.mixins.getKey(this.props)] !== nextProp[this.mixins.getProps(nextProp)]
        // || this.props.comment !== nextProp.comment
        || this.state.comment !== nextState.comment
        || this.state.c_loading !== nextState.c_loading
        || this.state.collect_status !== nextState.collect_status;
    }
    render() {
        let content, comment_module, recommend;
        let data = this.props[this.mixins.getKey(this.props)];
        let comments = this.state.comment; //评论
        const right = <a className="iconfont icon-shujia f-fr" onClick={ this.skipShelf }></a>

        if (data) {
            if(data.code === 200) {
                 content = <Introduce data={data.content} addShelf={this.addShelf} collect_status={this.state.collect_status} />;
                  if (comments)  {
                    const isLogin = this.mixins.isLogin();
                    comment_module = this.state.c_loading ?<Loading type='relative' /> : <Comment loading={this.state.c_loading} data = {comments} deleteComments={this.deleteComments} getComments={this.getComments} isLogin={isLogin} />
                    recommend = (
                    <section className="m-recommand">
                        <div>
                                    <span className="i-circle"></span>
                                    <span className="u-title">相关推荐</span>
                                </div>
                                <div className="m-block">
                                {
                                    data.content.recommends.map((v,i)=>{
                                        return <Style1 data={v} key={i} />
                                    })
                                }
                                </div>
                    </section>
                    );
                }
            }   else content = <NoData type={data.code == 402 ? 'UFO' : 'emptyBook'} />
        } else {
            content = <Loading />
        }


        return ( < div  className='g-body'>
            <div className="g-scroll m-introduce-block" ref = 'container' id="introduce">
                 <Header title='书籍详情' route={this.props.route} right={right} />
                { content }
                { comment_module }
                { recommend }
            </div>
            { this.props.children } < /div>
        );
    }
}

export default connect(mapStateToProps)(Introducer)