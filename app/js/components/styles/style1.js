import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../../modules/global';
import Img from '../img';

class Style1 extends React.Component { 
	render(){
		const { image_url, name, brief, author_name, content_id } = this.props.data;

		return (	<div className="f-border-box">
				<Link to={GLOBAL.replaceHref("book/introduce.", content_id)} className = 'm-book-list'>
			         <Img src={image_url} />
                                        <div className='f-detail'>
                                            <p className='line-clamp-2 title'>{ name }</p>
                                            <p className='author'>{ author_name }</p>
                                            <p className='summary line-clamp-3'>{ brief }</p>
                                        </div>
			</Link>
			</div>
			)
	}
}

export default Style1;