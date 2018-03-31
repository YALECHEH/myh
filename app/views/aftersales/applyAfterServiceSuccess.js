/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：申请售后服务成功
 */
import React from 'react'
import './apply_after_sales_service_success.less';
import {wxShare} from '../../common/Apis/wxJsApis'
import * as contants from '../../common/Apis/constants'
import * as db from '../../common/Apis/Utils';
export default class applyAfterSalesServiceSuccess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            message: props.location.query.type == 1 ? '您的退款服务申请已经提交成功，' : '您的退货退款服务申请已经提交成功，'
        }
    }

    componentWillMount() {
        document.title = '申请售后服务';
    }

    componentDidMount() {
        let url = db.userAgent() === 'Android' ? encodeURIComponent(window.location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});
    }

    render() {
        return (
            <div className='text5'>
                <img className='img5'
                     src={require("../../images/aftersales/apply_after_sales_service_success.png")}></img>
                <div>{this.state.message}</div>
                <div>您请你耐心等待审核。</div>
            </div>
        )
    }
}