import React from 'react';

class Page extends React.Component { 
    render() {
           // const totalPage = 10,pageNumber=8;
            const {totalPage , pageNumber} = this.props;
            let page_content, next, prev;
            let page_arr = [];

            if (pageNumber !== 1) prev = <a  onClick={this.props.ajaxAnyc.bind(null, pageNumber-1)}>上一页</a>;
            if (pageNumber !== totalPage) next = <a  onClick={this.props.ajaxAnyc.bind(null, pageNumber+1)}>下一页</a>;

            if ( totalPage < 5 ) {
                for (let i = 1; i <= totalPage; i++) {
                    page_arr.push(i);
                }
            } else {
                if ( pageNumber < 4 ) {
                    page_arr = [1,2,3,4,null,totalPage];
                } else if (pageNumber>= (totalPage-2)) {
                    page_arr = [1,null,totalPage - 3, totalPage -2, totalPage-1, totalPage];
                } else {
                    page_arr = [1,null,pageNumber - 1, pageNumber, pageNumber+1, null, totalPage];
                }
            }

            page_content = (<div>
                { prev }
                {
                    page_arr.map((v,i)=>{
                        if(!v) return <a key={i}>...</a>
                       return  <a key={i} className={ v === pageNumber ? 'focus' : '' } onClick={this.props.ajaxAnyc.bind(null, v)}>{v}</a>
                    })
                }
                { next }
            </div>);

           return (<section className="m-page">
                    { page_content }
                </section> )
    }
}

export default Page;