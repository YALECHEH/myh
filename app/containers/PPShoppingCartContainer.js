/**
 * Created by nipeng on 2017/7/10.
 * 购物车container
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PPShoppingCartManage from '../views/PPShoppingCartManage/PPShoppingCartManage';
import * as ShoppingAction from '../actions/PPShoppingCartAction';


class PPShoppingCartContainer extends React.Component{
    render(){
        return(
            <PPShoppingCartManage {...this.props}/>
        )
    }
}


const mapStateToProps = (state) =>{
    const PPShoppingCartReducer = state.get('PPShoppingCartReducer').toJS();
    return {
        PPShoppingCartReducer
    };
};


const mapDispatchToProps = (dispatch) =>{
    const PPShoppingCartAction = bindActionCreators(ShoppingAction,dispatch);
    return{
        PPShoppingCartAction
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(PPShoppingCartContainer);






