/**
 * Created by chengjiabing on 17/7/7.
 */
import React,{Component} from 'react';
import { Menu, ActivityIndicator, NavBar,Tabs,WhiteSpace } from 'antd-mobile';
import  './aftersales.less'
import HandleSale from './handleSale'
import SaleRecord from './saleRecord'
const TabPane = Tabs.TabPane;
import * as contants from '../../common/Apis/constants'
export default class afterSalesTab extends Component {

    callback(key) {
        const {afterSalesAction,afterSale} =this.props;
        afterSalesAction.selectTabWithIndex(key)
    }
     handleTabClick(key) {
    }
    componentDidMount() {
        document.title="我的售后";
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        )
    }
    routerWillLeave(nextLocation) {
        const {afterSalesAction,afterSale} =this.props;
        if (nextLocation.pathname === contants.commonUrl+'/orderHome') {
            afterSalesAction.selectTabWithIndex('1')
        }
    }
    render(){
        const {afterSalesAction,afterSale} =this.props;
        return(
            <div className="tabContainer">
                <Tabs defaultActiveKey={'1'}
                      swipeable={false}
                      onChange={this.callback.bind(this)} onTabClick={()=>{this.handleTabClick()}}
                      activeKey={afterSale.index}

                >
                    <TabPane tab="当前售后" key="1">
                        <HandleSale {...this.props}></HandleSale>
                    </TabPane>
                    <TabPane tab="申请记录" key="2">
                        <SaleRecord className="tabView" {...this.props}>
                            申请记录
                        </SaleRecord>
                    </TabPane>
                </Tabs>
                {afterSale.showLoading?<div className="loadingView"></div>:null
                }
            </div>
        )
    }
}
