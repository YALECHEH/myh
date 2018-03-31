/**
 * Created by chenmao on 2017/7/6.
 */
import * as types from './actionTypes';
import * as Util from '../common/Apis/Fetch';
import { Modal } from 'antd-mobile';
import { Toast, WhiteSpace, WingBlank, Button, Icon } from 'antd-mobile';
import React,{Component} from 'react';
const alert = Modal.alert;
export let showDialog = (result,type)=>{
    return {
        type:types.GET_GOOD_DETAILS,
        isShow:result,
        openType:type
    }
};

//请求商品详情
export let getGoodDetailsFromServer = (url,body,successCallback,FailCallBack)=> {
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post(url,body,(response) => {
            dispatch(showLoading(false));
            console.log('商品详情',response);
            if(response.status==0){
                successCallback(response.body.goodsDetail);
                dispatch(receiveGoodDetails(response.body.goodsDetail))
            }else{
                FailCallBack(response.msg);
            }
        }, (error) => {
            FailCallBack(error);
            dispatch(showLoading(false))
        });
    }
};

let showLoading=(bool)=>{
    return{
        type:types.IS_SHOW_LOADING,
        isShowLoading:bool
    }
};

export let receiveGoodDetails=(goodInfo)=>{
    return{
        type:types.RECEIVE_GOOD_DETAILS,
        goodInfo:goodInfo
    }
};

//获取商品规格组合价格
export let getGoodSpecificationPrice = (url,body,successCallback,FailCallBack)=> {
    return dispatch => {
        dispatch(showLoading(true));

        return Util.post(url,body,(response) => {
            dispatch(showLoading(false));
            if(response.status==0){
                successCallback(response.body);
                dispatch(receiveGoodSpecification(response.body))
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

let receiveGoodSpecification=(data)=>{
    return{
        type:types.RECEIVE_GOOD_SPECIFICATION,
        goodSpecification:data
    }
};

//加入购物车
export let addCart = (url,body,successCallback,FailCallBack)=> {
    return dispatch => {

        dispatch(showLoading(true));

        return Util.post(url,body, (response) => {
            console.log(response)
            dispatch(showLoading(false));
            if(response.status==0){
                successCallback();
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

let showAlert = (int_Status,status)=>{
    let alertStr = "";
    if (int_Status == 1){
        if(status==0){
            alertStr = "已收藏";
        }else {
            alertStr = "收藏失败";
        }
    }else {
        if(status==0){

            alertStr = "已取消收藏";
        }else {
            alertStr = "取消收藏失败";
        }

    }
    return alertStr;
}
// 收藏/取消商品  body={userId:用户id,goodsId:商品id,isCollection:收藏操作:1收藏 0取消} url =/goods/collectGoods
export let collectOrcancel = (url,body,successCallback,failCallBack)=>{
    return dispatch =>{
        dispatch(showLoading(true));
        return Util.post(url,body,(response)=>{
            dispatch(showLoading(false));
            if (response.status == 0){
                console.log(response)
                successCallback()
            }else {
                failCallBack()
            }
            Toast.info(<div className="alertStyleS">{body.isCollection===1?<img src={require('../images/goodDetails/collectIcon.png')}/>:<img src={require('../images/goodDetails/canceCollectIcon.png')}/>}<p>{showAlert(body.isCollection,response.status)}</p></div>, 1)

        },(error) =>{
            failCallBack(error)
            dispatch(showLoading(false));
        });
    }
};

export let getGoodTypeServer = (url,body,successCallback,failCallBack)=>{
    return dispatch =>{
        return Util.post(url,body,(response)=>{
            if (response.status == 0){
                dispatch(getGoodType(response.body));
                successCallback(response.body)
            }else {
                failCallBack(response.msg)
            }
        },(error) =>{
            failCallBack(error)
        });
    }
};

let getGoodType=(data)=>{
    return{
        type:types.GET_GOODTYPE_SERVER,
        grayArr:data
    }
};



