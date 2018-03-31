/**
 * Created by AndyWang on 2017/7/8.
 */
//获取商品规格组合
import * as types from './actionTypes';
import * as Util from '../common/Apis/Fetch';
import { Modal } from 'antd-mobile';
const alert = Modal.alert;
export let goToPay = (url,body,successCallback,FailCallBack)=> {
    return dispatch => {
        dispatch(showLoading(true));

        return Util.post(url,body,(response) => {
            console.log(response)
            dispatch(showLoading(false));
            if(response.status==0){
                successCallback(response.body);
                dispatch(receivePayResult(response.body))
            }else{
                alert('提示', response.msg, [
                    { text: '确定', onPress: () =>{}, style: 'default' },
                ]);
                FailCallBack(response.msg);
            }
        }, (error) => {
            alert('提示', '网络失败', [
                { text: '确定', onPress: () =>{}, style: 'default' },
            ]);
            FailCallBack(error);
            dispatch(showLoading(false))
        });
    }
};

let showLoading=(bool)=>{
    return{
        type:types.ORDER_IS_SHOW_LOADING,
        isShowLoading:bool
    }
};

let receivePayResult=(orderInfo)=>{
    return{
        type:types.RECEIVE_PAY_RESULT,
        orderInfo:orderInfo
    }
}
//获取默认地址
export let defaultAddress= (url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            console.log(response);
            if(response.status===0){
                if(response.body.listadress.length===0){
                    dispatch(defaultAddressData(null));
                }else {
                    for(let i=0;i<response.body.listadress.length;i++){
                        if(response.body.listadress[i].isdefault===1){
                            dispatch(defaultAddressData(response.body.listadress[i]));
                        }
                    }
                }
            }else {
                console.log("请求失败");
                dispatch(defaultAddressData(null));
            }
        }, (error) => {

        });
    }
};
//默认地址
export let defaultAddressData=(data)=>{
    return{
        type:types.SETTLEMENT_DEFAULT_ADDRESS,
        defaultAddress:data
    }
};
//选择地址
export let selectAddress=(data)=>{
    return{
        type:types.SETTLEMENT_SELECT_ADDRESS,
        selectAddress:data
    }
};

