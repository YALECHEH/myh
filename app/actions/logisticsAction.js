/**
 * author: cheng.zhang
 * date: 2017/7/13
 * desc：
 */
import * as types from './actionTypes';

import {post} from '../common/Apis/Fetch'

//从服务器获取物流信息（确认收货时调用）
export let getLogisticsInfoFromServer = (orderId) => {
    let param = {orderId};
    return dispatch => {
        dispatch(showLoading(true));
        return post('', param, (data) => {
            dispatch(showLoading(false));
            if (data.status == 0) {
                dispatch(getLogisticsInfo(data.body));
            } else {
                dispatch(showLoadingERROR(data.error))
            }
        }, (error) => {
            dispatch(showLoading(false));
            dispatch(showLoadingERROR('网络失败'));
        })
    }
}

//从第三方平台获取物流信息
export let getLogisticsInfoFromOther = (deliverCompanyNo, transportNo) => {
    let param = {deliverCompanyNo, transportNo};
    return dispatch => {
        dispatch(showLoading(true));
        return post('', param, (data) => {
            if (data.status == 0) {
                dispatch(getLogisticsInfo(data.body));
            } else {
                dispatch(showLoadingERROR(data.error))
            }
        }, (error) => {
            dispatch(showLoading(false));
            dispatch(showLoadingERROR('网络失败'));
        })
    }
}

export let getLogisticsInfo = (array) => {
    return {
        type: types.GETLOGISTICSINFO,
        logisticsInfo: array
    }
}

export const showLoading = (isShow) => {

    return {
        type: types.SHOWLOADING,
        isShowLoading: isShow
    }
}

export const showLoadingERROR = (errorMsg) => {
    return {
        type: types.SHOWLOADINGERROR,
        errorMsg: errorMsg
    }
}