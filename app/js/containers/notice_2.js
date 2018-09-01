import React from 'react';
import Header from '../components/header'

class Agreement extends React.Component { 
    render() {
        
        return ( < div className='g-body m-agreement'>
            <Header title='公告详情' route={this.props.route} />
            <div className='g-scroll g-scroll-common'>
                
<h2>福利申请格式</h2>
<h3>亲爱的各位作者们：</h3><br/> 
            <p> 凡参与原文福利获取奖励的作品，请务必在每月的25号前，填写作品的相关信息，并把联系方式，支付账号等资料递交到指定的邮箱进行审核。如达到要求指定发放的作品，并无递交任何资料，将视为不发放稿酬处理！申请邮箱：fuli@yuanwen.org<br/><br/> 申请福利的标准格式：<br/><br/> 1、作品名：<br/><br/> 2、作品链接：<br/><br/> 3、申请福利类型（填写达到福利要求的）：<br/><br/> 4、联系方式：<br/><br/> 5、银行卡/支付宝账号（注明属于哪种支付方式）：<br/><br/> -----------------<br/><br/> 银行卡信息填写要求：<br/><br/> 1、账号：<br/><br/> 2、用户名：<br/><br/> 3、开户行:<br/><br/> 4、所属银行：<br/><br/> 5、作者联系电话：<br/><br/> 原文小说网编辑部</p>
              < /div>
            < /div>
        );
    }
}

export default Agreement;
//ensure 
module.exports = Agreement;