/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../common/Apis/constants'

export default class HatList extends Component {
    render() {
        //console.log(this.props.hatData);
        let hatData=this.props.hatData;
        return (
            <div className="hatBody" onClick={()=>this.goDetails(hatData.goodsId)}>
                {hatData.status===2?<img className="soldOutImg" src={require('../../images/homePage/o1@1x.png')}/>:null}
                <img className="hatImg" src={hatData.hostUrl+hatData.fileUrl}/>
                <div className="hatAttribute">
                    <div className="hatName">{hatData.goodsName}</div>
                    <div className="hatUnitPrice">￥{hatData.price}</div>
                </div>
            </div>
        )
    }
    goDetails(goodsId){
        console.log(goodsId);
        const {router}=this.props;
        router.push({
            pathname:contants.commonUrl+'/goodDetails',
            state:{
                goodsId:goodsId
            }
        });
    }
}