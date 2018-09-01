import React from 'react';

class Img extends React.Component { 
	shouldComponentUpdate(nextProp, nextState) {
        return this.props.src !== nextProp.src
        || this.props.update !== nextProp.update;
    	}
	render(){
		const { src } = this.props,time = this.props.update ? new Date().getTime() : '';
		const default_url = `http://cover.yuanwen.org/default/cover.jpg?${time}`,cls = time;
		return <img src={ default_url } data-src ={ src } className={cls} />
	}
}

export default Img;