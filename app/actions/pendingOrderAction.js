/**
 * author: cheng.zhang
 * date: 2017/7/15
 * desc：待付款
 */
import * as types from './actionTypes';
import * as Util from '../common/Apis/Fetch'

export let getPendingDetail = (userId, orderId) => {
    let params = {
        userId,
        orderId,

    }
    return dispatch => {
        dispatch(showLoading(true))
        return Util.post('/webOrder/getWebOrderDetail', params, (data) => {
            console.log(data)
            dispatch(showLoading(false))
            if (data.returnStatus === 0) {
                dispatch(getDataSuccess(data));
            } else {
                console.log(data.message);
            }
        }, (err) => {
            dispatch(showLoading(false));
            console.log(err);
        })
    }
}

export let quitOrder = (userId, orderId, operation) => {
    let params = {
        userId,
        orderId,
        operation
    }

    return dispatch => {
        dispatch(showLoading(true));
        return Util.post('webOrder/cancelOrDeleteOrder', params, (data) => {
            console.log(data)
            dispatch(showLoading(false));
            if (data.status === 0) {
                dispatch(quitOrderStatus(true));
            } else {
                dispatch(quitOrderStatus(false));
            }
        }, (err) => {
            dispatch(showLoading(false));
            dispatch(quitOrderStatus(false));
        })
    }
}

//加载动画
let showLoading = (isShow) => {
    return {
        type: types.HOMEPAGE_IS_SHOW_LOADING,
        isShowLoading: isShow
    }
};

//获取数据成功
let getDataSuccess = (data) => {
    console.log('----getDataSuccess------->',data)
    return {

        type: types.GET_DATA_SUCCESS,
        serverData: data
    }
}

//取消订单是是否成功
let quitOrderStatus = (isSuccess) => {
    console.log('---------quitOrderStatus----',isSuccess)
    return {
        type: types.QUIT_ORDER_STATUS,
        isQuitSuccess: isSuccess
    }
}