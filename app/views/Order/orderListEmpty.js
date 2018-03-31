/**
 * Created by XiaYongjie on 2017/7/6.
 *
 */
import React, { Component } from 'react';
import './orderDetail.less';
import * as contants from '../../common/Apis/constants'
class OrderListEmpty extends Component{
    onClick() {
        const {router} = this.props;
        router.push({
            pathname: contants.commonUrl + '/applyAfterSalesService',
        });
    }
    render(){
        return( <div  style={{
            height: document.documentElement.clientHeight,
            backgroundColor:'#F4F6FE'
        }}>
            <div className="order_empty_img_p">
            <img src={require('../../images/order/order_empty.png')} className="img"/>
            </div>
            <div className="no_order">暂无相关订单</div>
            <div className="order_alert_home">
                您还没有相关订单哦，去首页看看~
            </div>
            <div className="order_empty_img_p">
                <button className="submit" onClick={()=>{this.onClick()}} > 返回首页 </button>
            </div>
        </div>);
    }
}
export default OrderListEmpty;