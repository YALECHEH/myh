/**
 * Created by XiaYongjie on 2017/7/7.
 *
 */

import React, {Component} from 'react';
import {RefreshControl, ListView, Modal} from 'antd-mobile';
import OrderItem from "./orderItem";
import './orderDetail.less';
import OrderListEmpty from "./orderListEmpty";
import * as contants from '../../common/Apis/constants';
import * as db from '../../common/Apis/Utils';

const alert = Modal.alert;


function getType(type) {
    if (type == 1) {
        return '待付款';
    } else if (type == 2) {
        return '待发货';
    } else if (type == 3) {
        return '已发货';
    } else if (type == 5) {
        return '退款中';
    } else if (type == 7) {
        return '退款中';
    } else if (type == 6) {
        return '退款中';
    } else if (type == 4) {
        return '已完成';
    } else if (type == 8) {
        return '已取消';
    } else {
        return '未知订单类型';
    }
}

class Completed extends Component {
    //在页面被渲染成功之后
    componentDidMount() {
        const {OrderTab, OrderListAction} = this.props;
        let userID = db.readUserInfo()['userId'];
        OrderListAction.getOrderList([], userID, 3, this.pageSize, this.pageNow = 1, () => {
            setTimeout(() => {
                this.getMoreData = false;
            }, 1000);
        }, () => {
        });//传相应的数组
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
    }

    //页面销毁
    componentWillUnmount() {
        const {OrderTab, OrderListAction} = this.props;
        OrderListAction.hideAlert()
    }

    routerWillLeave(nextLocation) {
        if (this.alertInstance != null) {
            this.alertInstance.close();
        }
        const {OrderTab, OrderListAction} = this.props;
        if (nextLocation.pathname === contants.commonUrl + '/orderHome') {
            OrderListAction.setType('0');
            OrderListAction.clearn(6);
        }
    }

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: dataSource,
            refreshing: false,
            isLoading: false,
            hasMore: false,
            modal1: false,
            modal2: false,
            onTouch: false,
            type: 0,
            empty: [
                {
                    name: 'xiaxie',
                }
            ],
        };
        this.pageNow = 1;
        this.pageSize = 5;
        this.getMoreData = true;
        this.type = this.props.type;
    }

    // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource !== this.props.dataSource) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
            });
        }
    }


    onRefresh() {
        const {OrderTab, OrderListAction} = this.props;
        this.setState({refreshing: true});
        this.pageNow = 1
        setTimeout(() => {
            this.getMoreData = false;
            let userID = db.readUserInfo()['userId'];
            OrderListAction.getOrderList([], userID, 3, this.pageSize = 5, this.pageNow = 1, () => {
            }, () => {
            });//传相应的数组
            this.setState({
                refreshing: false,
            });
        }, 1000);
    }

    onScroll() {
    }

    getGoods(goods) {
        let newGoods = [];
        for (let i = 0; i < goods.length; i++) {
            if (goods.goodStatus === 0) {
                newGoods.push(goods[i])
            }
        }
        return newGoods;
    }

    onClick(key, rowData) {

        this.state.onTouch = true;
        const {OrderTab, OrderListAction} = this.props;
        let array = OrderTab.completedList;
        let allAry = OrderTab.allList;
        let userID = db.readUserInfo()['userId'];

        switch (key) {

            case 10:
                //删除订单
                console.log('----------------------->删除订单');
                this.alertInstance = alert('', '确定删除该订单?', [
                    {text: '取消', onPress: () => console.log('cancel'), style: {color: '#FE007E'}},
                    {
                        text: '确定', onPress: () => {
                        OrderListAction.deleteOrCancelOrderPost(rowData.orderId, 1, userID, array, allAry,);//传相应的数组
                    }, style: {color: '#FE007E'}
                    },
                ]);
                break;
            case 11:
                //再次购买
                let goods = this.getGoods(rowData.goods);
                if (goods.length > 0) {
                    OrderListAction.buyAgainWithOrder(userID, goods, () => { //10000 用户id
                        this.props.router.push({
                            pathname: contants.commonUrl + '/shoppingCart'
                        });
                    })
                } else {
                    this.alertInstance = alert('', '订单中的商品还未上架，不能购买', [
                        {text: '取消', onPress: () => console.log('cancel'), style: {color: '#FE007E'}},
                        {
                            text: '确定', onPress: () => {
                            OrderListAction.deleteOrCancelOrderPost(rowData.orderId, 1, userID, array, allAry,);//传相应的数组
                        }, style: {color: '#FE007E'}
                        },
                    ]);
                }
                break;

        }
    }

    onEndReached() {
        const {OrderTab, OrderListAction} = this.props;
        if (this.getMoreData === false && OrderTab.isShow === false) {
            console.log('on end reach')
            const {OrderTab, OrderListAction} = this.props;
            let userID = db.readUserInfo()['userId'];
            OrderListAction.getOrderList(OrderTab.completedList, userID, 3, this.pageSize = 5, this.pageNow + 1, () => {
                this.getMoreData = false;
                this.pageNow = this.pageNow + 1;
            }, () => {
            });//传相应的数组
        }
        this.getMoreData = true;
    }

    onItemClick(rowData) {
        if (rowData === this.state.empty[0]) {
            return;
        }
        if (this.state.onTouch) {
            this.state.onTouch = false;
        } else {
            this.goMyOrderDetail(rowData);
        }
    }

    //跳转已完成我的订单详情
    goMyOrderDetail(rowData) {
        const {OrderTab, OrderListAction} = this.props;
        OrderListAction.clearn(5);
        const {router} = this.props;
        router.push({
            pathname: contants.commonUrl + '/toBeReceived',
            state: {
                status: rowData.status, //订单状态
                orderId: rowData.orderId, //订单id
                deliverCompanyName: rowData.logisticsName, // 物流公司名称
                deliverCompanyNo: rowData.logisticsCode,  // 物流公司对应码
                transportNo: rowData.transportNo, //运单号
                createTime: rowData.createTime,
            }
        });
    };

    getItem(dates) {
        let item = [];
        if (dates instanceof Array) {
            let that = this;
            for (let i = 0; i < dates.length; i++) {
                let shop = dates[i];
                item.push([
                    <li className="shop_li">
                        <div className={i === dates.length - 1 ? "shop_item_2" : "shop_item"}>
                            <div className="shop_icon_p">

                                {shop.goodStatus === 1 &&
                                <img className="shop_icon_state"
                                     src={require('../../images/order/o6@1.5x.png')}/>} {/*已失效*/}
                                {shop.goodStatus === 2 &&
                                <img className="shop_icon_state"
                                     src={require('../../images/order/o5@1.5x.png')}/>} {/*已下架*/}
                                {shop.goodStatus === 3 &&
                                <img className="shop_icon_state"
                                     src={require('../../images/order/o4@1.5x.png')}/>}{/*已告罄*/}
                                <img className="shop_icon" src={shop.hostUrl + shop.zoomUrl}/>
                            </div>
                            <div className="shop_att">
                                <div
                                    className="shop_name">{shop.goodsName !== null ?
                                    (shop.goodsName.length > 18 ? shop.goodsName.split(0, 18) + "..." : shop.goodsName)
                                    : ''}</div>
                                <div className="shop_number_p">
                                    <div className="shop_format">{that.getDes(shop.specifications)}</div>
                                    <div className="shop_count">{'x' + shop.goodsNum}</div>
                                </div>
                                <div className="shop_money">{'￥' + parseInt(shop.goodsPrice)}</div>
                            </div>
                        </div>
                    </li>
                ])
            }
        }
        return item;
    }

    getDes(specifications) {
        if (specifications instanceof Array) {
            let des = '';
            for (let i = 0; i < specifications.length; i++) {
                des = des + specifications[i].type + ':' + specifications[i].name + "                                       ";
            }
            return des;
        }
    }

    render() {

        const separator = (sectionID, rowID) => (
            array.length - 1 == rowID ? <div key={rowID}/> :
                <div
                    key={rowID}
                    className="order_list_between"
                />
        );
        const row = (rowData, sectionID, rowID) => {
            let obj = rowData;
            if (obj === this.state.empty[0]) {
                return (<OrderListEmpty {...this.props} />);
            } else {
                return (
                    <div className="order_list_item" onClick={() => this.onItemClick(rowData)}>
                        <div className="order_number_p">
                            <div className="order_number">{"订单号:" + obj.orderNo}</div>
                            <div className="order_type">{getType(obj.status)}</div>
                        </div>
                        {obj.goods === null ? <div/> : <ul className="shop_list">{this.getItem(obj.goods)}</ul>}
                        <div className="order_list_item_bottom">
                            <div className="order_alert_item_money"> 共计<font color="#FE007E">{obj.orderNum}</font>件商品,
                                实付:<font
                                    color="#FE007E">{'￥' + parseInt(obj.amount)}</font></div>
                            <div className=" order_bottom_btn">
                                {/*已完成或者已取消*/}
                                {obj.status == 4 &&
                                <div style={{float: 'right', display: 'flex'}}>
                                    <button name='reimburse' className="order_button_refunds" onClick={() => {
                                        this.onClick(10, rowData)
                                    }}>删除订单
                                    </button>
                                    <button name='receipt' className="order_button_insure" onClick={() => {
                                        this.onClick(11, rowData)
                                    }}>再次购买
                                    </button>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                );
            }
        };
        const {OrderTab, OrderListAction} = this.props;
        let array = [];
        if (OrderTab.completedList.length === 0) {
            array = this.state.empty;
        } else {
            array = OrderTab.completedList;
        }
        return (
            <ListView
                dataSource={this.state.dataSource.cloneWithRows(array)}
                renderRow={row}
                renderSeparator={separator}
                scrollRenderAheadDistance={200}
                scrollEventThrottle={20}
                initialListSize={5}
                pageSize={5}
                onScroll={this.onScroll}
                style={{
                    height: document.documentElement.clientHeight,
                }}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={10}
                scrollerOptions={{scrollbars: true}}
                refreshControl={<RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                />}
                renderFooter={() => (
                    <div>
                        <div className="my_listViewFoot">
                            <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
                            <span>
                                {this.state.requestCompleted ? '加载中...' : '没有更多内容了'}
                             </span>
                            <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
                        </div>
                        <div className="list_bottom_fill"/>
                    </div>)}
            />
        );

    }
}

export default Completed;