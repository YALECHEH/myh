/**
 * Created by chenmao on 2016/11/29.
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import GoodDetails from '../views/goodDetails/goodDetails.js';
import * as actionCreators from '../actions/goodDetailsAction.js';

class goodDetailsContainer extends React.Component {
    render() {
        return (
            <GoodDetails {...this.props}/>
        )
    }
}
const mapStateToProps = (state) => {
    // const { App }=state;不使用immutable,这个解构的App在rootReducer中绑定的，不使用combineReducer就直接赋值const App=state;
    const  goodDetails  = state.get('goodDetails').toJS();
    return {
        goodDetails
    };
};

const mapDispatchToProps = (dispatch) => {
    const goodDetailsActions = bindActionCreators(actionCreators, dispatch);
    return {
        goodDetailsActions
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(goodDetailsContainer);