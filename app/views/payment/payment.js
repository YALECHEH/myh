/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './payment.less';
//import {readUserInfo} from '../../common/Apis/Utils';//获取用户信息
import {hex_md5} from './md5';
import {wxShare} from '../../common/Apis/wxJsApis';
import * as db from '../../common/Apis/Utils';
import * as contants from '../../common/Apis/constants';//全局配置信息

export default class Payment extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            paymentMethod:1
        }
    }
    componentDidMount(){
        let shareUrl=db.userAgent()==='Android'?encodeURIComponent(location.href.split('#')[0]):encodeURIComponent(contants.url);
        wxShare(shareUrl,[],{});
        const {Payment,PaymentActions}=this.props;
    }
    render() {
        let payment=this.props.location.state;
        return (
            <div className="payment">
                <div className="amountsPayable">
                    <span className="amountsPayableText">应付金额：</span>
                    <span className="moneyText">￥{payment.money}</span>
                </div>
                <div className="theWay">
                    <div className="theWayList" onClick={()=>{}}>
                        <div className="theWayLeft">
                            <img src={require('../../images/payment/b29@1x.png')}/>
                            <span>微信支付</span>
                        </div>
                        <div className="theWayRight">
                            <img  src={require('../../images/payment/b31@1x.png')}/>
                        </div>

                    </div>
                </div>
                <div className="paymentBottom">
                    <button onClick={()=>{this.transactionNumber()}}>确定</button>
                    <button style={{marginTop:'20px'}} onClick={()=>{this.callPayment()}}>假支付</button>
                </div>
                <div className="hide">
                   {/* <form id="submit_photo"  action="http://gzh.unspay.com/fixcode-pay-front/fixCodePay/applyWXCodePay" method="post" target="_blank">
                       <input name="accountId" value="1120160914141526001"/>
                        <input id="orderId" name="orderId" value=""/>
                        <input name="commodity" value="banama"/>
                        <input name="amount" value="0.01"/>
                        <input id="responseUrl" name="responseUrl" value=""/>
                        <input name="subject" value="banama"/>
                        <input id="mac" name="mac" value=""/>
                        <button  id="fromInputSubmit"  onClick={()=>{this.fromSubmit()}}/>
                    </form>*/}
                </div>
                {/*<a id="ddddd" href="">

                </a>
                <input type="text" id="lianjie" readonly="text"/>*/}
            </div>
        )
    }
    callPayment(){
        console.log(this.props.location.state);
        const {Payment,PaymentActions}=this.props;
        let url="/webOrder/payResult";
        let data={
            orderId:this.props.location.state.orderId
        };
        PaymentActions.payment(url,data,()=>{},()=>{});
    };
    //获取订单编号接口
    transactionNumber(){
        const {Payment,PaymentActions}=this.props;
        let url="/wallet/createTradeOrderNo";
        let userInfo=db.readUserInfo();
        let data={
            userId:userInfo.userId,
            orderId:this.props.location.state.orderId,//订单编号
            amount:0.01,//金额
            billType:3//付款方式
    };
        PaymentActions.transactionNumber(url,data,(data)=>{
            console.log(data);
            let Mac=hex_md5("accountId=2120140610153044001&orderId="+data.orderNo+
                "&commodity=banama&amount=0.01&responseUrl="+data.weixinCallbackAddress+"&subject=banama&key=liguo3721220").toUpperCase();
           // document.getElementById("orderId").value=data.orderNo;
            //document.getElementById("responseUrl").value=data.weixinCallbackAddress;
            //document.getElementById("mac").value=Mac;
            /*$("#registerAction").submit();*/
            /*console.log("accountId=1120130523134348001&orderId="+data.orderNo+
                "&commodity=巴拿马草帽&amount=0.01&responseUrl="+data.weixinCallbackAddress+"&subject=巴拿马草帽&key=123456");*/
            let paymentData={
                accountId:"1120130523134348001",
                orderId:data.orderNo,
                commodity:"banama",//商品信息
                amount:"0.01",//金额
                responseUrl:data.weixinCallbackAddress,
                subject:"banama",
                mac:Mac
            };
            console.log(paymentData);
           // this.fromSubmit();
            //1120160914141526001
            let weixiUrl="http://gzh.unspay.com/fixcode-pay-front/fixCodePay/applyWXCodePay?accountId=2120140610153044001&orderId="+data.orderNo+
                "&commodity=banama&amount=0.01&responseUrl="+data.weixinCallbackAddress+"&subject=banama&mac="+Mac;
           // window.open(url);
            /*document.getElementById("ddddd").innerHTML=weixiUrl;
            document.getElementById("ddddd").href=weixiUrl;
            document.getElementById("lianjie").value=weixiUrl;*/
            /*setTimeout(function () {
                window.location.href=weixiUrl;
            },800);*/
            window.location.href=weixiUrl;
            //$("#submit_photo").submit();
          /* let Url="http://172.22.200.211:38086/fixcode-pay-front/fixCodePay/applyWXCodePay";
            PaymentActions.CallPayment(Url,paymentData,()=>{},()=>{});*/
        },()=>{});
    };
    //选择支付方式
    choosePaymentMethods(){

    };
}