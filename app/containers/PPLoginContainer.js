/**
 * Created by nipeng on 2017/7/8.
 * 登陆container
 */


import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PPLoginManage from '../views/PPLoginManage/PPLoginManage';
import * as LoginAction from '../actions/PPLoginAction';


class PPLoginContainer extends React.Component{
    render(){
        return (
            <PPLoginManage {...this.props}/>
        )
    }
}


const mapStateToProps = (state) =>{
    const PPLoginReducer = state.get('PPLoginReducer').toJS();
    return {
        PPLoginReducer
    };
};


const mapDispatchToProps = (dispatch) =>{
    const PPLoginAction = bindActionCreators(LoginAction,dispatch);
    return{
        PPLoginAction
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(PPLoginContainer)





