/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './orderHome.less';
import * as contants from '../../common/Apis/constants';//全局配置信息
//import {readUserInfo} from '../../common/Apis/Utils';//获取用户信息
import {wxShare} from '../../common/Apis/wxJsApis';
import * as db from '../../common/Apis/Utils';
//import * as contants from '../../common/Apis/constants'

export default class OrderHome extends Component {
    constructor(...args) {
        super(...args);
        this.state={

        }
    }
    //reader前
    componentWillMount(){
        document.title="我的订单";
    }
    //在页面被渲染成功之后
    componentDidMount(){
        let shareUrl=db.userAgent()==='Android'?encodeURIComponent(location.href.split('#')[0]):encodeURIComponent(contants.url);
        wxShare(shareUrl,[],{});
        const {OrderHome,OrderHomeActions}=this.props;
        let userInfo=db.readUserInfo();
        let url="/webOrder/getNumber";
        let data={
            userId:userInfo.userId
        };
        OrderHomeActions.orderNumber(url,data,()=>{},()=>{});
    }
    //页面销毁
    componentWillUnmount(){
        const {OrderHome,OrderHomeActions}=this.props;
    }
    //1,待付款,2,待收货,3售后
    orderStatusNumber(status,orderNumber){
       if(orderNumber===null){
           return(
               <div></div>
           )
       }else if(status===1&&orderNumber.ispayment>0){
           return(
               <div className="statusNumber">{orderNumber.ispayment}</div>
           )
       }else if(status===2&&orderNumber.isgoods>0){
           return(
               <div className="statusNumber">{orderNumber.isgoods}</div>
           )
       }else if(status===3&&orderNumber.issales>0){
           return(
               <div className="statusNumber">{orderNumber.issales}</div>
           )
       }else {
           return(
               <div></div>
           )
       }
    };
    render() {
        const {OrderHome,OrderHomeActions}=this.props;
        let userInfo=db.readUserInfo();
        return (
            <div className="orderHome">
                <div className="orderHomeTop">
                    <img className="OHTopImg" src={require('../../images/orderHome/background.png')}/>
                    <div className="userInfo">
                        <img src={require('../../images/orderHome/touxiang.png')}/>
                        <span>ID:{userInfo.moblie}</span>
                    </div>
                </div>
                <div className="myOrder" onClick={()=>{this.goMyOrder(4)}}>
                    <div className="myOrderLeft">
                        <img className="jiantouImg" src={require('../../images/orderHome/order.png')}/>
                        <span className="orderListText">我的订单</span>
                    </div>
                    <div className="myOrderRight">
                        <span>查看全部订单</span>
                        <img className="jiantouImg" src={require('../../images/orderHome/jiantouLift.png')}/>
                    </div>
                </div>
                <div className="orderStatus">
                    <div className="statusBody" onClick={()=>{this.goMyOrder(1)}}>
                        <img src={require('../../images/orderHome/pendingPayment.png')}/>
                        <span>待付款</span>
                        {this.orderStatusNumber(1,OrderHome.orderNumber)}
                    </div>
                    <div className="statusBody" onClick={()=>{this.goMyOrder(2)}}>
                        <img src={require('../../images/orderHome/receipt.png')}/>
                        <span>待收货</span>
                        {this.orderStatusNumber(2,OrderHome.orderNumber)}
                    </div>
                    <div className="statusBody" onClick={()=>{this.goAfterSale()}}>
                        <img src={require('../../images/orderHome/afterSale.png')}/>
                        <span>我的售后</span>
                        {this.orderStatusNumber(3,OrderHome.orderNumber)}
                    </div>
                    <div className="statusBody" onClick={()=>{this.goMyOrder(3)}}>
                        <img src={require('../../images/orderHome/carryOut.png')}/>
                        <span>已完成</span>
                    </div>
                </div>
                <div className="myOList">
                    <div className="myCollectionBody" onClick={()=>this.goCollection()}>
                        <div className="myCollection myBorder">
                            <div className="myCLeft">
                                <img className="jiantouImg" src={require('../../images/orderHome/collection.png')}/>
                                <span className="orderListText">我的收藏</span>
                            </div>
                            <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')}/>
                        </div>
                    </div>
                    <div className="myCollectionBody" onClick={()=>this.goShoppingCart()}>
                        <div className="myCollection myBorder">
                            <div className="myCLeft">
                                <img className="jiantouImg" src={require('../../images/orderHome/shoppingCart.png')}/>
                                <span className="orderListText">我的购物车</span>
                            </div>
                            <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')}/>
                        </div>
                    </div>
                    <div className="myCollectionBody myBorder" onClick={()=>this.goAddress()}>
                        <div className="myCollection">
                            <div className="myCLeft">
                                <img className="jiantouImg" src={require('../../images/orderHome/address.png')}/>
                                <span className="orderListText">我的收货地址</span>
                            </div>
                            <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    //跳转我的订单页面
    goMyOrder(orderStatus){
        const {router}=this.props;
        router.push({
            pathname:contants.commonUrl+'/orderTabList',
            query:{
                orderStatus:orderStatus
            }
        });
    };
    //跳转我的售后页面
    goAfterSale(){
        const {router}=this.props;
        router.push({
         pathname:contants.commonUrl+'/afterSale'
         });
    };
    //跳转我的收藏页面
    goCollection(){
        const {router}=this.props;
         router.push({
         pathname:contants.commonUrl+'/collectManage'
         });
    };
    //跳转购物车页面
    goShoppingCart(){
        const {router}=this.props;
        router.push({
         pathname:contants.commonUrl+'/shoppingCart'
         });
    };
    //跳转地址页面
    goAddress(){
        //alert("我的地址");
        const {router}=this.props;
        router.push({
         pathname:contants.commonUrl+'/addressList',
            state:{
                pageType:"orderHome"
            }
         });
    }
}
