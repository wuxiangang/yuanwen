import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';

class Introduce extends React.Component { 
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.data !== nextProp.data 
        || this.props.collect_status !== nextProp.collect_status;
    }
    render() {
        const { category_id, author_id, book_id, first_chap_id, author_name, book_name, book_synopses, image_url , serial_status, word_size, c_click, category_name, last_chap_id} = this.props.data;
        const collect_status = this.props.collect_status ? this.props.collect_status: !!this.props.data.collect_status;
        const addBtn = !collect_status ? 
        <a className='btn ui-blue-light f-fr' onClick={this.props.addShelf}>加入书架</a> : 
        <a className='btn ui-blue-light f-fr select'>已加入书架</a>;

        return ( < div className="m-introduce">
           	  <div className='m-introduce-block'>
                     <div>
                         <img className="m-img-100" src = 'http://cover.yuanwen.org/default/cover.jpg'  data-src={ image_url } />
                         <section className="m-detail">
                            <p className="line-clamp">{ book_name }</p>
                            <p><span>作者</span><Link to ={GLOBAL.setHref(`user/author.${author_id}`)} className='c-blue'>{ author_name }</Link></p>
                            <p><span>状态</span><span>{ serial_status }</span></p>
                            <p><span>字数</span><span>{ Math.floor(word_size/10000) }万</span></p>
                            <p><span>点击</span><span>{ Math.floor(c_click/10000) }万</span></p>
                            <p><span>分类</span><Link className='c-blue' to ={`/category?tid=${category_id}`}>{ category_name }</Link></p>
                         </section>
                     </div>
                     <div className="m-action">
                        <Link to={GLOBAL.setHref(`reading/chapter.${book_id}.${first_chap_id}`)} className="btn ui-blue">立即阅读</Link>
                    { addBtn }
                </div>
            </div>
            <div className="m-breif">
                <section className="breif">{book_synopses}</section>
                <section className="now">
                    <div><span className='i-circle'></span><span className="u-title">最近更新</span><span className="u-time f-fr">{this.props.data.last_chap_date}</span></div>
                    <Link className={ (!this.props.data.last_chap_vip ? '' : 'vip') + " last-chap c-blue" } to={GLOBAL.setHref(`reading/chapter.${book_id}.${last_chap_id}`)}>
                            <p><span className='line-clamp'>{this.props.data.last_chap_name}</span></p>
                            <span className="iconfont icon-suo lock f-fl"></span>
                            <span className="iconfont icon-right lock f-fr"></span>
                    </Link>
                    <Link className="btn ui-blue-light u-full-btn" to={ GLOBAL.setHref(`menu/catalogue.${book_id}`) }>查看目录</Link>
                </section>
            </div>
        < /div>
        );
    }
}

export default Introduce;