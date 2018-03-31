/**
 * Created by XiaYongjie on 2017/7/10.
 *
 */

import React, {Component} from 'react';
import './orderDetail.less';
import OrderItem from "./orderItem";


function getType(type) {
    if (type == 1) {
        return '待付款';
    } else if (type ==2) {
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
class DetailPublic extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:this.props.data,
        }

    }

    render() {
        return (
            <div>
                <div className="order_detail_number_pp">
                    <div className="detail_number">{'订单号:' + this.state.data.orderNo}</div>
                    <div
                        className="detail_type">{getType(this.state.data.status)}</div>
                </div>
                <div className="detail_order_item_line"/>
                <div className="order_detail_number_pp">
                    <span className="order_detail_receive_1">收货信息</span>
                </div>
                <div className="detail_address">
                    <div className="address_people_msg">
                        <div className="people_name">
                            <img src={require('../../images/order/order_people_name.png')}
                                 className="people_msg_img_1"/>
                            <span className="address_msg"> {this.state.data.userName}</span>
                        </div>
                        <div className="people_phone">
                            <img src={require('../../images/order/order_people_phone.png')}
                                 className="people_msg_img_2"/>
                            <span className="address_msg">{this.state.data.mobile}</span>
                        </div>
                    </div>
                    <div className="address_msg_p">
            <span className="address_msg">
                {this.state.data.address}
            </span>
                    </div>
                </div>
                <div className="detail_order_item_line"/>
                <div className="order_detail_receive_2">
                    商品信息
                </div>
                <OrderItem goods={this.state.data.goods} type="1" {...this.props}/>
            </div>);
    }
}

export default DetailPublic;