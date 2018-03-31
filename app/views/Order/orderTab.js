/**
 * Created by XiaYongjie on 2017/7/11.
 *
 */
import React, {Component} from 'react';
import {Tabs} from "antd-mobile";
import OrderList from "./orderListData";
import './myOrderListEmpty.less'
import PendPayment from "./pendPayment";
import ToBeReceived from "./toBeReceived";
import Completed from "./completed";
import {wxShare} from '../../common/Apis/wxJsApis'
import * as db from '../../common/Apis/Utils';
import * as contants from '../../common/Apis/constants';

const TabPane = Tabs.TabPane;
export default class OrderTab extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            key: this.props.location.query.orderStatus,
        }
    }

    //reader前
    componentWillMount() {
        document.title = "我的订单";
    }

    onChange(v) {
        const {OrderListAction} = this.props;
        OrderListAction.setType(v);
    }

    componentDidMount() {
        const {OrderTab, OrderListAction} = this.props;
        if (OrderTab.myTabType === '0') {
            OrderListAction.setType(this.props.location.query.orderStatus + '');
        }
        let url = db.userAgent() === 'Android' ? encodeURIComponent(location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
    }

    routerWillLeave(nextLocation) {
        const {OrderListAction} = this.props;
        if (nextLocation.pathname === contants.commonUrl + '/orderHome') {
            OrderListAction.setType('0');
            OrderListAction.clearn(6);
        }
    }

    //页面销毁
    componentWillUnmount() {
        const {OrderTab, OrderListAction} = this.props;
    }

    render() {
        const {OrderTab} = this.props;
        let key = OrderTab.myTabType;
        let pendPaymentList = OrderTab.pendPaymentList //待付款
        let toBeReceivedList = OrderTab.toBeReceivedList//待收货
        let completedList = OrderTab.completedList//完成
        let allList = OrderTab.allList//全部
        return (
            <div className="tabContaiCheng">
                <Tabs className="tab" swipeable={false}
                      defaultActiveKey={'1'} onChange={v => {
                    this.onChange(v)

                }} activeKey={
                    key
                }
                >
                    <TabPane tab="待付款" key="1" className={pendPaymentList.length > 0 ? 'tab_1' : 'tab_2'}>
                        <PendPayment type="1" {...this.props}/>
                    </TabPane>
                    <TabPane tab="待收货" key="2" className={toBeReceivedList.length > 0 ? 'tab_1' : 'tab_2'}>
                        <ToBeReceived type="2" {...this.props}/>
                    </TabPane>
                    <TabPane tab="已完成" key="3" className={completedList.length > 0 ? 'tab_1' : 'tab_2'}>
                        <Completed type="3" {...this.props}/>
                    </TabPane>
                    <TabPane tab="全部订单" key="4" className={allList.length > 0 ? 'tab_1' : 'tab_2'}>
                        <OrderList type="4"{...this.props}/>
                    </TabPane>
                </Tabs>
            </div>);
    }
}

