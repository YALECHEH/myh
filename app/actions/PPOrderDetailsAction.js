/**
 * Created by nipeng on 2017/7/12.
 * 订单已完成Action
 */

import * as types from './actionTypes';
import * as Util from '../common/Apis/Fetch';

/*订单已完成*/

export let setOrderDetailsList = (list)=>{
    return{
        type:types.SETORDERDEATAILSLIST,
        orderDatailsList:list
    }
}


// 获取订单详情post (已完成)
export let getOrderDetailsPost = (url,body)=> {
    return dispatch =>{
        dispatch(showLoading(true))
        return Util.post(url,body,(response) =>{
            console.log(2222222)
            if(response.returnStatus===0){

                dispatch(setOrderDetailsList(response))
            }else {
                alert(response.msg);

            }
        },(error)=>{

            dispatch(showLoading(false))

            alert("获取订单详情失败");
        })
    }
}

// 加载动画
let showLoading=(bool)=>{
    return{
        type:types.ORDERDETAILSLOADING,
        isShowLoading:bool
    }
}


export let deleteOrCancelOrderPost = (orderId,operation,userId,sucessCallBack,failCallBack)=> {//删除 取消 订单 operation (1:删除，2：取消)
    let body = {
        orderId:orderId,
        operation:operation,
        userId:userId,
    }
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post('/webOrder/cancelOrDeleteOrder',body,(response) => {
            dispatch(showLoading(false));
            if(response.status==0){
                sucessCallBack()

            }else{
                failCallBack()
                alert('提示', response.msg, [
                    { text: '确定', onPress: () =>{}, style: 'default' },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false))
            failCallBack()
            alert('提示', '网络失败', [
                { text: '确定', onPress: () =>{}, style: 'default' },
            ]);

        });
    }
};

//再次购买post
export let buyAgainWithOrder = (userId,goodsAry,callBack) => {
    // let body = {
    //     userId: userId,
    //     shopList:JSON.stringify(
    //         [
    //             {
    //                 "goodsId":888888,
    //                 "number":3,
    //                 "param1":4,
    //                 "param2":6,
    //                 "param3":7
    //             }
    //         ]
    //     )
    // }
    let shopList=[]
    for(let i=0;i<goodsAry.length;i++)
    {
        let dic={
            "goodsId":goodsAry[i].goodsId,
            "number":goodsAry[i].number,
            "param1":goodsAry[i].param1,
            "param2":goodsAry[i].param2,
            "param3":goodsAry[i].param3
        }
        shopList[i]=dic;
    }
    let body = {
        userId: userId,
        shopList:JSON.stringify(shopList)
    }

    return dispatch => {
        dispatch(showLoading(true));
        return Util.post('/shopping/insertshop', body, (response) => {
            dispatch(showLoading(false));
            console.log('订单详情', response);
            if (response.status == 0) {//加入购物车成功
                if(callBack)
                    callBack();
            } else {
                alert('提示', response.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: 'default'
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: 'default'
                },
            ]);
        });
    }
};






