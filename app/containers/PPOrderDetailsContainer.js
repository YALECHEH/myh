/**
 * Created by nipeng on 2017/7/12.
 * 订单已完成
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PPOrderDetailsManage from '../views/PPOrderDetailsManage/PPOrderDetailsManage';
import * as orderListAction from '../actions/orderListAction.js';
class PPOrderDetailsContainer extends React.Component{
    render(){
        return(
            <PPOrderDetailsManage {...this.props}/>
        )
    }
}

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

export default connect(mapStateToProps,mapDispatchToProps)(PPOrderDetailsContainer);




