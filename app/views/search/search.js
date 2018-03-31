/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './search.less';
import HatlistGoods from '../listGoods/hatListGoods';//单个帽子
import PopularRecommendation from './popularRecommendation';//热门推荐
import { ListView } from 'antd-mobile';
import * as contants from '../../common/Apis/constants'
import {wxShare} from '../../common/Apis/wxJsApis';
import * as db from '../../common/Apis/Utils';

export default class Search extends Component {
    constructor(...args) {
        super(...args);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.keyword=null;
        this.currentPage=1;
        //this.requestCompleted=true;
        this.state={
            dataSource: dataSource,
            historicalS:[],
            requestCompleted:true//是否还有下一页
        }
    }
    //reader前
    componentWillMount(){
        document.title="搜索";
    }
    //在页面被渲染成功之后
    componentDidMount(){
        let shareUrl=db.userAgent()==='Android'?encodeURIComponent(location.href.split('#')[0]):encodeURIComponent(contants.url);
        wxShare(shareUrl,[],{});
        this.popularSearches();//获取热门搜索列表
        const {Search,SearchActions}=this.props;
        SearchActions.historyList();
    }
    //页面销毁
    componentWillUnmount(){
        const {Search,SearchActions}=this.props;
        SearchActions.searchResults(false);
    }
    //获取热门搜索接口
    popularSearches(){
        const {Search,SearchActions}=this.props;
        let url="/goods/hotsearch";
        let data={
            userId:0
        };
        SearchActions.popularSearches(url,data,()=>{},()=>{})
    };
    //搜索列表
    popularSearchesList(popularSearches){
        if(popularSearches.length===0){
            return(
                <div></div>
            )
        }else {
            return(
                <div className="popularSearches">
                    <div className="PSTitle">
                        <label>热门搜索</label>
                    </div>
                    <div className="PSList">
                        {popularSearches.map((val,index)=>{
                            let goodName=val.goodName.substring(0,5);
                            return(
                                <button key={index} onClick={()=>{this.clickSearch(goodName)}} >{goodName}</button>
                            )
                        })}
                    </div>
                </div>
            )
        }
    }
    //历史记录列表
    historicalSearchList(historicalS){
        console.log(historicalS);
        if(historicalS.length===0){
            return(
                <div></div>
            )
        }else {
            return(
                <div className="historicalSearch">
                    <div className="HSTitle">
                        <label>搜索历史</label>
                        <img src={require('../../images/search/deleteImg.png')} onClick={()=>{this.deleteSearch()}}/>
                    </div>
                    <div className="HSList">
                        {historicalS.map((val,index)=>{
                            return(
                                <div className="HSLbody" key={index} onClick={()=>{this.clickSearch(val.searchName)}}>
                                    <div className="HSLText">
                                        <img src={require('../../images/search/historicalSearch.png')}/>
                                        <label>{val.searchName}</label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
    }
    //点击按钮搜索
    clickSearch(val){
        //调用搜索接口
        document.getElementById("searchInput").value=val;
        this.keyword=val.toString();
        this.currentPage=1;
        const {Search,SearchActions}=this.props;
        let url="/search/searchGoods";
        let data={
            keyword:val.toString(),
            currentPage:this.currentPage
        };
        SearchActions.searchForProductsData([]);
        SearchActions.searchForProducts(Search.searchForProducts,url,data,(searchData)=>{
            if(searchData.length<8){
                this.setState({requestCompleted:false});
            }
        },()=>{});
    };
    render() {
        const {Search}=this.props;
        console.log("搜索数据",Search.searchForProducts);
        const row = (rowData, sectionID, rowID) => {
            return (
                <HatlistGoods key={rowID} hatData={rowData} {...this.props}/>
            );
        };
        return (
            <div className="searchBody">
                <div className="SBody">
                    <div className="SBodyLeft">
                        <img src={require('../../images/search/searchImg.png')}/>
                        <form className="SBodyRight" action="javascript:return true;" onSubmit={()=>{this.searchCommodity();}}>
                            <input id="searchInput" type="search" placeholder="巴拿马草帽"/>
                        </form>
                    </div>
                    <label className="SBodyRifht" onClick={()=>{this.cancelInput()}}>取消</label>
                </div>
                {Search.searchResults?<div className="searchBottom">
                    {Search.searchForProducts.length===0?<div>
                        <div className="searchPromptText">
                            <span>暂时没有搜索到相关产品</span>
                        </div>
                        <PopularRecommendation {...this.props}/>
                    </div>:<div>
                        <div>
                            <ListView
                                dataSource={this.state.dataSource.cloneWithRows(Search.searchForProducts)}
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
                                scrollEventThrottle={200}
                                onEndReached={this.onEndReached.bind(this)}
                                onEndReachedThreshold={0}
                                className="searchListView"/>
                        </div>
                    </div>}
                </div>:<div className="searchBottom">
                    {this.popularSearchesList(Search.popularSearches)}
                    {this.historicalSearchList(Search.historicalS)}
                    <div>
                        <div>
                          <PopularRecommendation {...this.props}/>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
    //取消按钮
    cancelInput(){
        document.activeElement.blur();
        document.getElementById("searchInput").value="";
        const {Search,SearchActions}=this.props;
        SearchActions.searchResults(false);
        SearchActions.searchForProductsData([]);
    };
    //添加历史记录
    searchCommodity(){
        document.activeElement.blur();
        setTimeout(() => {
            const {Search,SearchActions}=this.props;
            let searchInput=document.getElementById("searchInput").value;
            if(searchInput===null||searchInput===""){
                alert("请输入搜索信息")
            }else {
                this.clickSearch(searchInput);
                SearchActions.addSearchCommodity(searchInput,()=>{
                    this.props.SearchActions.historyList();
                });
            }
        }, 400);
    };
    //清空历史记录
    deleteSearch(){
        localStorage.removeItem("historicalSearch");
        this.props.SearchActions.historyList();
    };
    onEndReached(){
        if(this.state.requestCompleted===false){

        }else {
            const {Search,SearchActions}=this.props;
            let url="/search/searchGoods";
            let data={
                keyword:this.keyword,
                currentPage:this.currentPage+1
            };
            console.log(data);
            SearchActions.searchForProducts(Search.searchForProducts,url,data,(searchData)=>{
                if(searchData.length===0){
                    this.setState({requestCompleted:false});
                }else {
                    this.currentPage=this.currentPage+1;
                }
            },()=>{});
        }
    };
}