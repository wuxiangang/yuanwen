import React from 'react';

import mixins from '../modules/mixins';
import Header from '../components/header'
import POP from '../modules/confirm';

class Feedback extends React.Component { 
    constructor(props) {
        super(props);
        this.mixins = mixins.bind(this)();
        this.doFeedback = this.doFeedback.bind(this);
        this.state = { len: 500 };
    }
    doFeedback() {
        const content = this.refs.feedback.value;
        if (!content) return POP._alert('请输入反馈内容');
        this.mixins.fetchRequest('feedback', { content }, () => {
            this.refs.feedback.value = '';
            this.setState({ len: 500 });
            POP._alert('提交成功，感谢您的意见反馈');
        }, (err) => {
            POP._alert('提交失败，请重试');
        })
    }
    componentDidMount() {
        this.refs.feedback.oninput = (e)=>{
                let len = e.target.value.length;
                if (len >= 500) {
                    len = 500;
                    e.target.value = e.target.value.substr(0,500);
                }
                this.setState({ len: 500 - len });
        }
    }
    render() {
        
        return ( < div className='g-body m-feedback'>
            <Header title='意见反馈' route={this.props.route} />
            <div className='g-scroll g-scroll-common'>
                <textarea className="f-border-box" ref="feedback" placeholder="我来说两句..."></textarea>
                <div className="u-feed-line">
                    <span className="f-fl">还能输入{ this.state.len }字</span>
                    <a className="btn ui-blue f-fr" onClick={ this.doFeedback }>提交</a>
                </div>
                <div className="m-feedback-bottom">
                    <div>
                        <span className="iconfont icon-xiangqing-qunzhuangtai"></span>
                        <span>读者交流群  559844556</span>
                        <a href="https://jq.qq.com/?_wv=1027&k=43tSfs3" target="_blank">去加入</a>
                    </div>
                </div>
              < /div>
            < /div>
        );
    }
}

export default Feedback;
//ensure 
module.exports = Feedback;