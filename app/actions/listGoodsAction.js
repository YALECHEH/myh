/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from './actionTypes';
import * as Util from '../common/Apis/Fetch';

//请求获取单类商品列表
export let commodityList= (GoodsList,url,body,successCallback,failCallBack)=> {
    //GoodsList数组list
    return dispatch => {
        return Util.post(url,body, (response) => {
            console.log("csdcdscs",response);
            if(response.status===0){
                successCallback(response.body.goodsList.list);
               if(response.body.goodsList.list.length===0){

               }else {
                   for(let i=0;i<response.body.goodsList.list.length;i++){
                       GoodsList.push(response.body.goodsList.list[i]);
                   }
                   dispatch(commodityListData(GoodsList));
               }
            }
        }, (error) => {

        });
    }
};
//订单状态个数
export let commodityListData=(data)=>{
    return{
        type:types.COMMODITY_LIST,
        commodityList:data
    }
};