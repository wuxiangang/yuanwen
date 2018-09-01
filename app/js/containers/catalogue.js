import React from 'react';
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import mixins from '../modules/mixins';
import Catalogue_1 from '../components/catalogue_1';
import NoData from '../components/noData'
import Header from '../components/header'
import Loading from '../components/loading'

const data = (state) => {
    return state;
};

const mapStateToProps= createSelector(
    [data],
    (data) => {
        return data;
    }
)

class Cataloguer extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            seq: true
        }
        this.mixins = mixins.bind(this)();
        this.toggleSeq = this.toggleSeq.bind(this)
    }
    toggleSeq() {
        this.setState( { seq: !this.state.seq } );
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        || this.state.seq !== nextState.seq
        || this.props[this.mixins.getKey(this.props)] !== nextProp[this.mixins.getProps(nextProp)]
    }
    componentDidMount() {
        this.mixins.whetherFetch();
    }
    componentDidUpdate() {
        this.mixins.isRouter() && this.mixins.whetherFetch();
    }
    render() {
        let content,data = this.props[this.mixins.getKey(this.props)];
        const right = <a className="f-fr u-font-btn" onClick={ this.toggleSeq }>{ this.state.seq ? '倒序' : '顺序' }</a>

        if (data) {
                if (data.code === 200) {
                    let props = JSON.parse(JSON.stringify(data.content));
                    if (!this.state.seq) {
                        props.reverse();
                        props.forEach((v, i) => {
                            v.chapters.reverse();
                        })
                    }
                    content = <Catalogue_1 data={props} book_id={this.mixins.getId()} skipAction = {this.mixins.skipUrl} />
                } else content = <NoData type={data.code == 402 ? 'UFO' : 'emptyBook'} />
        } else {
            content = <Loading />
        }
        
        return ( < div className='g-body'>
            <Header title='目录' route={this.props.route} right={right} />
            <div className='g-scroll g-scroll-common'>
              { content }
              < /div>
              { this.props.children } 
            < /div>
        );
    }
}

export default connect(mapStateToProps)(Cataloguer)