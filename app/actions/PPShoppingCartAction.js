/**
 * Created by nipeng on 2017/7/10.
 * 购物车action
 */

import * as types from './actionTypes';
import * as Util from '../common/Apis/Fetch';
import * as db from '../common/Apis/Utils';
import { Toast, WhiteSpace, WingBlank, Button, Icon } from 'antd-mobile';

/*购物车商品*/

export let setShoppingCartList =(list)=>{
    let tempAry = [];
    for (let i = 0;i<list.length;i++){
        let tempDic = list[i];
        tempDic['selected'] = false;
        tempAry.push(tempDic);
    }
    return{
        type:types.SETSHOPPINGCARTLIST,
        goodsList:tempAry,
        priceString:0,
        allSelectImag:false,
        numberShopCart:0
    }
}


/*购物车推荐*/
export let setRecommendList = (recommendList)=>{
    return{
        type:types.SETRECOMMENDLIST,
        recommendList:recommendList
    }
}

// 获取热门推荐
export let getHotShoppingCartPost = (url,body,sucessCallBack,failCallBack)=>{
    return dispatch =>{
        dispatch(showLoading(true))
        return Util.post(url,body,(response) =>{
            dispatch(showLoading(false))
            if (response.status==0){
                sucessCallBack();
                dispatch(setRecommendList(response.body.goodsResponses))
            }else {
                failCallBack();
                alert(response.msg);
            }
        },(error)=>{
            dispatch(showLoading(false))
            failCallBack();
            alert("获取热门推荐失败");
        })
    }
}



// 获取购物车列表
export let getShoppingCartPost = (url,hotrl,body,hotBody,sucessCallBack,failCallBack)=>{
    return dispatch =>{
        dispatch(showLoading(true))
        return Util.post(url,body,(response) =>{
            dispatch(showLoading(false))

            if (response.status===0){
                sucessCallBack();
                let tempAry = [];
                let sizeString = '';
                for (let i=0;i<response.body.goodsList.length;i++){
                    let tempDic = response.body.goodsList[i];

                    tempDic.bodyType.map((content,i)=>{
                        if (i===0){
                            sizeString = content.type+':'+content.name
                        }else {
                            sizeString+='    '+content.type+':'+content.name
                        }
                    })
                    tempDic['sizeString'] = sizeString;
                    tempAry.push(tempDic);
                }


                dispatch(setShoppingCartList(tempAry));
                dispatch(getHotShoppingCartPost(hotrl,hotBody,function (data) {

                },function (error) {

                }))
            }else {
                Toast.info(response.msg, 1);
                // console.log(response.msg);
                // alert(response.msg);

            }
        },(error)=>{
            dispatch(showLoading(false))
            failCallBack(error);
            alert("获取购物车列表失败");
        })
    }
}

// 加载动画
let showLoading=(bool)=>{
    return{
        type:types.SHOPPINGCARTLOADING,
        isShowLoading:bool
    }
}
// 删除action
export let setDelectList =(data,list,i,tempPrice,allSelectImag,isUserId,numberShopCart)=>{
    if (data.selected){
        data.selected = !data.selected;
        list[i] = data;
        console.log(tempPrice+'hahah');
        tempPrice = tempPrice - parseFloat(data.price)*data.number;
        numberShopCart = numberShopCart - data.number;
        let allStatus = false;
        for (let i=0;i<list.length;i++){
            let tempDic = list[i];
            if (tempDic.selected===true){
                allStatus = true;
                break;
            }
        }
        if (allStatus===false){
            allSelectImag = false
        }
    }

    let tempArr = [];
    let dataTemp = data;
    tempArr.push(dataTemp);
    db.deleteGoods(tempArr);
    list.splice(i,1);

    return{
        type:types.SETDELECTSTATUSLIST,
        goodsList:list,
        priceString:tempPrice,
        allSelectImag:allSelectImag,
        numberShopCart:numberShopCart
    }
}
// 改变商品数量
export let setNumberAction = (data,i,numberString,list,isUserId,stock,priceString,tag,numberShopCart)=>{

    console.log(numberString)
    if (isUserId){
        data.number = numberString;
        data.stack = stock;
    }else {
        data.number = numberString;
    }
    list[i] = data;
    if (data.selected){
        if (tag===0){
            priceString = priceString - parseFloat(data.price);
            numberShopCart = numberShopCart - 1;
        }else {

            priceString = priceString + parseFloat(data.price);
            numberShopCart = numberShopCart + 1;
        }
    }

    // 下面是更新缓存 (分有无userid)
    if(isUserId){
        let temp = [];
        for(let i =0;i<list.length;i++){
            let tempDic = {};
            let listDic = list[i];
            let goodType = '';
            listDic.bodyType.map((content,i)=>{
                if (i===0){
                    goodType = content.type+':'+content.name
                }else {
                    goodType+=' '+content.type+':'+content.name
                }
            })
            tempDic['goodNam'] = listDic.goodsName;
            tempDic['goodsId'] = listDic.goodsId;
            tempDic['number'] = listDic.number;
            tempDic['goodSpecification'] = goodType;
            tempDic['param1'] = listDic.param1;
            tempDic['param2'] = listDic.param2;
            tempDic['param3'] = listDic.param3;
            tempDic['zoomUrl']= listDic.zoomUrl;
            tempDic['price'] = listDic.price;
            tempDic['stock'] = listDic.stock;
            temp.push(tempDic);
        }
        db.saveGoods(temp,true)
    }else {
        db.saveGoods(list,true)
    }

    return{
        type:types.SETNUMBERACTION,
        goodsList:list,
        priceString:priceString,
        numberShopCart:numberShopCart
}
}
// 更改购物车商品数量
export let setShoppingNuberPost = (url,body,numberStr,data,i,list,isUserId,priceString,tag,setShoppingNuberPost,sucessCallBack,failCallBack)=>{
    return dispatch=>{
       
        dispatch(showLoading(true))
        return Util.post(url,body,(response)=>{
            dispatch(showLoading(false))
            if(response.status==0){
                dispatch(setNumberAction(data,i,numberStr,list,isUserId,response.body.stock,priceString,tag,setShoppingNuberPost));

                sucessCallBack();

            }else {
                alert(response.msg);
                failCallBack()
            }
        },(error)=>{

            failCallBack()
        })
    }
}


// 删除购物车
export let deletaShoppingCartPost = (url,body,data,i,list,priceStr,allSelectImg,isUserId,numberShopCart,sucessCallBack,failCallBack)=>{
    return dispatch =>{
        dispatch(showLoading(true))
        return Util.post(url,body,(response)=>{
            dispatch(showLoading(false))
            if (response.status==0){

                dispatch(setDelectList(data,list,i,priceStr,allSelectImg,isUserId,numberShopCart))
                sucessCallBack();
                alert('删除成功');
            }else {
                alert(response.msg);
                failCallBack();
            }
        },(error)=>{
            dispatch(showLoading(false))
            failCallBack();
            alert("删除商品失败");
        })
    }
}

// 改变商品选择状态
export let setSelectImg = (data,list,i,priceStr,allSelectImg,numberShopCart,isUserId) =>{
    data.selected = !data.selected;
    list[i] = data;
    let tempPrice = 0;
    console.log(134567);
    let  tempAction = {};
    if (isUserId){
        if (data.status==1&&data.isdelete==0){
            if (data.selected){
               tempPrice = priceStr + (parseFloat(data.price)*data.number);
               numberShopCart = numberShopCart + data.number;
            }else {
               tempPrice = priceStr - (parseFloat(data.price)*data.number);
               numberShopCart = numberShopCart - data.number;
            }
        }
    }else {
        if (data.selected){
            tempPrice = priceStr + (parseFloat(data.price)*data.number);
            numberShopCart = numberShopCart + data.number;
        }else {
            tempPrice = priceStr - (parseFloat(data.price)*data.number);
            numberShopCart = numberShopCart - data.number;

        }
    }

    let allStatus = false;
    for(let i=0;i<list.length;i++){
        let allImag = list[i];
        if (isUserId){
            if (allImag.status==1&&data.isdelete==0){
                if(data.selected){
                    if (allImag.selected===false){
                        allStatus = true;
                        break;
                    }
                }
            }
        }else {
            if(data.selected){
                if (allImag.selected===false){
                    allStatus = true;
                    break;
                }
            }
        }

    }
    if (data.selected){
        if (allStatus===false){
            allSelectImg = !allSelectImg
        }
    }else {
        allSelectImg = false
    }




    return{
        type:types.SETSHOPPINGCARTLIST,
        goodsList:list,
        priceString:tempPrice,
        allSelectImag:allSelectImg,
        numberShopCart:numberShopCart,
    }
}

export let setAllSelectImg = (list,status,numberShopCart,isUserId) =>{
    let tempAry = [];
    let priceStr = 0;
    let tempAllAction = {};
    for (let i=0;i<list.length;i++){
        let tempDic = list[i];
        if (isUserId){
            if (tempDic.status==1&&tempDic.isdelete==0){
                tempDic.selected = status;
                tempAry.push(tempDic);
                if(status){
                   priceStr = priceStr + (parseFloat(tempDic.price)*tempDic.number);
                   numberShopCart = numberShopCart + tempDic.number;
                }else {
                   priceStr = 0;
                   numberShopCart = 0;
                }
            }
        }else {
                tempDic.selected = status;
                tempAry.push(tempDic);
                if(status){
                  priceStr = priceStr + (parseFloat(tempDic.price)*tempDic.number);
                  numberShopCart = numberShopCart + tempDic.number;
                }else {
                  priceStr = 0;
                  numberShopCart = 0;
                }
        }

    }
    return{
        type:types.SETSHOPPINGCARTLIST,
        goodsList:tempAry,
        priceString:priceStr,
        allSelectImag:status,
        numberShopCart:numberShopCart
    }
}
























