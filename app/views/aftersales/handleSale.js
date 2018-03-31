/**
 * Created by chengjiabing on 17/7/8.
 * 当前售后
 */
import React,{Component} from 'react';
import {ActivityIndicator,WhiteSpace, ListView,RefreshControl,Modal } from 'antd-mobile';
import  './aftersales.less'
import {format} from '../../common/Apis/Utils'
import * as contants from '../../common/Apis/constants'
import Alert from '../../common/components/Alert'
const alert = Modal.alert;
import {wxShare} from '../../common/Apis/wxJsApis'
import * as db from '../../common/Apis/Utils';
import {readUserInfo} from '../../common/Apis/Utils'
export default class handleSale extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource:dataSource,
            refreshing: false,
        };
        this.pageNow=1;
        this.pageSize=5;
        this.getMoreData=true;
    }
    onRefresh() {
        console.log('onRefresh()')
        this.getMoreData=true;
        const {afterSalesAction,afterSale} =this.props;
        this.setState({refreshing: true});
        console.log(this.getMoreData)
        this.pageNow=1;
        afterSalesAction.getHandleSaleListPost([],this.pageNow,this.pageSize,()=>{
        });
        setTimeout(() => {
            this.setState({
                refreshing: false,
            });
            this.getMoreData=false;
        }, 1000);
    }
    onScroll() {
    }
    componentDidMount() {
        const {afterSalesAction,afterSale} =this.props;
        afterSalesAction.getHandleSaleListPost([],this.pageNow,this.pageSize,()=>{
            setTimeout(() => {
                this.getMoreData=false;
            }, 1000);
        })
        let url = db.userAgent() === 'Android' ? encodeURIComponent(location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});
    }
    cellCick(rowData)
    {
        let userInfo = readUserInfo();
        if(userInfo===null)
        {
            alert('提示', '获取用户信息失败', [
                {
                    text: '确定', onPress: () => {
                }, style: 'default'
                },
            ])
            return;
        }
        if(rowData.afterSaleType===1)//退款
            this.props.router.push({
                pathname:contants.commonUrl+'/refundProgress',
                state:{
                    aftersaleId:rowData.afterSaleId,
                    saleOrderNo:rowData.saleOrderNo,
                    orderId:rowData.orderId,
                    userId:userInfo.userId,
                    applyTime:format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss')
                }
            });
        if(rowData.afterSaleType===2)//退货退款
            this.props.router.push({
                pathname:contants.commonUrl+'/refundsDetailList',
                state:{
                    aftersaleId:rowData.afterSaleId,
                    orderId:rowData.orderId,
                    userId:userInfo.userId,
                    applyTime:format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss'),
                    saleOrderNo:rowData.saleOrderNo,
                }

            });
    }
    componentWillUnmount() {
        const {afterSalesAction,afterSale} =this.props;
        afterSalesAction.hideAlert()
    }
    componentWillReceiveProps(props) {
        // console.log('componentWillReceiveProps')
        // console.log(props.afterSale.showLoading+' '+props.afterSale.handerSaleList.length)
    }
    getRow(rowData, sectionID, rowID)
    {
        let name = rowData.goodsName;
        if(rowData==='noData')
        {
            return(
                <dic className="noData"
                >
                    <img className="imgIcon" src={require('../../images/aftersales/j1@1x.png')}></img>
                    <div className="noDataText">暂无申请记录</div>
                </dic>
            )
        }
        if(name&&name.length>18)
            name = name.substring(0,18)
        return (
            <div onClick={()=>{this.cellCick(rowData)}} className="cellCheng" >
                <div className="marginGray"></div>
                <div className="orderIdContainer1">
                    <span className="orderName">申请时间:{format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss')}</span>
                </div>
                <div className="info">
                    <div className="imgContainer1">
                        <img className="img11"
                             src={rowData.goodsZoomURL}
                        />
                        <div className="lable">共{rowData.goodsNum}件商品</div>
                    </div>
                    <div className="right">
                        <div className="title1">{name}</div>
                        <div className="money">退款金额¥:{rowData.refundAmount}</div>
                    </div>
                </div>
                <div className="bottomStyle">
                    <div className="handle">
                        <img src={require('../../images/aftersales/j3@1x.png')}></img>
                        <div className="drawBack">
                            退款中
                        </div>
                    </div>
                    <div className="status">
                        <span className="text">您的售后服务已申请,请耐心等待...</span>
                        <img src={require('../../images/aftersales/j7@1x.png')} />
                    </div>
                </div>

            </div>)
    }
    render() {
        const {afterSalesAction,afterSale} =this.props;
        const separator = (sectionID, rowID) => (
            <div
                key={rowID}
                className="order_list_between"
            />
        );
        let ary =afterSale.handerSaleList;
        if(ary.length===0||ary===null)
            ary=['noData']
        console.log(ary)
        return(
            <div>
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(ary)}
                    renderRow={this.getRow.bind(this)}
                    initialListSize={5}
                    style={{
                        height: document.documentElement.clientHeight,
                    }}
                    pageSize={5}
                    scrollerOptions={{scrollbars: true}}
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}

                    />}
                    className="handleSaleListView"
                    onEndReached={this.onEndReached.bind(this)}
                    scrollEventThrottle={0}
                    scrollRenderAheadDistance={200}
                    renderFooter={afterSale.handerSaleList.length>0?this.getFooter.bind(this):null
                    }
                />
            </div>
        )

    }
    //                          onEndReachedThreshold={100}
//    scrollRenderAheadDistance={200}                         scrollEventThrottle={20} document.documentElement.clientHeight
    getFooter()
    {
        return(
            <div className="listViewFootC">
                <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
                <span>
                                {this.state.requestCompleted ? '加载中...' : '没有更多内容了'}
                             </span>
                <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
            </div>
        )
    }
    onEndReached()
    {
        const {afterSalesAction,afterSale} =this.props;
        if(this.getMoreData===false&&afterSale.showLoading===false)
        {
            this.getMoreData=true;
            const {afterSalesAction,afterSale} =this.props;
            afterSalesAction.getHandleSaleListPost(afterSale.handerSaleList,this.pageNow+1,this.pageSize,(count)=>{
                if(count>0)
                    this.pageNow=this.pageNow+1;
                setTimeout(() => {
                    this.getMoreData=false;
                    // console.log(this.getMoreData)
                }, 1000);
            })
        }
    }
}

