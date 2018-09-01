import React from 'react';
import Header from '../components/header'

class Notice1 extends React.Component { 
    render() {
        
        return ( < div className='g-body m-agreement'>
            <Header title='公告详情' route={this.props.route} />
            <div className='g-scroll g-scroll-common'>
                
<h2>王者归来，原文小说网全新上线</h2>

<h3>终于等到你，我的老伙计！</h3>
<p>2017第一件令人无比兴奋的事就是！原文小说网新版上线啦！撒花~</p>
<p>在UI设计师们的精心设计下，前端后台程序员GG夜以继日的编码后，全新的原文小说网BLINGBLING闪现。新版采用了全新的阅读主题色，页面精致简约，排版新潮高效。重点是！旧数据也已全部迁移至新平台。</p>
<p>全新作者福利也已上线，目前分为买断分成、保底买断、电子版权/全版权买断签约方式，福利包含“签约送礼+保底+全勤+分成+完本奖励”,分成最高享八成！（点击查看<a href="/notice3">http://m.yuanwen.org/notice3</a>），福利设定的宗旨就是，<b>你开心就好</b>！</p>
<p>而且，上线期间，作者群不时有红包雨哦！快来加入作者群！QQ群号：576265399！</p>
<p>2017，全新启程，让我们一起创造超级IP!</p>
<p>另：</p><p>======================</p>
<p>下个版本即将更新：</p><p>1、打赏</p><p>2、站内信</p><p>3、评论的回复、赞功能</p>
<p>4、作者对自己作品的评论管理，如删帖、精华、置顶</p><p>5、多种充值方式、充值赠送原文币</p>
<p>6、包月阅读功能</p><p>7、个人中心优化，如更新头像时可裁剪头像等</p>
<p>8、作家中心的收益查询</p><p>======================</p><p>敬请期待！</p>
              < /div>
            < /div>
        );
    }
}

export default Notice1;
//ensure 
module.exports = Notice1;