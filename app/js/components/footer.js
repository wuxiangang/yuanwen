import React from 'react';

class Footer extends React.Component { 
    render() {
        return ( < footer  className='m-footer'>
            <div>
                <a href="http://yuanwen.org?rs=1">电脑版</a>
                <a href="/" className="active">触屏版</a>
                <a href="/feedback">意见反馈</a>
            </div>
            <p>Copyright (C) 2002-2018 yuanwen.org</p>
        < /footer>
        );
    }
}

export default Footer;