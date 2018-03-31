/**
 * Created by XiaYongjie on 2017/7/11.
 *
 */
import React, {Component} from "react";
import './refundsDetailList.less'
import {InputItem, Picker, List, Modal} from "antd-mobile";
import {format} from '../../common/Apis/Utils'
import * as contants from '../../common/Apis/constants'
import {wxShare} from '../../common/Apis/wxJsApis'
import * as db from '../../common/Apis/Utils';

const Item = List.Item;
const alert = Modal.alert;
const CustomChildren = props => (
    <div
        onClick={props.onClick}
        className="express_item"
    >
        <div className="express_item_3">
            <div className="express_item_title">承运商</div>
            <div className="express_item_name">{props.data}</div>
        </div>
    </div>
);
export default class RefundsDetailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            number: '',
            isCommit: false,
            data: '',
            expressName: '请输入承运商名称',
            expressId: 0
        }
    }

    //reader前
    componentWillMount() {
        document.title = "售后详情";
    }

    //在页面被渲染成功之后
    componentDidMount() {
        const {afterSalesAction} = this.props;
        afterSalesAction.getSaleDetail(this.props.location.state.userId, this.props.location.state.aftersaleId, this.props.location.state.orderId);

        afterSalesAction.getExpressList();
        let url = db.userAgent() === 'Android' ? encodeURIComponent(location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});
    }

    onClick(key) {

        const {afterSalesAction, afterSale} = this.props;
        switch (key) {
            case 1: //提交
                this.alertInstance = alert('', '确定提交寄件信息?', [
                    {text: '取消', onPress: () => console.log('cancel'), style: {color: '#FE007E'}},
                    {
                        text: '确定', onPress: () => {
                        afterSalesAction.sendExpressInfo(this.props.location.state.userId, afterSale.refundInfo.aftersaleId,
                            this.state.expressName, this.state.expressId, this.state.number, afterSale.refundInfo, this.props.location.state.orderId);
                    }, style: {color: '#FE007E'}
                    },
                ]);

                break;
            case 2://撤销申请
                this.alertInstance = alert('', '确定撤销申请?', [
                    {text: '取消', onPress: () => console.log('cancel'), style: {color: '#FE007E'}},
                    {
                        text: '确定', onPress: () => {
                        afterSalesAction.cancelApplyPost(this.props.location.state.userId, afterSale.refundInfo.aftersaleId, afterSale.refundInfo);
                    }, style: {color: '#FE007E'}
                    },
                ]);
                break;
        }
    }

    changeVal(e) {
        let val = e.target.value;
        let Regx = /^[A-Za-z0-9]*$/;
        let isSub = false;
        if (Regx.test(val)) {
            if (this.state.expressName != '请输入承运商名称') {
                isSub = true;
            }
            this.setState({number: val, isCommit: isSub});
        }

    };

    onChange(value) {
        const {afterSale} = this.props;
        let label = '';
        let isSub = false;
        for (let i = 0; i < afterSale.expressList.length; i++) {
            if (value[0] === afterSale.expressList[i].value) {
                label = afterSale.expressList[i].label;
                break;
            }
        }

        if (this.state.number !== null && this.state.number !== '') {
            isSub = true;
        }
        this.setState({
            expressId: value[0],
            expressName: label,
            isCommit: isSub
        });
    };

    render() {
        const {afterSale} = this.props;
        let refundInfo = afterSale.refundInfo;
        if (refundInfo !== null) {
            return (<div style={{background: '#F2F2F2'}}>
                <div className="refund_item_empty">
                </div>
                <div className="order_detail_number">
                    <div
                        className="oder_number_left">{'申请时间:' + format(refundInfo.afterSaleCreateTime, 'yyyy-MM-dd HH:mm:ss')}</div>
                </div>
                <div className="order_detail_number">
                    <div className="oder_number_left">{'售后单号:' + refundInfo.saleOrderNo}</div>
                </div>
                {
                    refundInfo.afterSaleStatus === 4 && //处理完成 显示以退款金额
                    <div className="refund_money_p">
                        <img className="refund_money_img" src={require('../../images/refund/refund.png')}/>
                        <span className="refund_money"> {'已退款       ￥' + refundInfo.refundAmount}</span>
                    </div>
                }
                <div className="order_detail_number_p">
                    <span className="oder_number_left"> 售后进度</span>
                </div>
                <div className="flow-list">
                    <div className="new-order-flow new-p-re">
                        <ul className="new-of-storey">
                            {
                                refundInfo.orderFlow.map((item, index) => {
                                    return <li key={index}>
                                        {
                                            index === 0 ? <span className="top-white"/> : ''
                                        }
                                        {
                                            index === refundInfo.orderFlow.length - 1 ?
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
                {/**待审核状态可以撤销申请**/}
                {(refundInfo.afterSaleStatus === 1 && refundInfo.isCancelAS == 1) && <div className="submit_cancel_p_1">
                    <button className="submit_cancel_1" onClick={() => {
                        this.onClick(2)
                    }}>撤销申请
                    </button>
                </div>
                }
                {/**申请通过状态显示我已寄件可以填**/}
                {( refundInfo.afterSaleStatus === 2 && refundInfo.isCancelAS == 1) &&
                <div className="refund_number_p">
                    <Picker
                        data={afterSale.expressList}
                        cols={1}
                        onChange={v => this.onChange(v)}>
                        <CustomChildren data={this.state.expressName}></CustomChildren>
                    </Picker>
                    <div className="express_item_1">
                        <div className="express_item_title">运单号</div>
                        <input className="express_item_name" ref="myTextInput" maxLength="20"
                               value={this.state.number} onChange={v => {
                            this.changeVal(v)
                        }}
                               placeholder="请输入运单号"/>
                    </div>
                    <div className="submit_p">
                        {this.state.isCommit && <button className="submit_2" onClick={() => {
                            this.onClick(1)
                        }}>我已寄件
                        </button>
                        } {this.state.isCommit === false && <button className="submit_1">我已寄件</button>
                    }
                    </div>
                </div>
                }
                {/**处理中过状态显示我已寄件不可填**/
                }
                {
                    ( refundInfo.afterSaleStatus === 2 && refundInfo.isCancelAS == 0 && refundInfo.transportNo !== undefined&&
                        refundInfo.transportNo !== null && '' != refundInfo.transportNo) &&
                    <div className="refund_number_p">
                    <div className="express_item">
                    <div className="express_item_title_1">承运商</div>
                    <div className="express_item_name">{refundInfo.logisticsName}</div>
                    </div>
                    <div className="express_item">
                    <div className="express_item_title_1">运单号</div>
                    <div className="express_item_name">{refundInfo.transportNo}</div>
                    </div>
                    </div>
                }
                {
                    (refundInfo.checkLeaveMsg != null && '' != refundInfo.checkLeaveMsg ) &&
                    <div className="refund_msg">
                        <div className="order_detail_number_p" style={{marginTop: '0'}}>
                            <span className="oder_number_left"> 审核留言</span>
                        </div>
                        <div>
                            <span className="leave_msg">{refundInfo.checkLeaveMsg}</span>
                        </div>
                    </div>
                }
                {
                    (refundInfo.afterSaleStatus === 2 && refundInfo.isCancelAS == 1) &&
                    <div className="submit_cancel_p">
                        <button className="submit_cancel" onClick={() => {
                            this.onClick(2)
                        }}>撤销申请
                        </button>
                    </div>
                }
            </div>);
        } else {
            return (
                <dic
                    style={{
                        height: document.documentElement.clientHeight,
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <img className="imgIcon" src={require('../../images/aftersales/j1@1x.png')}></img>
                    <div>暂无申请记录</div>
                </dic>
            );
        }

    }
}