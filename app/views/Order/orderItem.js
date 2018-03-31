/**
 * Created by XiaYongjie on 2017/7/7.
 *
 */
import React, {Component} from "react"
import './orderDetail.less'
import * as contants from '../../common/Apis/constants';

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.goods,
            type:this.props.type
        }
        console.log('shops',this.state.data)
    }

    onClick(shop) {
        if (this.state.type == 1) {
            this.props.router.push({
                pathname:contants.commonUrl+'/goodDetails',
                state:{
                    goodsId:shop.goodsId
                }
            });
        }
    }

    getDes(specifications) {
        if (specifications instanceof Array) {
            let des = '';
            for (let i = 0; i < specifications.length; i++) {
                des = des + specifications[i].type + ':' + specifications[i].name+"                                       ";
            }
            return des;
        }
    }

    getItem(dates) {
        let item = [];
        if (dates instanceof Array) {
            let that = this;
            for (let i = 0; i < dates.length; i++) {
                let shop = dates[i];
                item.push([
                    <li className="shop_li" onClick={() => {
                        that.onClick(shop)
                    }}>
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

    render() {
        if (this.state.data !== null) {
            return (
                <ul className="shop_list">
                    {this.getItem(this.state.data)}
                </ul>);
        } else {
            return (
                <div>
                </div>);
        }
    }
}

export default OrderItem;
