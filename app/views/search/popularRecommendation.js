/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：热门推荐组件
 */
import React from 'react';
import  '../aftersales/popular_recommendation.less';
import {post} from '../../common/Apis/Fetch.js';
import HatListGoods from "../listGoods/hatListGoods";

export default class popularRecommendation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        post('/goods/hotRecommend', '', (data) => {
            if (data.status === 0) {
                console.log(data.body.goodsResponses);
                //this.state.data = data.body.goodsResponses;
                this.setState({data:data.body.goodsResponses});
                //this.forceUpdate();
            }
        }, (err) => {
            console.log("出错了")
        })
    }

    render() {
        console.log(this.state.data);
        return (
            <div className="popularMerchandise">
                <div className="pMhead">
                    <img className="Rlift" src={require("../../images/search/Rlift.png")}/>
                    <span>热门推荐</span>
                    <img className="heartImg" src={require("../../images/search/popular_recommendation_heart.png") }/>
                    <img className="RRight" src={require("../../images/search/RRight.png")}/>
                </div>

                <div className="PMbody">
                    {this.state.data.map((val,index) => {
                        return (
                            <HatListGoods key={index} hatData={val} {...this.props}/>
                        )
                    })
                    }
                </div>
                <div className="listViewFoot">
                    <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
                    <span>没有更多内容了</span>
                    <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
                </div>
            </div>
        )
    }
}