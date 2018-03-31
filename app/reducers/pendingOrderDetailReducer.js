/**
 * author: cheng.zhang
 * date: 2017/7/15
 * desc：待付款
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState = Map({
    isQuitOrderSuccess: true,
    isShowLoading: true,
    isShowMessage: true,
    timeOut: false,
    pendingData: null
})

let pendingOrderDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.HOMEPAGE_IS_SHOW_LOADING:
            return state.merge({
                isShowLoading: action.isShowLoading
            })

        case types.GET_DATA_SUCCESS:
            return state.merge({
                pendingData: action.serverData,
                isShowMessage: action.serverData.remark == null || action.serverData.remark == '',
            })

        case types.QUIT_ORDER_STATUS:
            return state.merge({
                isQuitOrderSuccess: action.isQuitSuccess
            })

        default:
            return state
    }
}

export default pendingOrderDetailReducer
