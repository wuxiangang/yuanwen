import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';

import Callback from '../modules/callback';

// class CatalogueItem extends React.Component { 
// 	render(){
// 		const { chapters, vol_title } = this.props.data;
// 		const { frontPath } = this.props;

// 		return (
// 			<section className='chapterlist'>
// 				<div className='u-chapter-title'>{ vol_title }</div>
// 				<div className='chapter-box'>
// 				{
// 					chapters.map((v,i) => {
		
// 						return (
// 								<Link  className={'chapter f-clearfix line-clamp' + (v.vip_status ? ' lock' : '')} to={`${frontPath}${v.chap_id}`}  activeClassName="active" key={ i }>
// 									{ v.chap_name } 
// 								</Link>
// 							)
// 					})
// 				}
// 				</div>
// 			</section>
// 			)
// 	}
// }


// class Catalogue extends React.Component { 
//    shouldComponentUpdate(nextProp, nextState) {
//         return this.props.data !== nextProp.data
//         || this.props.desc !== nextProp.desc;
//      }
// 	render(){
// 		const { desc, data, frontPath } = this.props;
// 		let list = JSON.parse(JSON.stringify(data));

// 		let tlist = [];

// 		for (let j = 0;j < data.length;j++) {
// 			let first = { chap_name: data[j].vol_title};
// 			tlist.push(first);
// 			tlist = tlist.concat(data[j].chapters);
// 		}

// 		if (desc) {
// 			list.reverse();
// 			for (let i = 0; i < list.length; i++){
// 				list[i].chapters.reverse();
// 			}
// 		}

// 		return (
// 				<section>
// 					{
// 						list.map((v,i) => {
// 							return (
// 								<CatalogueItem data={v} key={i} frontPath={frontPath} />
// 								)
// 						})
// 					}
// 				</section>
// 			)
// 	}
// }


class Catalogue extends React.Component { 
	constructor(props) {
        super(props);
        this.setHref = this.setHref.bind(this);
        this.iscrollInit = this.iscrollInit.bind(this)
        this.addClass = this.addClass.bind(this);
        this.visibilityHandle = this.visibilityHandle.bind(this);
        this.removeClass = this.removeClass.bind(this)
    }
   shouldComponentUpdate(nextProp, nextState) {
        return this.props.data !== nextProp.data
        || this.props.currentId !== nextProp.currentId
        || this.props.desc !== nextProp.desc;
     }
     addClass(el, cls) {
     	 el.className = el.className + ' ' + cls;
     }
     removeClass(el, cls) {
     	 if (el.className.indexOf(cls)<0) return;
     	 el.className = el.className.replace(cls, '');
     }
     clsSet(){
     	 const li = document.querySelectorAll('.chapter');
     	 Array.prototype.slice.call(li).forEach((v, i) => {
     	 	let cls = v.className, id = v.dataset.id;
     	 	if (/active/.test(cls)) this.removeClass(v, 'active');
     	 	if ( id == this.props.currentId ) this.addClass(v, 'active');
     	 });
     }
    setHref(e) {
    	const el = e.target;
    	const id = el.dataset.id;
    	if (!id) return;
    	Callback.setCallback('catalogue', (e) => {
    		this.removeClass(el, 'lock');
    	});
    	this.props.reset();
    	const href =`${this.props.frontPath}${id}`;
	browserHistory.replace(href);
    }
    iscrollInit() {
    	this.myScroll && this.myScroll.destroy();
    	this.myScroll = new this.IScroll('#wrapper', {
	        mouseWheel: true,
	        click: true,
	        infiniteElements: '#scroller .chapter',
	        infiniteLimit: this.list.length,
	        dataset: requestData,
        	  dataFiller: updateContent,
	         cacheSize: 10000
	      });

    	     let _this = this;
    	      function requestData (start, count) {
		    setTimeout(function(){
		    	  const data = _this.list;
		        _this.myScroll.updateCache(start, data);
		    },0)
		 };

		function updateContent (el, data) {
		   if(!data) return;
		   if (data.chap_id) el.dataset.id = data.chap_id;
                           else el.dataset.id = '';
		   if (data.chap_id == _this.props.currentId)
		   	_this.addClass(el, 'active')
		   else
		   	 _this.removeClass(el, 'active')
		   if (data.is_lock === 1) {
		   	_this.removeClass(el, 'lock');
		   	_this.addClass(el, 'lock');
		   } else _this.removeClass(el, 'lock');
		   el.innerHTML = data.chap_name;
		   _this.myScroll.refresh();
		}

    }
    visibilityHandle() {
    	window.location.reload();
    }
    componentDidMount(){
    	require.ensure([], (require) => {
           this.IScroll = require('../modules/iscroll-infinite.js');
           this.iscrollInit();
    	   });
    	document.addEventListener('visibilitychange', this.iscrollInit, false);
    }
    componentWillUnmount() {
        document.removeEventListener('visibilitychange', this.iscrollInit, false);
    }
    componentDidUpdate(nextProp) {
    	if (this.props.desc !== nextProp.desc) { this.iscrollInit(); return} ;
    	this.clsSet();
    }
	render(){
		const { desc, data, frontPath } = this.props;
		let length = 30;

		this.list= [];

		for (let j = 0;j < data.length;j++) {
			let first = { chap_name: data[j].vol_title};
			this.list.push(first);
			this.list = this.list.concat(data[j].chapters);
		}

		if (this.list.length < length) { length=this.list.length;}

		if (desc) {
			this.list.reverse();
		}

		return (
			                        <div className='u-scroll-y' id='wrapper' >
				<section className='chapterlist'>
				<ul className='chapter-box' id='scroller'>
				{
					this.list.slice(0,length).map((v,i) => {
						return (
								<li  className={`chapter f-clearfix`} key={ i } data-id={v.chap_id}  onClick={this.setHref}>
									{v.chap_name}
								</li>
							)
					})
				}
				</ul>
			</section>
			</div>
			)
	}
}

export default Catalogue;