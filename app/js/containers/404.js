import React from 'react';
import NoData from '../components/noData'

class NotFound extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            sec: 15
        }
    }
    componentDidMount() {
        const time = setInterval(() => {
            let t = this.state.sec;
            t--;
            if (t <= 0) {
                clearInterval(time);
                location.href = '/';
                return;
            }
            this.setState({ sec: t });
        }, 1000);
    }
    render() {
        
        return ( < div className='g-body'>
        <div className="m-noData f-tc">
          <div className='icon-img empty-404'></div>
          <i className="tip">
            <p>你所访问的页面不存在</p>
            <p>{ this.state.sec }秒后将自动返回首页</p>
          </i>
            <a className="u-btn linear-blue u-blue-shadow" href='/'>立即返回首页</a>
        </div>
            < /div>
        );
    }
}

export default NotFound;
module.exports = NotFound;