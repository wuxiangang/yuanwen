import React from 'react';
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import mixins from '../modules/mixins';
import Modules from '../components/modules';
import Nav from '../components/nav';
import NoData from '../components/noData'
import Loading from '../components/loading'
import Footer from '../components/footer'

const data = (state) => {
    return state;
};

const mapStateToProps= createSelector(
    [data],
    (data) => {
        return data;
    }
)

class Maller extends React.Component { 
    constructor(props) {
        super(props);
        this.mixins = mixins.bind(this)();
    }
    shouldComponentUpdate(nextProp, nextState) {
        return this.props.children !== nextProp.children
        // || this.props[this.props.routeParams.page] !== nextProp[nextProp.routeParams.page]
        || this.props[this.mixins.getKey(this.props)] !== nextProp[this.mixins.getProps(nextProp)]
        // || this.props.params.page !== nextProp.params.page;
    }
    componentDidMount() {
       this.mixins.whetherFetch();
       this.refs.container && this.mixins.lazyLoad(this.refs.container);
    }
    componentDidUpdate(nextProps) {
       this.mixins.whetherFetch();
       this.refs.container && this.mixins.lazyLoad(this.refs.container);
       if (this.props.routeParams.page !== nextProps.routeParams.page) this.refs.container.scrollTop = 0;
    }
    render() {
        let content,data = this.props[this.mixins.getKey(this.props)], footer;
        if (data) {
                if (data.code === 200) {
                    content = <Modules data={data.content.blockList} />
                    footer = <Footer />;
                } else content = <NoData type={data.code == 402 ? 'UFO' : 'emptyData'} />
        } else {
          content = <Loading />
        }
        
        return ( < div className='g-body'>
            <div className='g-scroll'  ref="container">
              <Nav />
              { content }
              { footer }
              < /div>
              { this.props.children } 
            < /div>
        );
    }
}

export default connect(mapStateToProps)(Maller)