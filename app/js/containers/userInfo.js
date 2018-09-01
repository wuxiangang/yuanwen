import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import GLOBAL from '../modules/global';
import mixins from '../modules/mixins';
import Header from '../components/header';
import Loading from '../components/loading';

var POP;
if (typeof window !== 'undefined') {
  POP = require('../modules/confirm');
  require('../../sass/userinfo.css');
}

class UserInfo extends React.Component { 
  constructor(props) {
        super(props);
        this.state = {
           user: null,
            user_birthday: '请设置生日',
            user_name: '',
            portraitUrl: '',
            user_gender: '保密',
            isEdit: false,
            sex: false,
            sexId: 0
        }
        this.mixins = mixins.bind(this)();
        this.logout = this.logout.bind(this);
        this.changeEdit = this.changeEdit.bind(this);
        this.finishEdit = this.finishEdit.bind(this);
        this.selectHeader = this.selectHeader.bind(this);
        this.selectDate = this.selectDate.bind(this);
        this.updateBirthday = this.updateBirthday.bind(this);
        this.forAndroid = this.forAndroid.bind(this);
        this.selectSex = this.selectSex.bind(this);
        this.selectedSex = this.selectedSex.bind(this);
        this.closeSex = this.closeSex.bind(this);
        this.gotoEditname = this.gotoEditname.bind(this);
        this.switchSex = this.switchSex.bind(this);
        this.setDate = this.setDate.bind(this);
  }
  logout(e) {
    e.preventDefault && (e.preventDefault());
    POP.confirm('确定退出登录?', () => {
      this.mixins.fetchRequest('logout', {}, (res) => {
          GLOBAL.removeCookie('token');
          location.href='/';
      }, (error) => {
          POP._alert(error.reason);
      });
    });
  }
  changeEdit() {
    if (!this.state.user_name) return;
    GLOBAL.addClass(this.refs.header, 'show');// 兼容部分安卓机不能触发click()
    GLOBAL.addClass(this.refs.date, 'show');
    this.setState({ isEdit: true});
  }
  finishEdit() {
    GLOBAL.removeClass(this.refs.header, 'show');
    GLOBAL.removeClass(this.refs.date, 'show');
    const pramas = {
      gender: this.state.sexId,
      birthday: this.refs.date.value.replace(/-/g, '') || this.state.user_birthday,
      user_name: this.state.user_name
    };

    this.mixins.fetchRequest('reset', pramas, (res) => {
        POP._alert(res.content);  
    }, (error) => {
        POP._alert(error.reason);
    });

    this.setState({ isEdit: false });
  }
  selectHeader() {
    if (!this.state.isEdit) return;
    this.refs.header.onchange = function (e) {
    const file = this.refs.header.files[0];

      try {
        this.setState({ portraitUrl: window.URL.createObjectURL(file) });
      } catch (err) {
        this.setState({ portraitUrl: window.webkitURL.createObjectURL(file) });
      }

      const formdata = new FormData();
      formdata.append('file', file);

    this.mixins.fetchFile('portrait', formdata, (res) => {
        POP._alert('上传成功');  
    }, (error) => {
        POP._alert(error.reason);
    });
    }.bind(this);
  }
  selectDate() {
    if (!this.state.isEdit || GLOBAL.isAndroid()) return;
    this.refs.date.focus();
  }
  updateBirthday() {
    this.setState({ user_birthday: this.refs.date.value || '请设置生日' });
  }
  setDate(time) {
    if (time.indexOf('-')>0) return time;
    return time.substr(0,4)+'-'+time.substr(4,2) + '-' + time.substr(6,2);
  }
  forAndroid(e) {
    if (!GLOBAL.isAndroid() || !this.refs.date) return;
    clearInterval(this.time);
    this.time = setInterval(() => {
      if (this.state.user_birthday !== this.refs.date.value) {
        this.setState({ user_birthday: this.refs.date.value || '请设置生日' });
        clearInterval(this.time);
      }
    }, 500);
  }
  selectSex() {
    if (!this.state.isEdit) return;
    this.setState({ sex: true });
  }
  selectedSex(e) {
    const a = e.target.getAttribute('data-index');
    this.setState({
      user_gender: this.switchSex(a),
      sexId: a
    });
    this.closeSex();
  }
  closeSex() {
    this.setState({ sex: false });
  }
  gotoEditname() {
    if (!this.state.isEdit) return;
    browserHistory.push({ pathname: GLOBAL.setHref('editname'), state: { username: this.state.user_name } });
  }
  switchSex(index) {
    let user_gender;
    switch (index) {
      case '1':
        user_gender = '男生';
        break;
      case '2' :
        user_gender = '女生';
        break;
      default:
        user_gender = '保密';
    }
    return user_gender;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state)			{
      this.setState({ user_name: nextProps.location.state.user_name });
    }
  }
  componentDidMount() {
    this.mixins.fetchRequest('me', null, (res) => {
      this.setState({
            user: res.content,
            user_birthday: res.content.birthday,
            user_name: res.content.user_name,
            sexId: res.content.gender,
            user_gender: this.switchSex(res.content.gender+''),
            portraitUrl: res.content.image_url
      });
    });
  }
  render() {
    let list;
    const right = <span onClick={this.state.isEdit ? this.finishEdit : this.changeEdit} className={ "iconfont f-fr" + (this.state.isEdit ? ' icon-duihao' : ' icon-bianji')} />
    const access = this.state.isEdit ? <a className="icon-h iconfont icon-right f-fr" /> : null;
    if (!this.state.user) { 
      list  = <Loading />
    } else {
      list = (<div className="g-main g-main-1 m-userinfo">
        <section className="m-user-header" onClick={this.selectHeader} >
          <input type="file" className="user-header" ref="header" accept="image/*;capture=camera" />
          <span>头像</span>
          {access}
          <img src={this.state.portraitUrl || "http://cover.yuanwen.org/default/cover.jpg"} />
        </section>
        <section className="m-user-detail">
          <ul>
            <li onClick={this.gotoEditname}><span>昵称</span>{access}<span>{this.state.user_name || this.state.user.user_name}</span></li>
            <li onClick={this.selectSex}><span>性别</span>{access}<span>{this.state.user_gender}</span></li>
            <li onClick={this.selectDate}><span>生日</span>{access}<span>{this.setDate(this.state.user_birthday)}</span></li>
          </ul>
          <input onChange={this.updateBirthday} onBlur={this.updateBirthday} onInput={this.updateBirthday} type="date" ref="date" id="dater" className={`dateInput${GLOBAL.isAndroid() ? ' position' : ''}`} />
        </section>

        <section className="m-user-b" style={{ display: !this.state.isEdit ? 'block' : 'none' }}>
          <a className={`btn u-btn linear-blue u-blue-shadow`} onClick={this.logout}>退出登录</a>
        </section>

      </div>);
    }

    return (
      <div className="g-body">
        <Header title={'个人资料'} right={right} route={this.props.route} />
        {list}
        <section>
          <div className={`m-wrapper${this.state.sex ? ' show' : ''}`} />
          <div className={`UI_selecter${this.state.sex ? ' show' : ''}`} onClick={this.selectedSex}>
            <ul>
              <li data-index="1" >男生</li>
              <li data-index="2" >女生</li>
              <li data-index="0" >保密</li>
            </ul>
            <button onClick={this.closeSex} className="UI-cancel">取消</button>
          </div>
        </section>
        {this.props.children}
      </div>
    );
  }
}
export default UserInfo;
module.exports = UserInfo;
