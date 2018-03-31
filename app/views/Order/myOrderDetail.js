/**
 * Created by XiaYongjie on 2017/7/19.
 *
 */
import React, {Component} from "react"
import {wxShare} from '../../common/Apis/wxJsApis'
import * as contants from '../../common/Apis/constants'
import * as db from '../../common/Apis/Utils';
import Received from "./reacived";
import PPOrderDetailsManage from "../PPOrderDetailsManage/PPOrderDetailsManage";
import {ActivityIndicator} from "antd-mobile";

export default class MyOrderDetail extends Component {
    componentDidMount() {
        const {OrderListAction} = this.props;
        let userID = db.readUserInfo()['userId'];
        OrderListAction.getOrderDetail(userID, this.state.orderId);
        let url = db.userAgent() === 'Android' ? encodeURIComponent(location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
    }

    routerWillLeave(nextLocation) {
        const {OrderListAction} = this.props;
        OrderListAction.clearn(5);
    }

    //reader前
    componentWillMount() {
        document.title = "订单详情";
    }

    //页面销毁
    componentWillUnmount() {
        const {OrderTab, OrderListAction} = this.props;
        OrderListAction.hideAlert()
    }

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
    }

    render() {
        const {OrderTab} = this.props;
        let detail = OrderTab.orderDetail;
        if (detail !== null) {
            if (detail.status == 4) {
                return (<div>
                    <PPOrderDetailsManage data={detail} {...this.props} />
                    {OrderTab.isShow ? <ActivityIndicator toast text="Loading..." animating={true}/> : null}
                </div>)
            } else {
                return (<div>
                    <Received data={detail} {...this.props} />
                    {OrderTab.isShow ? <ActivityIndicator toast text="Loading..." animating={true}/> : null}
                </div>)
            }

        } else {
            return (<div/>)
        }
    }
}