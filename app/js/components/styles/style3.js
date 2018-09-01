import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../../modules/global';
import Img from '../img';

class Style3 extends React.Component { 
	render(){
		const { image_url, name, brief, author_name, content_id } = this.props.data;

		return (	
				<Link to={GLOBAL.setHref("book/introduce."+content_id)} className = 'm-book-3'>
                                <p className='line-clamp title'>{ name }</p>
                                <p className='summary line-clamp'>{ brief }</p>
			</Link>
			)
	}
}

export default Style3;