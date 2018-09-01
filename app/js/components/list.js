import React from 'react';
import Link from 'react-router/lib/Link';
import GLOBAL from '../modules/global';
import Style1 from './styles/style1';

class List extends React.Component { 
    shouldComponentUpdate(nextProp, nextState) {
		return this.props.data !== nextProp.data
    }
    render() {
        return(
	<div className='m-block'>
	   {
	       this.props.data.map((v, i) => {
	       	return <Style1 key={i} data = {v} />
	       })
	   }
	</div>
	)
    }
}
export default List;