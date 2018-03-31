/**
 * Created by chenmao on 2016/11/29.
 *
 * 合并reducer
 */
//import { combineReducers } from 'redux';不使用immutable
import {combineReducers} from 'redux-immutable';//使用immutable
import addressLists from './addressListReducer.js'


import afterSale from './afterSalesReducer';
import HomePage  from "./homePageReducer.js";//首页
import goodDetails from './goodDetailsReducer.js';//商品详情
import ListGoods from './listGoodsReducer.js';//单类商品列表

import PPCollectReducer from './PPCollectReducer'//我的收藏列表
import PPLoginReducer from './PPLoginReducer'; // 登陆
import PPShoppingCartReducer  from './PPShoppingCartReducer'; // 购物车
import PPOrderDetailsReducer from './PPOrderDetailsReducer';  // 订单已完成

    
import Search from './searchReducer.js';//搜索页面
import Settlement from './settlementReducer.js';//订单结算页面

import OrderHome from './orderHomeReducer.js'//订单首页入口页面
import Payment from './paymentReducers.js'//支付页面

import OrderTab from "./myOrderListReducer"; //订单列表
//支付页面
import PendingOrderDetailReducer from "./pendingOrderDetailReducer"//待付款详情

let rootReducer = combineReducers({
    HomePage: HomePage,
    goodDetails,
    ListGoods,
    Search,
    Settlement,
    OrderHome,
    Payment,
    afterSale,
    addressLists,
    PPCollectReducer,
    PPLoginReducer,
    PPShoppingCartReducer,
    PPOrderDetailsReducer,
    OrderTab,
    PendingOrderDetailReducer
})

export default rootReducer;




