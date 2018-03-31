/**
 * Created by XiaYongjie on 2017/7/5.
 *
 */
/* tslint:disable:no-console */
import React from 'react';
import {connect} from 'react-redux';
import OrderTab from "../views/order/orderTab";
import {bindActionCreators} from "redux";
import * as orderListAction from '../actions/orderListAction.js';
class OrderTabList extends React.Component {
    render() {
        return (<OrderTab{...this.props}/>);
    }
};
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
export default connect(mapStateToProps, mapDispatchToProps)(OrderTabList);