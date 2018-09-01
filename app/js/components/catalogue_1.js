import React from 'react';

class Catalogue_1 extends React.Component { 
	shouldComponentUpdate(nextProp, nextState) {
		return this.props.data !== nextProp.data
	}
	render(){
		const { data, book_id } = this.props;
		return (
			<section className='m-catalogue'>
					{
						data.map((v, i) => {
							return (
								<div key={i}>
									<div className="m-catalogue-title">{v.vol_title}</div>
									<div className='m-catalogue-box'>
										{
											v.chapters.map((m, k) => {
												return (
													<a key={ k } onClick={ this.props.skipAction.bind(this, `reading/chapter.${book_id}.${m.chap_id}` ) } className={ m.vip_status === 'VIP' ? 'vip' : '' }>
														<span>{ m.chap_name }</span>
														<span className="iconfont icon-suo lock f-fr"></span>
													</a>
													)
											})
										}
									</div>
								</div>
								)
						})
					}
			</section>
			)
	}
}

export default Catalogue_1;