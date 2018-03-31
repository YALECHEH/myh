/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from './actionTypes';
import * as Util from '../common/Apis/Fetch';

//请求商品列表接口
export let getHomepageList = (homePageList,url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            console.log("首页商品列表",response);
            if(response.status===0){
                successCallback(response.status,response.body.goods);

                let goods=response.body.goods;
                if(goods.length===0){

                }else {
                    for(let i=0;i<goods.length;i++){
                        homePageList.push(goods[i]);
                    }
                }
                dispatch(listOfGoods(homePageList));
            }else{

            }
        }, (error) => {

        });
    }
};
//加载动画
let showLoading=(bool)=>{
    return{
        type:types.HOMEPAGE_IS_SHOW_LOADING,
        isShowLoading:bool
    }
};
//首页列表数据
export let listOfGoods=(data)=>{
    return{
        type:types.HOMEPAGE_LIST_OF_GOODS,
        listOfGoods:data
    }
};