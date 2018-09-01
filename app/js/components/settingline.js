import React from 'react';

class SettingLine extends React.Component { 
	render(){
		const { size, action, arr } = this.props;
		             return            (
		             	<div className="u-slidBar f-clearfix f-fr">
                              {
                                    arr.map((dataid, i) => (<div key={i}  data-font={dataid} className={`f-fl${size >= dataid ? ' active' : ''}`} onClick={ action.bind(this, dataid) }>
                                          {dataid === 1 ? (<span className="circle" data-font={dataid} />) : null}
                                          <span className="line" data-font={dataid} />
                                          <span className="circle" data-font={dataid} />
                                            </div>))
                                }
                            </div>
                            )
	}
}

export default SettingLine;