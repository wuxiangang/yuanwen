import React from 'react';
import Link from 'react-router/lib/Link';
import browserHistory from 'react-router/lib/browserHistory';

class Success extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      sec: 5
    }
  }
  componentDidMount(){
    const time = setInterval(() => {
      const t = this.state.sec - 1;
      if ( t <= 0) { 
        location.href = '/';
        clearInterval(time);
        return;
      }
      this.setState({ sec: t });
    }, 1000);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.sec !== nextState.sec;
  }
  render() {
    let text = '注册成功';
    switch (this.props.type) {
      case 'password':
        text = '重置成功';
        break;
      default:
        break;
    }

    return (
      <div className="u-success">
        <div>
          <div className="icon" />
          <p className="f-s-text">{ text }</p>
          <p className="f-s-skip">{ this.state.sec }秒后回到首页</p>
          <a href="/">如果浏览器没有自动跳转可以点此跳转</a>
        </div>
      </div>
    );
  }
}

export default Success;
module.exports = Success;
