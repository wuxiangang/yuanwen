import React from 'react';
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import axios from 'axios';
import browserHistory from 'react-router/lib/browserHistory';

import mixins from '../modules/mixins';
import storage from '../modules/storage';
import Callback from '../modules/callback';
import Reading from '../components/reading';
import Catalogue from '../components/catalogue';
import Nav from '../components/nav';
import NoData from '../components/noData'
import Loading from '../components/loading'
import Popver from '../components/popver'
import Order from '../components/order'
import Login from './login'

if (typeof window !== 'undefined') {
  require('../../sass/reading.scss');
  var POP = require('../modules/confirm');
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

const setter = function() {
    const _this = this;
    return {
        toggleSetting() {
            if (!_this.state.audio)
                _this.setState({ show_settings: !_this.state.show_settings })
            else 
                _this.setState({ show_audioSetting: !_this.state.show_audioSetting })
        },
        setVoice(n) {
            let set = _this.state.audio_style;
            set.voice = n;
            _this.setState({ audio_style: set });
            _this.setter.startReading.bind(this)();
        },
        setSpeed(n) {
            let set = _this.state.audio_style;
            set.speed = n;
            _this.setState({ audio_style: set });
            _this.setter.startReading.bind(this)();
        },
        setFont(n) {
            let style = _this.state.style;
            style.fontsize = n;
            storage.set('style', style);
            _this.setState({ style: style })
        },
        setChapterList() {
            _this.setState({ show_chapters: !_this.state.show_chapters, show_settings: false});
        },
        setSex() {
            let set = _this.state.audio_style;
            set.sex = set.sex ? 0: 1;
            set.paused = false;
            _this.setState({ audio_style: set });
            _this.setter.startReading.bind(this)();
        },
        stop() {
            try{
                 this.refs.audio.pause();
                 _this.setState({
                    audio: false
                 });
            } catch(e){}
        },
        togglePlay() {
             try{
                 if (_this.state.audio_style.paused) 
                    this.refs.audio.play();
                 else 
                    this.refs.audio.pause();
                 let set = _this.state.audio_style;
                 set.paused = !set.paused
                 _this.setState({ audio_style: set });
            } catch(e){}
        },
        setStyle(e) {
            const id = e.target.dataset.id;
            let style = _this.state.style;
            style.style = id;
            storage.set('style', style);
            _this.setState({ style: style })
        },
        setChapter(chapterid) {
            if (!chapterid) { return; }
            _this.setState({ show_settings: false });
            browserHistory.replace({ pathname: location.pathname.replace(/reading\/chapter\.(\d+)\.(\d+)/, ($1, $2, $3) => `reading/chapter.${$2}.${chapterid}`)});
        },
        cutContent(content) {
            const passages = content.replace(/&amp;/g, '&').replace(/(&#160;){2,4}|\s{2,4}/g, '<br/>')
                            .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&nbsp;/g, '').replace(/&middot;/g, '·').replace(/<img[^>]+>/g, '')
                            .split(/<br\s*\/?>/);
            for (let i = passages.length-1; i >= 0; i--) {
                if (!passages[i]) passages.splice(i,true);
            }
            return passages;
        },
        toggleFont() {
            _this.setState( {show_font: !_this.state.show_font} )
        },
        startReading() {
            if (!_this.access_token) return;
            const len = _this.content.length;
            const cuid = 'ewfwiiw883';
            let i = 0;

            this.refs.audio.onended = () => {
                i++;
                if (!_this.content[i]) {
                    _this.setState({ audio_node: 0 });
                    return;
                }
                start.bind(this)();
            }
            function start() {
                _this.setState({ audio_node: i });
                this.refs.reading && this.refs.reading.scrollIntoView({ behavior: 'smooth' })
                const params = `lan=zh&tok=${_this.access_token}&ctp=1&cuid=${cuid}&spd=${_this.state.audio_style.speed}&pit=5&vol=${_this.state.audio_style.voice}&per=${_this.state.audio_style.sex}&tex=${_this.content[i]}`;
                this.refs.audio.src = `http://tsn.baidu.com/text2audio?${encodeURI(encodeURI(params))}`;
                this.refs.audio.play();
            }
            start.bind(this)();
            _this.setState({ show_settings: false, audio: true })
        }
    }
};

class Readinger extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            show_settings: false,
            style: {
                fontsize: 3,
                style: 1
            },
            desc: false,
            audio: false,
            audio_node: 0,
            audio_style: {
                voice: 5,
                speed: 5,
                sex: 0,
                paused: false
            },
            show_chapters: false,
            show_font: false,
            show_audioSetting: false,
            show_order: true,
            loading: false
        };
        this.mixins = mixins.bind(this)();
        this.setter = setter.bind(this)();
        this.getAccess = this.getAccess.bind(this);
        this.getMenu = this.getMenu.bind(this);
        this.setOrder = this.setOrder.bind(this);
        this.getData = this.getData.bind(this);
        this.callback = this.callback.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.doOrder = this.doOrder.bind(this);
        this.getAJAXDate = this.getAJAXDate.bind(this);
        this.gotoIntroduce = this.gotoIntroduce.bind(this);
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.props[this.props.params.chapterId] !== nextProp[nextProp.params.chapterId]
        || this.props[`catalogue`] !== nextProp[`catalogue`]
        || this.state !== nextState
    }
    getMenu() {
        this.props.dispatch(this.mixins.fetchList(`catalogue.${this.book_id}`, true));
    }
    setOrder() {
        this.setState({ desc: !this.state.desc });
    }
    cancelOrder() {
        this.setState({ show_order: false });
    }
    getAccess(){
        const baidu = storage.get('baidu');
        const now = new Date().getTime();
        const end = baidu.time + baidu.expires_in;
        if ( baidu.access_token && end > now  ) {
            this.access_token = baidu.access_token;
            return;
        }
        axios({
            method: 'GET',
            url: '/baiduClientCredentials',
            responseType: 'json'
        }).then((res)=>{
            if (res.data.code)  return;
            this.access_token  = res.data.access_token;
            storage.set('baidu',{
                access_token: res.data.access_token,
                expires_in: res.data.expires_in*1000,
                time: new Date().getTime()
            });
      });
    }
    doOrder() {
        this.mixins.fetchRequest('order', { chapter_id: this.chapter_id }, (res) => {
            POP._alert('支付成功');
            this.setState({ show_order: false, loading: true });
            this.props.dispatch(this.mixins.fetchList(this.mixins.getProps())).then((res)=>{
                  this.setState({ loading: false });
            });
        }, (err) => {
            POP._alert('支付失败');
        })
    }
    getAJAXDate() {
        if (this.state.loading) return;
        this.setState({loading: true})
        const key = this.props.params.chapterId;
        this.props.dispatch(this.mixins.fetchList(key)).then((res)=>{
            this.setState({loading: false})
            this.callback(this.props[key]);
        });
    }
    visibilityHandle() {

    }
    getData() {
        const key = this.props.params.chapterId;
        const data = this.props[key];
        if (this.mixins.isRouter()) {
            if (!data) {
                this.getAJAXDate();
            } else 
                this.callback(data);
        }
    }
    gotoIntroduce(){
        const reger = /book\/introduce(.*)/;
        const intro = `book/introduce.${this.book_id}`;
        let path = location.pathname;
        if (reger.test(path)) {
            path = path.replace(reger, intro);
        } else {
            path = path.replace(/reading\/chapter(.*)/, intro);
        }
        browserHistory.push(path)
    }
    callback(res) {
        this.data = res;
        if (res.code === 302) {
            Callback.setCallback('login', () => {
                location.reload();
            }, true);
        } else if (res.code === 304) {
            this.setState({ show_order: true });
            this.chapter_id = res.content.chapter_id;
        } else {
            Callback.execCallback('catalogue');
        }
    }
    componentDidMount() {
       this.getData();
       this.book_id = this.mixins.getParts()[1];
       this.getAccess();
       this.getMenu();
       this.setState( { style: Object.assign(this.state.style, storage.get('style')) });
    }
    componentWillUnmount() {
        this.props.dispatch(this.mixins.clearProps('catalogue'));
    }
    componentDidUpdate(nextProp) {
       if ( this.props.params.chapterId !== nextProp.params.chapterId ) {
            this.props.dispatch(this.mixins.clearProps(nextProp.params.chapterId));
            this.getData();
            return;
       }

       if (!this.props[this.props.params.chapterId]) this.getData();
    } 
    render() {
        let content,catalogue, loading,popver,data = this.props[this.props.params.chapterId], catalogue_data = this.props[`catalogue`];
        if (data) this.data = data;
        if (this.data) {
                const code = this.data.code;
                if (code === 200) {
                    let chapter =  this.setter.cutContent(this.data.content.content);
                    chapter.unshift(this.data.content.name);
                    this.content = chapter;
                    content = <Reading gotoIntroduce={this.gotoIntroduce} setter={this.setter} allState={this.state} content={this.content} data={this.data.content}  goBack={this.mixins.goBack} />
                } else if (code === 302) {
                    content = <Login />;
                } else if (code === 303) {
                    content = <Order data={ this.data.content } didRecharge = {this.getAJAXDate} route={this.props.route} />
                } else if (code === 304) {
                    content = <Reading gotoIntroduce={this.gotoIntroduce} setter={this.setter} allState={this.state} content={this.content || []} data={this.data.content}  goBack={this.mixins.goBack} />
                    popver = this.state.show_order ? <Popver btn_success={this.doOrder} fee={this.data.content.fee} cancel={this.cancelOrder} /> : null;
                } else  content = <NoData type={code == 402 ? 'UFO' : 'emptyBook'} />
        } 

        if (!data || this.state.loading) loading = <Loading />;

        if ( catalogue_data )  {
            catalogue = <Catalogue currentId={this.mixins.getId()}  reset={this.setter.setChapterList} data = {catalogue_data.content} desc={this.state.desc} frontPath={`${this.mixins.getFrontPath()}/reading/chapter.${this.book_id}.`} />
        }

        return ( < div className={`g-body g-reading font-${this.state.style.fontsize} style-${this.state.style.style}`}>
                {content}
                { loading }
                { popver }
                <section className={'m-chapter' + ( this.state.show_chapters ? ' active' : '')}>
                    <div className='u-hideChapterlist' onClick={this.setter.setChapterList}></div>
                    <div className='u-chapterlist'>
                        <div className="u-bookname f-ellipsis">
                                <span>目录</span>
                                <div onClick={ this.setOrder }>
                                    <span>{!this.state.desc ? ' 顺序' : '倒序'}</span>
                                    <span className={"iconfont icon-paixu f-fr" + (!this.state.desc ? ' rev' : '')}></span>
                                </div>
                        </div>
                            {catalogue}
                    </div>
                </section>
              { this.props.children } 
            < /div>
        );
    }
}

export default connect(mapStateToProps)(Readinger)