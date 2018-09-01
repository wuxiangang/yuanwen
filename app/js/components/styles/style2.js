import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../../modules/global';
import Img from '../img';

class Style2 extends React.Component { 
	render(){
		const { image_url, name, brief, author_name, content_id } = this.props.data;

		return (	
				<Link to={GLOBAL.setHref("book/introduce."+content_id)} className = 'm-book-2'>
			         <Img src={image_url} />
                           <p className='line-clamp-2 title'>{ name }</p>
                           <p className='author'>{ author_name }</p>
			</Link>
			)
	}
}

export default Style2;