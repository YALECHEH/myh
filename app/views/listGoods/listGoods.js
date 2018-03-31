/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import CarouselFigure from '../homePage/carouselFigure';//轮播图
import HatlistGoods from './hatListGoods';//单个帽子
import Navigation from '../homePage/navigation';//顶部导航
import { ListView } from 'antd-mobile';
import * as contants from '../../common/Apis/constants'
import {wxShare} from '../../common/Apis/wxJsApis'
import * as db from '../../common/Apis/Utils';

export default class ListGoods extends Component {
    constructor(...args) {
        super(...args);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData=false;
        this.pageIndex=1;
        this.pageSize=10;//没有条数
        this.state={
            dataSource: dataSource,
            isLoading: true,
            requestCompleted:true//是否还有更多数据
        }
    }
    //reader前
    componentWillMount(){
        document.title="MOYAHEE";
    }
    componentDidMount(){
        let shareUrl=db.userAgent()==='Android'?encodeURIComponent(location.href.split('#')[0]):encodeURIComponent(contants.url);
        wxShare(shareUrl,[],{});
        const {ListGoods,ListGoodsActions}=this.props;
        let groupId=this.props.location.state.goodsGroup.groupId;
        console.log("类型id",groupId);
        let url="/shopping/btaingroup";
        let data={
            userId:0,
            groupId:groupId,
            pageSize:this.pageSize,
            pageIndex:this.pageIndex
        };
        ListGoodsActions.commodityList(ListGoods.commodityList,url,data,(goodsList)=>{
            if(goodsList.length<this.pageSize){
                this.setState({requestCompleted:false});
            }else {
                setTimeout(() => {
                    this.initData=true;
                }, 1000);
            }
        },()=>{});
    };
    //页面销毁
    componentWillUnmount(){
        const {ListGoods,ListGoodsActions}=this.props;
        ListGoodsActions.commodityListData([]);
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <HatlistGoods key={rowID} hatData={rowData} {...this.props}/>
            );
        };
        let transferDate=this.props.location.state;
       // console.log(transferDate);
        const {ListGoods,ListGoodsActions}=this.props;
        console.log(ListGoods.commodityList);
      return(
          <div className="ListGoodsBody">
              <Navigation  {...this.props}/>
              <ListView
                  dataSource={this.state.dataSource.cloneWithRows(ListGoods.commodityList)}
                  renderRow={row}
                  renderHeader={() => {
                      return(
                          <div className="listGoodTop">
                              <div className="commodityType">
                                  <div className="cTypeCName">
                                      <img className="typeLeft" src={require('../../images/homePage/typeLeft.png')}/>
                                      <span>{transferDate.goodsGroup.groupName}</span>
                                      <img className="typeRight" src={require('../../images/homePage/typeRight.png')}/>
                                  </div>
                                  <div className="cTypeEName">
                                      <span>{transferDate.goodsGroup.anotherName}</span>
                                  </div>
                              </div>
                              <CarouselFigure banners={transferDate.banners} {...this.props}/>
                          </div>
                      )
                  }}
                  renderFooter={() => (<div className="listViewFoot">
                      <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
                      <span>
                                {this.state.requestCompleted ? '加载中...' : '没有更多内容了'}
                             </span>
                      <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
                  </div>)}
                  className="hatListView"
                  style={{
                      height: document.documentElement.clientHeight
                  }}
                  scrollEventThrottle={200}
                  onEndReached={this.onEndReached.bind(this)}
                  onEndReachedThreshold={0}
                 />
          </div>
      )
    }
    onEndReached(){
        const {ListGoods,ListGoodsActions}=this.props;
        let groupId=this.props.location.state.goodsGroup.groupId;
        if(this.initData===false||this.state.requestCompleted===false){

        }else {
            let url="/shopping/btaingroup";
            let data={
                userId:0,
                groupId:groupId,
                pageSize:10,
                pageIndex:this.pageIndex+1
            };
            ListGoodsActions.commodityList(ListGoods.commodityList,url,data,(goodsList)=>{
                if(goodsList.length<this.pageSize){
                    this.setState({requestCompleted:false});
                }else {
                    setTimeout(() => {
                        this.initData=true;
                    }, 1000);
                }
            },()=>{});
        }
    }
}