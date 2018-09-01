import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../../modules/global';
import Img from '../img';

class Style4 extends React.Component { 
	render(){
		const { image_url, name, second_name, content_id, second_id } = this.props.data;

		return (	
				<Link to={GLOBAL.setHref(`reading/chapter.${content_id}.${second_id}`)} className = 'm-book-3 m-book-4'>
                                <p className='line-clamp title'>{ name }</p>
                                <p className='summary line-clamp'>{ second_name }</p>
			</Link>
			)
	}
}

export default Style4;