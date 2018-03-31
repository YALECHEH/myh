/**
 * Created by AndyWang on 2017/7/6.
 */
import React,{Component} from 'react';
import './homePage.less';
import CarouselFigure from './carouselFigure';//轮播图
import Hat from './hatList';//帽子列表
import ViewMore from './viewMore';//查看更多
import Navigation from './navigation';//头部导航
import { ListView } from 'antd-mobile';
import HomePageList from './homePageList';
import * as contants from '../../common/Apis/constants'
import {wxShare} from '../../common/Apis/wxJsApis'
import * as db from '../../common/Apis/Utils';
import {hex_md5} from '../payment/md5';

export default class HomePage extends Component {
    constructor(...args) {
        super(...args);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData=false;
        this.pageIndex=1;
        this.state={
            dataSource: dataSource,
            isLoading: false,
            requestCompleted:true//是否还有更多数据
         }
    }
    //reader前
    componentWillMount(){
        let a=window.location.href.indexOf('goodsId=');
       // console.log(a);
        let arr=window.location.href.split('?');
        let goodsId;
        if(arr.length>1){
            let col=arr[1].split('&');
            col.map((val,i)=>{
                if(val.indexOf('goodsId')>-1){
                    goodsId=val.split('=')[1]
                }
            });
        }
        if(a>-1){
            this.props.router.replace({
                pathname:contants.commonUrl+'/goodDetails',
                state:{
                    "goodsId":goodsId
                }
            })
        }else{
            document.title="MOYAHEE";
        }
    }
    //在页面被渲染成功之后
    componentDidMount(){
       this.getHomepageList();
       let md5=hex_md5("wqqwqwqwqwqw").toUpperCase();
       console.log(md5);
       //localStorage.removeItem("userInfo");
    }
    getHomepageList(){
        const {HomePage,HomePageActions}=this.props;
        let url="/home/goodList";
        let a=location.href.indexOf('goodDetails');
        contants.url=location.href.split('#')[0];
        let shareUrl=db.userAgent()==='Android'?encodeURIComponent(location.href.split('#')[0]):encodeURIComponent(contants.url);
        const bodyDate={
            pageSize:5,
            pageIndex:this.pageIndex,
            goodPageSize:11
        };
        if(a>-1){

        }else{
            HomePageActions.getHomepageList(HomePage.homePageList,url,bodyDate,(data,goods)=>{
                if(data===0){
                    this.setState({isLoading:true});
                    setTimeout(() => {
                        this.initData=true;
                    }, 1000);
                    if(goods.length<5){
                        this.setState({requestCompleted:false});
                    }
                }
            },function (err) {

            });
            wxShare(shareUrl,[],{});
        }
    }
    //页面销毁
    componentWillUnmount(){
        const {HomePage,HomePageActions}=this.props;
        HomePageActions.listOfGoods([]);
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <HomePageList key={rowID} {...this.props} homePageList={rowData}/>
            );
        };
        const {HomePage}=this.props;
        console.log(HomePage.homePageList);
        return (
            <div>
            { location.href.indexOf('goodDetails')<0?
            <div className="homePageBody">
                <Navigation {...this.props}/>
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                    renderHeader={() => {
                        return(
                            <div>
                                <div className="cover">
                                    <img src={require('../../images/homePage/shouyetu1@1x.png')}/>
                                </div>
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
                    renderRow={row}
                    style={{
                        height: document.documentElement.clientHeight ,
                    }}
                    scrollEventThrottle={0}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={0}
                    className="homePageListView"/>
            </div>:null}
                </div>
        )
    }
    onEndReached(){
        if(this.initData===false||this.state.requestCompleted===false){
            return false;
           // console.log("第一页");
        }else {
          // console.log("请求数据");
           const {HomePage,HomePageActions}=this.props;
            let url="/home/goodList";
            const bodyDate={
                pageSize:5,
                pageIndex:this.pageIndex+1,
                goodPageSize:11
            };
            //console.log(bodyDate);
            //this.setState({isLoading:false});
            HomePageActions.getHomepageList(HomePage.homePageList,url,bodyDate,(data,goods)=>{
                if(data===0){
                    console.log(goods);
                    if(goods.length<5){
                        this.setState({requestCompleted:false});
                        this.pageIndex=this.pageIndex+1;
                        //this.setState({isLoading:false});
                    }
                    setTimeout(() => {
                        this.initData=true;
                    }, 1000);
                }
            },function (err) {

            });
        }
    }
}