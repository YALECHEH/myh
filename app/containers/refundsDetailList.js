/**
 * Created by XiaYongjie on 2017/7/10.
 *
 */
import React from 'react';
import '../views/refunds/refundsDetailList.less';
import {Component} from "react";
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import RefundsDetailList from "../views/refunds/refundsDetailList";

import * as afterSalesAction1 from '../actions/afterSalesAction';


/**
 * 退货退款详情
 */

class refundsDetailList extends Component {
    render() {
        return (<RefundsDetailList {...this.prop}/>);
    }
}




class refundsDetailListContainer extends React.Component {
    render() {
        return (
            <RefundsDetailList {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    const  afterSale  = state.get('afterSale').toJS();
    return {
        afterSale
    };
};

const mapDispatchToProps = (dispatch) => {
    const afterSalesAction = bindActionCreators(afterSalesAction1, dispatch);
    return {
        afterSalesAction
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(refundsDetailListContainer);

