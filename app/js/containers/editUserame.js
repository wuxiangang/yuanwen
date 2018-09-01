import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import Header from '../components/header';

if (typeof window !== 'undefined') {
  var POP = require('../modules/confirm');
  require('../../sass/userinfo.css');
}

class EditUsername extends React.Component { 
    constructor(props) {
        super(props);
        this.editname = this.editname.bind(this);
        this.clearValue = this.clearValue.bind(this);
  }
  editname() {
    if (!this.refs.username.value) { POP._alert('昵称不能为空'); return; }

    const pramas = {
      user_name: this.refs.username.value.trim()
    };

    const backUrl = location.pathname.replace(`/${this.props.route.path}`, '');
    browserHistory.push({ pathname: backUrl, state: pramas });
  }
  clearValue() {
    this.refs.username.value = '';
    return;
  }
  componentDidMount() {
    this.refs.username.focus();
    const username = this.props.location.state.username;
    this.refs.username.value = username || '';
    this.refs.username.oninput = function (e) {
      if (this.refs.username.value.length > 10)				{
        this.refs.username.value = this.refs.username.value.substring(0, 10);
      }
    }.bind(this);
  }
  render() {
    const right = <span onClick={this.editname} className="iconfont icon-duihao f-fr" />;
    return (
      <div className="g-body">
        <Header title={'修改昵称'} right={right} route={this.props.route} />
        <div className="g-main g-main-1 m-username">
          <section className="m-name-input">
            <input type="text" ref="username" placeholder="10个字以内，支持中英文、数字" />
            <span className="iconfont icon-cha" onClick={this.clearValue} />
          </section>
        </div>
      </div>
    );
  }
}
export default EditUsername;
module.exports = EditUsername;
