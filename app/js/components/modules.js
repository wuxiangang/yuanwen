import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';
import Swipe from '../modules/swipe';
import Style1 from './styles/style1';
import Style2 from './styles/style2';
import Style3 from './styles/style3';
import Style4 from './styles/style4';

class Module_4 extends React.Component { 
	render() {
	 const href = GLOBAL.skipHref(this.props.data);
	 const link = this.props.data.content_type ? <Link className="f-fr" to={ href.to } target={ href.target }>更多 ></Link> : null;
        return(
		<div className='m-block'>
			<h1 className='m-block-title'>
				<span>{ this.props.data.block_title }</span>
				{ link }
			</h1>
			<div>
		   {
		       this.props.data.list.map((v, i) => {
				return <Style1 key={i} data = {v} />
		       })
		   }
		   </div>
		</div>
		)
    }
}

class Module_3 extends React.Component { 
	render() {
        return(
		<div className='m-block u-style-3'>
		   {
		       this.props.data.list.map((v, i) => {
		       	const links = GLOBAL.skipHref(v);
				return (<Link key={i} to={ links.to } target = {links.target}>
					<img src={v.image_url} />
				</Link>)
		       })
		   }
		</div>
		)
    }
}

class Module_2 extends React.Component { 
	render() {
        return(
		<div className='m-block'>
			<h1 className='m-block-title'>
				<span>{ this.props.data.block_title }</span>
			</h1>
			<div>
		   {
		       this.props.data.list.map((v, i) => {
		       	if ( i < 3 )
					return <Style2 key={i} data = {v} />
				else
					return <Style3 key={i} data = {v} />
		       })
		   }
		   </div>
		</div>
		)
    }
}

class Module_1 extends React.Component { 
	constructor(props) {
        super(props);
        this.state = {
        	index: 0
        }
        this.initSwipe = this.initSwipe.bind(this)
    	}
	initSwipe () {
		this.swipe  && this.swipe.kill()
		this.swipe = new Swipe(this.refs.swiper, {
		      auto: 3000,
		      disableScroll: false,
        		stopPropagation: true,
		      callback: (i) => {
		      	this.setState({ index: i });
		      }
		});
	}
	componentDidMount() {
		this.initSwipe();
      }
      componentDidUpdate(nextProp) {
            if (this.props.data !== nextProp.data) {
			this.initSwipe();
			this.setState({ index: 0 });
		}
      }
	render() {

        return(
		<div ref="swiper" className="swipe">
			<div className="swipe-wrap">
		   {
		       this.props.data.list.map((v, i) => {
		       	const links = GLOBAL.skipHref(v);
				return (<Link key={i} to={ links.to } target = {links.target}>
							<img src={v.image_url} />
						</Link>)
		       })
		   }
		</div>
		<div className="swipe-button">
		{
			this.props.data.list.map((v, i) => {
				return <span key={i} className={ this.state.index === i ? 'active' : '' }></span>
		       })
		}
		</div>
	</div>
		)
    }
}

class Module_5 extends React.Component { 
	render() {
        return(
		<div className='m-block u-style-5'>
			<h1 className='m-block-title'>
				<span>{ this.props.data.block_title }</span>
				<Link className="f-fr" to={GLOBAL.setHref(`more/list.${this.props.data.block_id}.1`)}>更多 ></Link>
			</h1>
			<div>
		   {
		       this.props.data.list.map((v, i) => {
		       	if ( i < 1)
					return <Style1 key={i} data = {v} />
				else {
					return (<Link className="u-rank" to={GLOBAL.setHref(`book/introduce.${v.content_id}`)}  key={i} >
						<span className={`u-rank-icon u-rank-${i}`}>{ i+1 }</span>
						<span>{v.name}</span>
						</Link>)
				}
		       })
		   }
		   </div>
		</div>
		)
    }
}

class Module_6 extends React.Component { 
	render() {
        return(
		<div className='m-block'>
			<h1 className='m-block-title'>
				<span>{ this.props.data.block_title }</span>
			</h1>
			<div>
		   {
		       this.props.data.list.map((v, i) => {
				return <Style4 key={i} data = {v} />
		       })
		   }
		   </div>
		</div>
		)
    }
}

class Module_7 extends React.Component { 
	render() {
        return(
		<div className='m-block u-style-6 '>
			<h1 className='m-block-title'>
				<span>{ this.props.data.block_title }</span>
			</h1>
			<div>
		   {
		       this.props.data.list.map((v, i) => {
		       	const href = GLOBAL.skipHref(v);
				return (
					<div className="u-cate-box f-border-box " key={i}>
						<Link to={ href.to } target={ href.target } key={i}>{ v.name }</Link>
					</div>
					)
		       })
		   }
		   </div>
		</div>
		)
    }
}

class Modules extends React.Component { 
    shouldComponentUpdate(nextProp, nextState) {
		return this.props.data !== nextProp.data
    }
    render() {
        return(
	<div>
	   {
	       this.props.data.map((v, i) => {
	       	switch(v.style) {
	       	   case 1: 
	       		return <Module_1 key={i} data = {v} />
	       	   case 2: 
	       		return <Module_2 key={i} data = {v} />
	       	   case 3: 
	       		return <Module_3 key={i} data = {v} />
	       	   case 4: 
	       		return <Module_4 key={i} data = {v} />
	       	   case 5: 
	       	   	if (this.props.data.length-1 === i) 
	       	   		return (<div className="m-model-5" key={i}>
	       	   				<Module_5 data = {v} />
	       	   				<div className="u-ranking-banner"></div>
	       	   			</div>)
	       		return <Module_5 key={i} data = {v} />
	       	   case 6: 
	       		return <Module_6 key={i} data = {v} />
	       	   case 7: 
	       		return <Module_7 key={i} data = {v} />
	       	   default: 
	       	   	return null;
	       	}
	       })
	   }
	</div>
	)
    }
}


export default Modules