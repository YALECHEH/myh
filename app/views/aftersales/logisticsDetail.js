/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：物流详情页
 */
import React from 'react';
import './logistics_detail.less'
import {post, myGet} from '../../common/Apis/Fetch.js';
import {ActivityIndicator} from "antd-mobile";
import * as db from '../../common/Apis/Utils';
import {wxShare} from '../../common/Apis/wxJsApis';
import * as contants from '../../common/Apis/constants'

export default class logisticsDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            totalNum: '',
            pictureUrl: '',
            status: '',
            orderId: '',
            deliverCompanyName: '',
            deliverCompanyNo: '',
            transportNo: '',
            transportStatus: '',
            isShow: true
        }
    }

    componentWillMount() {
        document.title = '物流跟踪';
    }

    componentDidMount() {
        let url = db.userAgent() === 'Android' ? encodeURIComponent(location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});
        this.state.totalNum = this.props.location.query.totalNum;//商品数量
        this.state.pictureUrl = this.props.location.query.url;//图片url
        let status = this.props.location.query.status;//订单是否已收货
        let orderId = this.props.location.query.orderId;//订单号
        this.state.deliverCompanyName = this.props.location.query.deliverCompanyName;//物流公司
        let deliverCompanyNo = this.props.location.query.deliverCompanyNo;//物流公司对应码
        this.state.transportNo = this.props.location.query.transportNo;//运单编号
        if (status != 4) {
            this.state.transportStatus = '正在运输中'
            let params = {
                deliverCompanyNo: deliverCompanyNo,//'wanxiangwuliu',
                transportNo:this.state.transportNo// '11810310136962'
            }
            post('/transportInfo/getTransportInfoByKuaidi100', params, (data) => {
                this.setState({isShow: false});
                if (data.status === 0) {
                    this.state.data = data.body.data;
                    this.forceUpdate();
                } else {
                    console.log(data.message);
                }
            }, (err) => {
                this.setState({isShow: false});
                console.log(err);
            })
        } else {
            this.state.transportStatus = '已收货'
            let params = {
                orderId: orderId
            }
            post('/transportInfo/getTransportInfo', params, (data) => {
                console.log(data)
                this.setState({isShow: false});
                if (data.status === 0) {
                    this.state.data = data.body.data.data;
                    this.state.deliverCompanyName = data.body.data.deliverCompanyName;
                    this.state.transportNo = data.body.data.transportNo;
                    this.state.totalNum = data.body.data.goodsNum;
                    this.state.pictureUrl = data.body.data.hostUrl + data.body.data.zoomUrl;
                    this.forceUpdate();
                } else {
                    console.log(data.body)
                }
            }, (err) => {
                this.setState({isShow: false});
                console.log(err)
            })
        }
    }

    findPhone(str) {
        let arr = str.match((/((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\d3,4|\d{3,4}-|\s)?\d{7,14}))?/g));
        let s1 = str;
        let phone = '';
        let s2 = '';
        for (let pho of arr) {
            if (pho.length == 11) {
                let index = str.indexOf(pho);
                s1 = str.substring(0, index);
                phone = pho;
                s2 = index + 11 > str.length ? '' : str.substring(index + 11);
                break;
            }
        }
        return {
            s1,
            phone,
            s2
        }
    }

    render() {
        return (

            <div>
                <div className="empty-view1"></div>
                <div className="new-order-track">
                    <div className="img-content">
                        <img src={this.state.pictureUrl}/>
                        <div>共<span>{this.state.totalNum}</span>件商品</div>
                    </div>
                    <div className="title">
                        <div className="top"><span>物流状态:</span><span
                            className="leftText">{this.state.transportStatus}</span></div>
                        <div className="cen"><span>承运来源:</span><span
                            className="text1">{this.state.deliverCompanyName}</span></div>
                        <div className="btm3"><span>运单编号:</span><span className="text1">{this.state.transportNo}</span>
                        </div>
                    </div>
                </div>
                <div className="progressTitle">物流进度</div>
                <div className="flow-list-l">
                    <div className="new-order-flow-l new-p-re-l">
                        <ul className="new-of-storey-l">
                            {
                                this.state.data.map((item, index) => {
                                    let arr = this.findPhone(item.context);
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
                                        <span className={index === 0 ? 'first' : ''}>
                                        <font>{arr.s1}</font>
                                              <font className="phone">{arr.phone}</font>
                                              <font>{arr.s2}</font>
                                    </span>
                                        <span>
                                        {item.time}
                                    </span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>

                <ActivityIndicator
                    toast
                    text="Loading..."
                    animating={this.state.isShow}
                />
            </div>


        );
    }
}
