import React from 'react';
import Link from 'react-router/lib/Link';
import Page from './page'
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import storage from '../modules/storage';
import Img from './img';
if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
}

class Comment extends React.Component { 
    constructor(props) {
        super(props);
        this.setHeight = this.setHeight.bind(this);
        this.getHeight = this.getHeight.bind(this);
        this.doComment = this.doComment.bind(this);
        this.mixins = mixins.bind(this)();
        this.deleteComment = this.deleteComment.bind(this);
        this.state = {
            height: 0,
            len: 140,
            current: []
        }
    }
    getHeight() {
        let height = 0;
        for (let i = 0; i < 3; i++) {
            const child = this.refs.comment.childNodes[i];
            if ( child ) height+=child.offsetHeight;
        }
        this.setState( { height: height } );  
    }
    doComment() {
        const v = this.refs.commenter.value;
        if (!v) return POP._alert('请输入评论内容');
        this.mixins.fetchRequest('addcomment', {
            book_id: this.mixins.getId(),
            title: v,
            content: v
        }, (res) => {
            const user = storage.get('yw_user');
            const arr = [...this.state.current];
            const com = {
                content: v,
                create_time: '刚刚',
                image_url: user.image_url,
                user_name: user.user_name,
                content_id: res.content_id
            }
            arr.push(com);
            this.refs.commenter.value = '';
            this.setState({ current: arr, len: 140 });
        }, (err) => {
            POP._alert(err.reason);
        })

    }
    deleteComment(v) {
        POP.confirm('确认删除？', () => {
            this.mixins.fetchRequest('deletecomment', {
                review_id: v.content_id
            }, (res) => {
                const index_current = this.state.current.indexOf(v);
                const index_arr = this.props.data.content.indexOf(v);
                if (index_current >=0 ) {
                    let current = JSON.parse(JSON.stringify(this.state.current));
                    current.splice(index_current, 1);
                    this.setState({ current: current })
                    return;
                }
                this.props.deleteComments(index_arr);
                if (this.state.height === 'auto') return;
                this.getHeight();
            }, (err) => {
                POP._alert(err.reason);
            });
        })
    }
    componentDidMount() {
        this.getHeight();
    }
    componentDidUpdate(nextProp) {
        if (this.refs.commenter)
            this.refs.commenter.oninput = (e)=>{
                let len = e.target.value.length;
                if (len >= 140) {
                    len = 140;
                    e.target.value = e.target.value.substr(0,140);
                }
                this.setState({ len: 140 - len })
            }
        if (this.props.data.pageNumber !== nextProp.data.pageNumber) { 
            document.getElementById('introduce').scrollTop = this.refs.commentbox.offsetTop;
            this.setState({ current: [] });
        }
    }
    setHeight() {
        this.setState( { height: 'auto' } );
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.data !== nextProp.data ||
        this.props.isLogin !== nextProp.isLogin ||
        this.state.len !== nextState.len ||
        this.state.current !== nextState.current ||
        this.state.height !== nextState.height;
    }
    render() {
        const { content, pageSize, total, pageNumber } = this.props.data;
        let page_module, nomore, textarea, nocomment;
        if (total > pageSize ) {
           const total_page = Math.ceil( total / pageSize );
            page_module = <Page totalPage = {total_page} pageNumber={pageNumber} ajaxAnyc={this.props.getComments}  />
          }

        if ( content.length > 3  && this.state.height !== 'auto' ) {
            nomore = <div className='btn ui-blue-light u-full-btn' onClick={this.setHeight}>更多评论</div>
        }

        if (this.props.isLogin) {
            textarea = (<div>
                <textarea className="f-border-box" placeholder='我来说两句' ref="commenter" maxlength="50"></textarea>
                <div  className="u-logined-comment"><span>还能输入{this.state.len}字</span><a className="btn ui-blue f-fr" onClick={ this.doComment }>发表</a></div>
                </div>
                );
        } else {
            textarea = ( <div className="m-comment-login f-border-box">
                        <Link to={GLOBAL.setHref('login')}>登录</Link>
                        <span>后发表评论</span>
                    </div>);
        }

        if (!content.length && !this.state.current.length)
            nocomment = (<div className="m-noData f-tc">
          <div className='icon-img empty-comment '></div>
          <i className="tip">暂无评论哦</i>
        </div>)

        return ( 
        <section className="m-commit-block">
            <div className="m-commit-input">
                <div>
                    <span className="i-circle"></span>
                    <span className="u-title">评论区</span>
                    <span className="f-fr u-title">共{total + this.state.current.length}条评论</span>
                </div>
                <div>
                    { textarea }
                </div>
            </div>
            < div className="m-comment" ref="commentbox">
            { nocomment }
            <div className="m-comment-box">
                {
                    this.state.current.map((v,i) => {
                        return (
                                <section className="m-comment-list b-under">
                                    <Img src={ v.image_url } />
                                    <div className="u-comment">
                                        <div><span className="u-title f-fl line-clamp">{ v.user_name }</span><span className="u-time f-fr">{v.create_time}</span></div>
                                        <div className="u-content">{ v.content }</div>
                                        <div><a className="u-delete f-fr" onClick={this.deleteComment.bind(null, v)}>删除</a></div>
                                    </div>
                                </section>
                            )
                    })
                } 
            </div>
            <div  style = {{ height: this.state.height }} className={ !this.state.height ? 'more' :''}>
                <div className="m-comment-box"  ref="comment">
                {
                    content.map((v,i) => {
                        return (
                                <section className="m-comment-list b-under">
                                    <Img src={ v.image_url } update={true} />
                                    <div className="u-comment">
                                        <div><span className="u-title f-fl line-clamp">{ v.user_name }</span><span className="u-time f-fr">{ GLOBAL.prettyDate(v.create_time) }</span></div>
                                        <div className="u-content">{ v.content }</div>
                                        <div>{ v.is_delete ? <a className="u-delete f-fr" onClick={this.deleteComment.bind(null, v)}>删除</a> : null }</div>
                                    </div>
                                </section>
                            )
                    })
                } 
                </div>
                { page_module }
            </div>
                { nomore }
        < /div>
        </section>
        );
    }
}

export default Comment;