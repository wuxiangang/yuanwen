import React from 'react';
import SetterLine from './settingline';

class Reading extends React.Component { 
    render() {
        const { name, chapter_name } = this.props.data;
        const  { allState, setter, content } = this.props;

        return ( 
            <div>
                <div className={'g-scroll m-reading' + ( allState.show_settings ? ' active' : '')} onClick={setter.toggleSetting}>
                    
                    {
                        content.map((v,i)=>{
                            return <div key={i} className={'u-chapter-content' + ( (allState.audio && allState.audio_node === i) ? ' active' : '') } ref={(allState.audio && allState.audio_node === i) ? 'reading' : ''} dangerouslySetInnerHTML={{ __html: v }} />
                        })
                    }
                    <a className={'u-chapter-btn' + (!content.length ? ' f-hide' : '') } onClick={setter.setChapter.bind(null, this.props.data.nextChapterId)}>点击阅读下一章</a>
                < /div>

                <div className={ 'm-setting' + ( (allState.show_audioSetting && allState.audio) ? ' active' : '')}>
                    <section className="m-middle" onClick={setter.toggleSetting}></section>
                    <section className="u-ttsSetting ">
                        <div className="m-slidBar">
                            <button className="label">音量</button>
                            <SetterLine size={allState.audio_style.voice} action={setter.setVoice.bind(this)} arr={ [1,3,5,7,9] }/>
                        </div>
                        <div className="m-slidBar">
                            <button className="label">语速</button>
                            <SetterLine size={allState.audio_style.speed} action={setter.setSpeed.bind(this)} arr={ [1,3,5,7,9] }/>
                        </div>
                        <div className="btnWrap">
                            <button type="button" className={"u-voiceBtn iconfont" + ( (allState.audio_style.sex === 1) ? ' icon-male' :  ' icon-female')} onClick={setter.setSex.bind(this)}></button>
                            <button type="button" className={"u-pauseBtn iconfont" + (allState.audio_style.paused ? ' icon-play' :  ' icon-pause') } onClick={setter.togglePlay.bind(this)}></button>
                            <button type="button" className="u-quitTtsBtn iconfont icon-quit"  onClick={setter.stop.bind(this)}></button>
                        </div>
                    </section>
                </div>


                <div className={ 'm-setting' + ( (allState.show_settings && !allState.audio) ? ' active' : '')}>
                    <section className="m-setting-top u-setting">
                        <span className="iconfont icon-left f-fl" onClick={ this.props.goBack}></span>
                        <span className="title line-clamp f-fl">{ name || chapter_name }</span>
                        <span className="iconfont icon-wendang f-fr" onClick={this.props.gotoIntroduce}></span>
                    </section>
                    <section className="m-middle" onClick={setter.toggleSetting}></section>
                    <section className={'u-setting u-settings-font' + ( allState.show_font ? '' : ' f-hide')}>
                          <div className="setting-fontsize setting-font-line m-slidBar f-clearfix">
                            <span className="iconfont icon-font label f-fl" />
                            <SetterLine size={allState.style.fontsize} action={setter.setFont} arr={ [1,2,3,4,5] }/>
                        </div>
                        <div className="setting-bg setting-font-line flex-box">
                         {
                                [1, 2, 3, 4, 5].map((dataid, i) => (
                                      <div className="item flex" key={i}>
                                        <div className={`active-border${allState.style.style == dataid ? ' active' : ''}`} data-id={dataid} onClick={setter.setStyle} />
                                      </div>
                                    ))
                          }
                        </div>
                    </section>
                    <section><button type="button" className="u-playBtn iconfont icon-erji" onClick={ setter.startReading.bind(this) }></button></section>
                    <section className="flex-box m-setting-bottom u-setting">
                        <a className="u-settingitem flex" onClick={setter.setChapter.bind(null, this.props.data.preChapterId)}>
                            <span className="iconfont icon-up"></span>
                            <span>上一章</span>
                        </a>
                        <a className="u-settingitem flex"  onClick={setter.setChapterList}>
                            <span className="iconfont icon-mulu"></span>
                            <span>目录</span>
                        </a>
                        <a className="u-settingitem flex"  onClick={setter.toggleFont}>
                            <span className="iconfont icon-lanmu-copy"></span>
                            <span>设置</span>
                        </a>
                        <a className="u-settingitem flex"  onClick={setter.setChapter.bind(null, this.props.data.nextChapterId)}>
                            <span className="iconfont icon-down"></span>
                            <span>下一章</span>
                        </a>
                    </section>

                    <section>
                        <audio id="audio" ref="audio"></audio>
                    </section>
                </div>
        </div>
        );
    }
}

export default Reading;