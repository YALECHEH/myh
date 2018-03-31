/**
 * Created by AndyWang on 2017/7/8.
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import Payment from '../views/payment/payment';
import * as action1Creators from '../actions/paymentAction.js';

class AppContainer extends React.Component {
    render() {
        return (
            <Payment {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    const  Payment  = state.get('Payment').toJS();
    return {
        Payment
    };
};

const mapDispatchToProps = (dispatch) => {
    const PaymentActions = bindActionCreators(action1Creators, dispatch);
    return {
        PaymentActions
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(AppContainer);