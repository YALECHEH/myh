/**
 * Created by XiaYongjie on 2017/7/8.
 *
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as orderListAction from '../actions/orderListAction.js';
import MyOrderDetail from "../views/order/myOrderDetail";

/**
 * 待收货详情
 */
class toBeReceived extends React.Component {
    render() {
        return (
            <MyOrderDetail {...this.props}/>
        );
    }
}
;
const mapStateToProps = (state) => {
    const OrderTab = state.get('OrderTab').toJS();
    return {
        OrderTab
    };
};

const mapDispatchToProps = (dispatch) => {
    const OrderListAction = bindActionCreators(orderListAction, dispatch);
    return {
        OrderListAction
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(toBeReceived);