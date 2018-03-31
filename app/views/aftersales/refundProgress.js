/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：退款进度详情
 */
import React from 'react';
import './refund_progress.less';
import '../refunds/refundsDetailList.less'
import {post} from "../../common/Apis/Fetch";
import {format} from '../../common/Apis/Utils'
import {ActivityIndicator, Toast} from "antd-mobile";
import * as db from '../../common/Apis/Utils';
import {wxShare} from '../../common/Apis/wxJsApis'
import * as contants from '../../common/Apis/constants'

export default class refundProgress extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            aftersaleId: '',
            applyTime: '',
            reviewMessage: '',
            refundMoney: null,
            quit: true,
            quitStatus: true,
            showLoading: true,
            orderStatus: null,
            saleOrderNo: ''
        }
    }


    componentWillMount() {
        document.title = '售后详情';
    }

    componentDidMount() {
        let url = db.userAgent() === 'Android' ? encodeURIComponent(window.location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});
        let aftersaleId = this.props.location.state.aftersaleId;
        let params = (aftersaleId == undefined || aftersaleId == null) ? {
            orderId: this.props.location.state.orderId,
            userId: db.readUserInfo()['userId'],
            // aftersaleId: this.props.location.state.aftersaleId
        } : {
            orderId: this.props.location.state.orderId,
            userId: db.readUserInfo()['userId'],
            aftersaleId: aftersaleId
        }
        console.log(params)
        post('/afterSale/getRefundInfo', params, (data) => {
            console.log(data)
            this.setState({showLoading: false});
            if (data.status === 0) {
                this.state.applyTime = format(data.body.refundInfo.afterSaleCreateTime, 'yyyy-MM-dd HH:mm:ss');
                this.state.aftersaleId = data.body.refundInfo.aftersaleId;
                this.state.reviewMessage = data.body.refundInfo.checkLeaveMsg;
                this.state.refundMoney = data.body.refundInfo.refundAmount;
                this.state.quit = data.body.refundInfo.isCancelAS == 1 ? true : false;//1表示可撤销
                this.state.data = data.body.refundInfo.orderFlow;
                this.state.orderStatus = data.body.refundInfo.orderStatus;
                this.state.saleOrderNo = data.body.refundInfo.saleOrderNo
                this.forceUpdate();
            } else {
                console.log(data.msg);
            }
        }, (err) => {
            this.setState({showLoading: false});
            console.log(err)
        })
    }

    quitApply() {

        let params = {
            userId: db.readUserInfo()['userId'],
            aftersaleId: this.state.aftersaleId
        }
        this.setState({showLoading: true});
        post('/afterSale/cancelAfterSale', params, (data) => {
            this.setState({showLoading: false});
            if (data.status == 0) {
                if (data.body.cancelStatus == 1) {
                    this.setState({quitStatus: false});
                    Toast.info("撤销成功");
                }
            }
            else {
                Toast.info("撤销失败");
            }
        }, (err) => {
            console.log('-----撤销-------', '失败')
            this.setState({showLoading: false});
            Toast.info(err);
        })
    }

    render() {
        return (
            <div>
                <div className="empty-view"></div>
                <div className="refundHeader1">
                    <div className="applyTime"><span>申请时间:</span><span>{this.state.applyTime}</span></div>
                    <div className="afterOrderNum"><span>售后单号:</span><span>{this.state.saleOrderNo}</span></div>
                </div>
                {this.state.orderStatus == 15 &&
                <div className="refundSuccess">
                    <div><img src={require("../../images/aftersales/refund_success.png")}/></div>
                    <div><span>已退款</span><span>&nbsp;&nbsp;&nbsp;¥{this.state.refundMoney}</span></div>
                </div>
                }
                <div className="refundBody">
                    <div className="textTitle">售后进度</div>
                    <hr className="hr"/>
                    <div className="flow-list">
                        <div className="new-order-flow new-p-re">
                            <ul className="new-of-storey">
                                {
                                    this.state.data.map((item, index) => {
                                        return <li key={index}>
                                            {
                                                index === 0 ? <span className="top-white"/> : ''
                                            }
                                            {
                                                index === this.state.data.length - 1 ?
                                                    <span className="bottom-white"/> : ''
                                            }
                                            <div className={`icon ${index === 0 ? 'on' : ''}`}>
                                                {index === 0 && <div className={'icon1'}>
                                                </div>}
                                            </div>
                                            <span>
                                        {item.orderFlowMsg}
                                    </span>
                                            <span>
                                        {format(item.orderFlowTime, 'yyyy-MM-dd HH:mm:ss')}
                                    </span>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>

                {this.state.reviewMessage && <div className="refundFoot">
                    <div className="textTitle">审核留言</div>
                    <hr className="re-hr"/>
                    <div className="textContent">{this.state.reviewMessage}</div>
                </div>}

                {(this.state.quit && this.state.quitStatus) &&
                <div className="quit3" onClick={this.quitApply.bind(this)}>撤销申请</div>}
                {(this.state.quit && !this.state.quitStatus) && <div className="quitUnClick">撤销申请</div>}

                <ActivityIndicator
                    toast
                    text="Loading..."
                    animating={this.state.showLoading}
                />
            </div>
        )
    }
}



