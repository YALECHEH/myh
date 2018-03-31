/**
 * Created by nipeng on 2017/7/12.
 * 订单已完成reducer
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState = Map({
    orderDatailsList:null,
    isShowLoading:false
})


let PPOrderDetailsReducer = (state = initialState,actions)=>{
    switch (actions.type){
        case types.SETORDERDEATAILSLIST:{
            return state.merge({
                orderDatailsList:actions.orderDatailsList
            })
        }
        case types.ORDERDETAILSLOADING:{
            return state.merge({
                isShowLoading:actions.isShowLoading
            })
        }
        default:
            return state;
    }
}

export default PPOrderDetailsReducer;




