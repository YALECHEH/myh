/**
 * Created by AndyWang on 2017/7/12.
 */
import React,{Component} from 'react';
import './homePage.less';
import CarouselFigure from './carouselFigure';//轮播图
import Hat from './hatList';//帽子列表
import ViewMore from './viewMore';//查看更多
import HatlistGoods from '../listGoods/hatListGoods';//单个帽子


export default class HomePageList extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            homePageList:this.props.homePageList,
            groupOne:[],
            groupTow:[],
            groupThree:[],
            group:null,//总组数
            remainder:null//最后个数
        }
    }
    componentDidMount(){
        const goodList=this.state.homePageList.goodList;
        if(goodList){
            let hatGroup=goodList.length;//帽子总个数
            let group=parseInt(hatGroup/4);//4个分组取整
            let remainder=hatGroup%4;//组后胜余格式
            if(remainder>0){
                group=group+1;
            }
            //this.setState({group:group});
            let groupOne=[];
            let groupTow=[];
            let groupThree=[];
            for(let i=0;i<hatGroup;i++){
                if(i<4){
                    groupOne.push(goodList[i])
                }else if(i<8){
                    groupTow.push(goodList[i])
                }else {
                    groupThree.push(goodList[i])
                }
            }
            //console.log(group);
            this.setState({groupOne:groupOne,groupTow:groupTow,groupThree:groupThree,group:group,remainder:remainder});
        }else {
          //  console.log("ffffffff",goodList);
        }
    }
    //页面布局
    hatListBody(group){
        if(group===0) {
            return (
                <div></div>
            )
        }else if(group===1){
            let groupOneNumder=this.state.groupOne.length;
            if(groupOneNumder>2){
                return(
                    <div className="hatList">
                        <div className="hatListBody">
                            <div className="hatGroupBag">
                                {this.state.groupOne.map((val,index)=>{
                                    return(
                                        <HatlistGoods key={index} hatData={val} {...this.props}/>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            }else {
                return(
                    <div className="hatListTow">
                        <div className="hatListBody">
                            <div className="hatGroupBag">
                                {this.state.groupOne.map((val,index)=>{
                                    return(
                                        <HatlistGoods key={index} hatData={val} {...this.props}/>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            }

        }else if(group===2&&this.state.remainder!==0){
            return(
                <div className="hatList">
                    <div className="hatListBody hatListBodyLeft">
                        <div className="hatGroup">
                            {this.state.groupOne.map((val,index)=>{
                                return(
                                    <Hat key={index} hatData={val} {...this.props}/>
                                )
                            })}
                        </div>
                        <div className="hatGroup">
                            {this.state.groupTow.map((val,index)=>{
                                return(
                                    <Hat key={index} hatData={val} {...this.props}/>
                                )
                            })}
                            <ViewMore banners={this.state.homePageList.banners} goodsGroup={this.state.homePageList.goodsGroup} {...this.props}/>
                        </div>
                    </div>
                </div>
            )
        }else if(group===2&&this.state.remainder===0){
            return(
                <div className="hatList">
                    <div className="hatListBody hatListBodyLeft">
                        <div className="hatGroup">
                            {this.state.groupOne.map((val,index)=>{
                                return(
                                    <Hat key={index} hatData={val} {...this.props}/>
                                )
                            })}
                        </div>
                        <div className="hatGroup">
                            {this.state.groupTow.map((val,index)=>{
                                return(
                                    <Hat key={index} hatData={val} {...this.props}/>
                                )
                            })}
                        </div>
                        <div className="hatGroupViewMore">
                            <ViewMore banners={this.state.homePageList.banners} goodsGroup={this.state.homePageList.goodsGroup} {...this.props}/>
                        </div>
                    </div>
                </div>
            )
        }else {
            return(
                <div className="hatList">
                    <div className="hatListBody hatListBodyLeft">
                        <div className="hatGroup">
                            {this.state.groupOne.map((val,index)=>{
                                return(
                                    <Hat key={index} hatData={val} {...this.props}/>
                                )
                            })}
                        </div>
                        <div className="hatGroup">
                            {this.state.groupTow.map((val,index)=>{
                                return(
                                    <Hat key={index} hatData={val} {...this.props}/>
                                )
                            })}
                        </div>
                        <div className="hatGroup">
                            {this.state.groupThree.map((val,index)=>{
                                return(
                                    <Hat key={index} hatData={val} {...this.props}/>
                                )
                            })}
                            <ViewMore banners={this.state.homePageList.banners} goodsGroup={this.state.homePageList.goodsGroup} {...this.props}/>
                        </div>
                    </div>
                </div>
            )
        }
    };
    render() {
        let homePageList=this.state.homePageList;
        return (
            <div className="commodity">
                <div className="commodityType">
                    <div className="cTypeCName">
                        <img className="typeLeft" src={require('../../images/homePage/typeLeft.png')}/>
                        <span>{homePageList.goodsGroup.groupName}</span>
                        <img className="typeRight" src={require('../../images/homePage/typeRight.png')}/>
                    </div>
                    <div className="cTypeEName">
                        <span>{homePageList.goodsGroup.anotherName}</span>
                    </div>
                </div>
                <CarouselFigure banners={homePageList.banners} {...this.props}/>
                {this.hatListBody(this.state.group)}
            </div>
        )
    }
}