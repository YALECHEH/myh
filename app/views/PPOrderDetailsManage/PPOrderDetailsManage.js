/**
 * Created by nipeng on 2017/7/12.
 * 订单已完成view
 */

import React, {Component} from 'react';
import './PPOrderDetailsManage.less'
import '../../common/styles/common.less'
import {Carousel, ActivityIndicator, Modal} from 'antd-mobile';
import * as contants from '../../common/Apis/constants'
import {wxShare} from '../../common/Apis/wxJsApis';
import * as db from '../../common/Apis/Utils';
const alert = Modal.alert;

export default class PPOrderDetailsManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderDetail: this.props.data,
        }
        console.log("orderDetail", this.state.orderDetail)
    }

    componentWillMount() {
        document.title = '订单详情';

    }

    componentDidMount() {
        let url = db.userAgent() === 'Android' ? encodeURIComponent(window.location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});
    }

    render() {
        let detail = this.state.orderDetail;
        const {OrderTab} = this.props;
        console.log(detail)
        if (!detail) {
            return (
                <div></div>
            )
        }
        // const {PPOrderDetailsReducer, PPOrderDetailsAction} = this.props;
        return (

            <div className="container">

                <div>
                    <div className="orderIdStyle">
                        <p className="ellips orderId">订单号:{detail.orderNo}</p>
                        <p className="ellips statusStyle">已完成</p>
                    </div>

                    {/*<div className="orderIdStyle">*/}
                    {/*<p className="waybillStyle">运单编号:8899096688888</p>*/}
                    {/*</div>*/}

                    <div className="orderIdStyle">
                        <p className="deliveryStyle">收货信息</p>
                    </div>

                    <div className="messageStyle">
                        <div className="nameOrPhone">
                            <div className="nameSty">
                                <img src={require('../../images/orderDetailsPage/headImage_Icon.png')}/>
                                <p className="ellips nameLB">{detail.userName}</p>

                            </div>
                            <div className="ellips phoneSty">
                                <img src={require('../../images/orderDetailsPage/addressPhone_Icon.png')}/>
                                <p className="ellips phoneLB">{detail.mobile}</p>
                            </div>

                        </div>

                        <div className="addressStyle">
                            <label className="addressName">{detail.address}</label>
                        </div>
                    </div>

                    <div className="orderIdStyle">
                        <p className="deliveryStyle">商品信息</p>
                    </div>

                    <ul>
                        {
                            this.orderCell()
                        }
                    </ul>

                    <div className="orderIdStyle">
                        <p className="ellips payStatus">支付方式</p>
                        <p className="ellips payStatusStyle">{detail.bileType === 1 ? "银行卡" : detail.bileType === 2 ? "信用卡" : "微信"}</p>
                    </div>

                    <div className="orderIdStyle">
                        <p className="ellips payStatus">送货时间</p>
                        <p className="ellips payStatusStyle">{detail.sendType === 1 ? "随时" : detail.sendType === 2 ? "工作日" : "非工作日"}</p>
                    </div>
                    {( detail.remark !== null && "" !== detail.remark) &&
                    <div className="orderIdStyle">
                        <p className="PPmsg payStatus">留言</p>
                        <p className="ellips payStatusStyle">{detail.remark}</p>
                    </div>
                    }
                    <div className="shopMoneyStyle">
                        <p className="ellips payStatus">商品金额</p>
                        <p className="ellips payStatusStyle">{detail.goodsMoney}</p>
                    </div>

                    <div className="pocketMoney">
                        <div className="lineView"></div>
                        <div className="pocket">
                            <p className="pocketZi">实付金额:</p>
                            <p className="pocketM">￥{detail.amount}</p>
                        </div>
                    </div>
                </div>
                <div className="orderBotton">
                    <button className="delectOrderButton" onClick={() => {
                        this.delectAction()
                    }}>
                        删除订单
                    </button>
                    <button className="againPayButton" onClick={() => {
                        this.againBuy()
                    }}>
                        再次购买
                    </button>

                </div>

                {OrderTab.isShow ? <ActivityIndicator toast text="Loading..." animating={true}/> : null}

            </div>
        )
    }

    delectAction() {
        const {OrderTab, OrderListAction} = this.props;
        let array = OrderTab.completedList;
        let allAry = OrderTab.allList;
        let userID = db.readUserInfo()['userId'];
        //删除订单
        console.log('----------------------->删除订单');
        alert('', '确定删除该订单?', [
            {text: '取消', onPress: () => console.log('cancel'), style: {color: '#FE007E'}},
            {
                text: '确定', onPress: () => {
                OrderListAction.deleteOrCancelOrderPost(this.state.orderDetail.orderId, 1, userID, array, allAry,()=>{
                    this.props.router.goBack();
                });//传相应的数组
            }, style: {color: '#FE007E'}
            },
        ]);


    }

    againBuy() {
        // 再次购买
        let userID = db.readUserInfo()['userId'];
        const {OrderListAction} = this.props;
        OrderListAction.buyAgainWithOrder(userID, this.state.orderDetail.goods, () => { //10000 用户id
            this.props.router.push({
                pathname: contants.commonUrl + '/shoppingCart'
            });
        })
        console.log('----------------------->再次购买');

    }

    commodityDetails(data, i) {
        // 商品详情
        console.log('已完成',data)
        this.props.router.push({
            pathname: contants.commonUrl + '/goodDetails',
            state: {
                goodsId: data.goodsId
            }
        });
    }


    orderCell() {
        var that = this;
        return (
            this.state.orderDetail.goods.map(function (data, i) {
                return (
                    <li key={i} className="orderCell">
                        <div className="orderHead">
                            <img src={data.hostUrl + data.zoomUrl}/> /*待改*/
                        </div>
                        <div className="orderRightContent" onClick={() => {
                            that.commodityDetails(data, i)
                        }}>
                            <p className="ellips orderNameStyle">{data.goodsName !== null ?
                                (data.goodsName.length > 18 ? data.goodsName.split(0, 18) + "..." : data.goodsName)
                                : ''}</p>
                            <div className="orderNumberOrSize">
                                <p className="ellips orderSizeStyle">{data.specifications[0].type}:{data.specifications[0].name}
                                    ' ' {data.specifications[1].type}:{data.specifications[1].name}</p>
                                <p className="ellips orderNuber">X{data.goodsNum}</p>
                            </div>
                            <p className="ellips orderPriceStyle">￥{data.goodsPrice}</p>
                        </div>

                        {i === 0 ? null : <div className="lineView"></div>}

                    </li>

                )
            })


        )


    }


}









