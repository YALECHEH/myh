/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './settlement.less';
import SCommodity from './settlementCommodity';//商品列表
import { Picker,Button,Modal} from 'antd-mobile';
import {wxShare} from '../../common/Apis/wxJsApis'
import * as db from '../../common/Apis/Utils';
import * as contants from '../../common/Apis/constants'
const alert=Modal.alert;
   //送货时间
   let district=[{
     label: '随时',
     value: '1'
   }, {
         label: '工作日',
         value: '2'
     }, {
           label: '非工作日',
           value: '3'
       }];
const CustomChildren = props => (
    <div onClick={props.onClick} className="address settlementList">
        <label className="addressText">{props.children}</label>
        <div className="addressRight">
            <label>{props.extra}</label>
            <img src={require('../../images/settlement/arrowRight.png')}/>
        </div>
    </div>
);
export default class Settlement extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            district: district,
            isLoading: true,
            pickerText:'',
            pickerValue:null,
            unsaved:true,
            isShow:false,
            selectAddress:null,
            Msg:''
        };
    }
    //页面渲染前
    componentWillMount(){
        document.title="订单结算";
    }
    componentWillUnmount(){
        contants.addressInfo=null;
        this.props.SettlementActions.defaultAddressData(null);
    }
    componentDidMount(){
        //console.log(this.props);
        const {SettlementActions}=this.props;
        let url=db.userAgent()==='Android'?encodeURIComponent(window.location.href.split('#')[0]):encodeURIComponent(contants.url);
        let userInfo=db.readUserInfo();
        let data={
            userId:userInfo.userId
        };
        wxShare(url,[],{});
        if(!contants.addressInfo){
            SettlementActions.defaultAddress("/adress/getAddress",data,()=>{},()=>{});
        }
        let h=$(window).height();
        $(window).resize(function() {
            if($(window).height()<h){
                $('.settlementbottrom').hide();
            }
            if($(window).height()>=h){
                $('.settlementbottrom').show();
            }
        });
    }
    //是否回到上个页面
    goPreviousPage(){
        this.props.router.goBack();
    };
    getPrice(){
        const { state }=this.props.location;
        const  {goodInfo}=state;
        let price=0;
        goodInfo.map((val,i)=>{
            price+=Number(val.price)*Number(val.number);
        });
        let priceArr=String(price).split('.');
        return priceArr.length>1?price.toFixed(2):price;
    }
    render() {
        const {Settlement}=this.props;
        const { state }=this.props.location;
        const  {goodInfo}=state;
        let that=this;
        let AddressData=contants.addressInfo?contants.addressInfo:Settlement.defaultAddress;
        return (
            <div className="settlementBody">
                {AddressData===null?<div className="address settlementList" onClick={()=>{this.goAddress()}}>
                    <label className="addressText">收货地址</label>
                    <div className="addressRight">
                        <label>请添加收获地址</label>
                        <img src={require('../../images/settlement/arrowRight.png')}/>
                    </div>
                </div>: <div className="chooseAddressContainer" onClick={()=>{this.goAddress()}}>
                    <div className="chooseAddress">
                        <div className="chooseAddress_l">
                            <img src={require('../../images/settlement/b24@1x.png')} />
                            <p>
                                <span>{`收件人:${AddressData.receiveName}  ${AddressData.phone}`}</span>
                                <span>{AddressData.shopAdress}</span>
                            </p>
                        </div>
                        <img src={require('../../images/settlement/arrowRight.png')}/>
                    </div>
                    <img src={require('../../images/settlement/addressButtom.png')} className="addressStripe"/>
                </div>}
                <div className="commodityList">
                    <div className="commodityListTitle">
                        <label>帽雅会</label>
                    </div>
                    <div>
                        {goodInfo.map((val,i)=>{
                            return(
                                <SCommodity goodInfo={val} key={i}/>
                            )
                        })}
                    </div>
                </div>
                <Picker
                    data={this.state.district}
                    extra="随时"
                    cols={1}
                    onOk={(val)=>{this.setState({pickerValue:val[0]});console.log(val[0])}}
                    value={this.state.pickerText}
                    onChange={v => this.setState({ pickerText: v })}
                    onDismiss={()=>{this.setState({ pickerText: "",pickerValue:null})}}
                >
                    <CustomChildren>送货时间</CustomChildren>
                </Picker>
                <div className="settlementList leaveMessage">
                    <input type="text" ref="inp" placeholder="选填:给卖家留言(20字以内）" maxLength="20" onChange={(e)=>this.setMsg(e)} value={this.state.Msg}/>
                    {this.state.Msg?
                        <span onClick={()=>{this.removeText()}}>
                            <img src={require('../../images/shippingAddress/n6@1x.png')} />
                        </span>:null
                    }

                </div>
                <div className="address settlementList OrderMarginBottom">
                    <label className="addressText">商品金额</label>
                    <span className="amountMoney">{`￥${this.getPrice()}`}</span>
                </div>
                <div className="settlementbottrom bottom">
                    <div className="Sleft">
                        <img src={require('../../images/settlement/correct.png')}/>
                        <span>{`合计￥${this.getPrice()}`}</span>
                    </div>
                    <button onClick={()=>{this.goPayment()}}>去支付</button>
                </div>
                {Settlement.isShowLoading?<div className="loadingView"></div>:null}
            </div>
        )
    }
    setMsg(e){
        this.setState({
            Msg:e.target.value
        });
    }
    removeText(){
        this.setState({
            Msg:''
        })
    }
    goPayment(){
        const {SettlementActions,Settlement,location}=this.props;
        const {state}=location;
        const  {goodInfo}=state;
        let userInfo = db.readUserInfo();
        let AddressData=contants.addressInfo?contants.addressInfo:Settlement.defaultAddress;
        if(!AddressData){
            alert('提示', '请选择收货地址', [
                { text: '确定', onPress: () =>{}, style: 'default' }
            ]);
            return;
        }
        let GoodsJson=[];
        goodInfo.map((val,i)=>{
            let goodDes={
                goodsId:val.goodsId,
                goodsNum:val.number,
                param1:val.param1,
                param2:val.param2,
                param3:val.param3,
                isInCart:location.state.isInCart?0:1
            };
            GoodsJson.push(goodDes);
        });
        let requestData={
            leaveMsg:this.state.Msg,
            addressId:AddressData.receiveId,
            sendType:this.state.pickerText[0]?Number(this.state.pickerText[0]):1,
            amount:this.getPrice(),
            userId:userInfo.userId,
            goods:GoodsJson
        };
        console.log(requestData);
        SettlementActions.goToPay('/webOrder/createOrder',requestData,(res)=>{
            console.log(res);
            if(res.orderId){
                this.props.router.push({
                    pathname:contants.commonUrl+'/payment',
                    state:{
                        orderId:res.orderId,
                        money:this.getPrice()
                    }
                });
            }
        },(err)=>{

        });
    }
    //跳转地址页面
    goAddress(){
        const {router}=this.props;
        router.push({
            pathname:contants.commonUrl+'/addressList',
            state:{
                pageType:"settlement",
                selectAddress:(address)=>{
                    this.selectAddress(address)
                }
            }
        });
    };
    /*selectAddress(address){
        const {SettlementActions}=this.props;
        SettlementActions.selectAddress(address);
    }*/
}