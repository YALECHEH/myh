/**
 * Created by XiaYongjie on 2017/7/11.
 *
 */
import React, {Component} from "react"
import './orderDetail.less';
import DetailPublic from "./detailPublic";
import * as contants from '../../common/Apis/constants'
import * as db from '../../common/Apis/Utils';
import {ActivityIndicator, Modal,} from 'antd-mobile';

const alert = Modal.alert;

class Received extends Component {
    //在页面被渲染成功之后
    constructor(...args) {
        super(...args);
        this.state = {
            orderId: this.props.location.state.orderId,
            transportNo: this.props.location.state.transportNo,
            logisticsId: this.props.location.state.logisticsId,
            logisticsName: this.props.location.state.logisticsName,
            logisticsCode: this.props.location.state.logisticsCode,
            type: 5,
        }
        console.log('orderId', this.state.orderId)
        console.log('transportNo', this.state.transportNo)
        console.log('logisticsId', this.state.logisticsId)
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
    }

    routerWillLeave(nextLocation) {
        if (this.alertInstance != null) {
            this.alertInstance.close();
        }
    }

    onClick(key) {
        const {OrderListAction, router, OrderTab} = this.props;
        let detail = OrderTab.orderDetail;
        let completedList = OrderTab.pendPaymentList;
        let allAry = OrderTab.allList;
        let userID = db.readUserInfo()['userId'];
        switch (key) {
            case 1:
                //删除订单
                this.alertInstance = alert('', '确定删除该订单?', [
                    {text: '取消', onPress: () => console.log('cancel'), style: {color: '#FE007E'}},
                    {
                        text: '确定', onPress: () => {
                        OrderListAction.deleteOrCancelOrderPost(detail.orderId, 1, userID, completedList, allAry, () => {
                            router.goBack();
                        });//传相应的数组
                    }, style: {color: '#FE007E'}
                    },
                ]);
                break;
            case 2:
                //再次购买
                OrderListAction.buyAgainWithOrder(userID, detail.goods, () => { //10000 用户id
                    this.props.router.push({
                        pathname: contants.commonUrl + '/shoppingCart'
                    });
                });
                break
            case 3:
                OrderListAction.isCanReFunds(userID, detail.orderId, (data) => {
                    //成功回

                    router.push({
                        pathname: contants.commonUrl + '/applyService',
                        state: {
                            returnMoney: data.returnMoney == null ? detail.amount : (detail.amount - parseFloat(data.returnMoney)),
                            orderNum: detail.orderNo,
                            orderTime: this.props.location.state.createTime,
                            type: data.status,
                            orderId: detail.orderId

                        }
                    });
                }, () => {
                    //失败回调
                });
                break
            case 4:
                //查看物流
                router.push({
                    pathname: contants.commonUrl + '/logistics',
                    query: {
                        totalNum: detail.orderNum, //商品数量
                        url: detail.goods[0].zoomUrl,//商品缩略图
                        status: detail.status, //订单状态
                        orderId: detail.orderId, //订单id
                        deliverCompanyName: detail.logisticsName, // 物流公司名称
                        deliverCompanyNo: detail.logisticsName,  // 物流公司对应码
                        transportNo: detail.transportNo, //运单号
                    }
                });
                break
            case 5:
                //确认收货
                this.alertInstance = alert('', '确定确认收货?', [
                    {text: '取消', onPress: () => console.log('cancel'), style: {color: '#FE007E'}},
                    {
                        text: '确定', onPress: () => {
                        OrderListAction.makeSureReceptPost(detail.orderId, userID, OrderTab.toBeReceivedList, OrderTab.completedList, OrderTab.allList)
                    }, style: {color: '#FE007E'}
                    },
                ]);
                //跳到已完成
                OrderListAction.setType(3);
                break
            case 6:
                //查看售后
                this.goRefundsDetail()
                break

        }
    }

    //查看售后详情
    goRefundsDetail() {
        //查看售后
        const {OrderListAction, router, OrderTab} = this.props;
        let userID = db.readUserInfo()['userId'];
        if (OrderTab.orderDetail.status == 5 || OrderTab.orderDetail.status == 6) {
            router.push({
                pathname: contants.commonUrl + '/refundProgress',
                state: {
                    orderId: OrderTab.orderDetail.orderId,
                    orderNum: OrderTab.orderDetail.orderNo,
                    createTime: this.props.location.state.createTime,
                }
            });
        } else {
            router.push({
                pathname: contants.commonUrl + '/refundsDetailList',
                state: {
                    orderId: OrderTab.orderDetail.orderId,
                    orderNum: OrderTab.orderDetail.orderNo,
                    userId: userID,
                    createTime: this.props.location.state.createTime,
                }
            });
        }
    };

    render() {
        const {OrderTab} = this.props;
        let detail = OrderTab.orderDetail;
        if (detail !== null) {
            return (
                <div>
                    {detail !== null && detail.status === '已取消' &&
                    <div className="order_detail_title">
                        <img className="order_detail_title_icon"
                             src={require('../../images/order/order_detail_icon.png')}>
                        </img>
                        <div
                            className="order_detail_title_text">{'您于' + detail.createTime + '下的订单已申请全额退款，订单已自动取消。'}
                        </div>
                    </div>
                    }
                    <div className="detail_order_item_line"/>
                    <DetailPublic data={detail} {...this.props}/>
                    <div className="detail_order_item_line"/>
                    <div className="order_detail_number_pp">
                        <div className="detail_left">支付方式</div>
                        <div
                            className="detail_right">{detail === null ? '' : (detail.bileType === 1 ? '银行卡' : (detail.bileType === 2 ? '信用卡' : '微信'))}</div>
                    </div>
                    <div className="detail_order_item_line"/>
                    <div className="order_detail_number_pp">
                        <div className="detail_left">送货时间</div>
                        <div
                            className="detail_right">{detail === null ? '' : (detail.sendType === 1 ? '随时' : (detail.sendType === 2 ? '工作日' : '非工作日'))}</div>
                    </div>
                    <div className="detail_order_item_line"/>
                    {
                        ( detail.remark !== null && "" !== detail.remark) && <div className="order_detail_number_pp">
                            <div className="detail_left">留言</div>
                            <div
                                className="detail_right">{detail.remark.length > 20 ? detail.remark.substring(0, 20) + "..." : detail.remark}</div>
                        </div>
                    }
                    <div className="detail_money">
                        <div className="detail_order_money">
                            <div className="detail_left">商品金额</div>
                            <div
                                className="detail_right">{detail !== null ? '￥' + parseInt(detail.goodsMoney) : ''}</div>
                        </div>
                        <div className="detail_line"></div>
                        <div className="detail_order_real_money_p">
                            <div className="detail_order_real_money"> 实付金额:<font
                                color="#FE007E">{detail !== null ? '￥' + parseInt(detail.amount) : ''}</font></div>
                        </div>
                    </div>
                    <div className="detail_order_item_line"/>
                    <div className="detail_order_bottom">
                        {detail.status == 8 && <div className="detail_order_bottom_button_p">
                            <button className="detail_order_bottom_button_2" onClick={() => {
                                this.onClick(1)
                            }}>删除订单
                            </button>
                            <button className="detail_order_bottom_button_1" onClick={() => {
                                this.onClick(2)
                            }}>再次购买
                            </button>
                        </div>

                        }
                        {detail.status == 2 && <div className="detail_order_bottom_button_p">
                            <button className="detail_order_bottom_button_2" onClick={() => {
                                this.onClick(3)
                            }}>申请退款
                            </button>
                        </div>
                        }
                        {detail.status == 3 && <div className="detail_order_bottom_button_p">
                            <button className="detail_order_bottom_button_2" onClick={() => {
                                this.onClick(3)
                            }}>申请退款
                            </button>
                            <button className="detail_order_bottom_button_2" onClick={() => {
                                this.onClick(4)
                            }}>查看物流
                            </button>
                            <button className="detail_order_bottom_button_1" onClick={() => {
                                this.onClick(5)
                            }}>确认收货
                            </button>
                        </div>
                        }
                        {detail.status == 5 && <div className="detail_order_bottom_button_p">
                            <button className="detail_order_bottom_button_2" onClick={() => {
                                this.onClick(6)
                            }}>售后详情
                            </button>
                        </div>
                        }
                        {(detail.status == 6 || detail.status == 7) && <div className="detail_order_bottom_button_p">
                            <button className="detail_order_bottom_button_2" onClick={() => {
                                this.onClick(6)
                            }}>售后详情
                            </button>
                            <button className="detail_order_bottom_button_2" onClick={() => {
                                this.onClick(4)
                            }}>查看物流
                            </button>
                        </div>
                        }
                    </div>
                    {OrderTab.isShow ? <ActivityIndicator toast text="Loading..." animating={true}/> : null}
                </div>);
        } else {
            return (<div/>);

        }
    }
}

export default Received;
