import React,{Component} from 'react';
import './goodDetails.less'
import * as db from '../../common/Apis/Utils';
import * as contants from '../../common/Apis/constants'
import * as SKU from '../../common/Apis/SKU'
export default class ChooseSpecification extends Component {
    constructor(...args) {
        super(...args);
        this.state= {
            goodMount: 1,
            index: [],
            specificationsText: '',
            ids:[],
            price:null,
            goodStock:null,
            isShowAlert:false,
            AlertStr:''
        }
    }
    componentDidMount(){
        const myScroll = new IScroll('#wrapper');
        const {goodDetails,goodDetailsActions,location}=this.props;
        const {goodInfo}=goodDetails;
        $('.goodDialogCover,.goodDialog,.goodDialog img,.goodDialogHeader,footer').on("touchmove",function(e) {
            var e = e || event;
            e.preventDefault();
        });
        let that=this;
        let goodsId=location.state.goodsId;
        let resData={
            param1:null,
            param2:null,
            param3:null,
            goodsId:goodsId
        };
        this.setState({goodStock:goodInfo.stock});
        goodDetailsActions.getGoodTypeServer('/goods/getRulesIds',resData,(response)=>{
            console.log(response)
            SKU.initSKU(response);
            let skuKeys =SKU.getObjKeys(response);
            let SKUResult=SKU.SKUResult;
            let str='';
            let str1='';
            let goodsruleslist=goodInfo.goodsruleslist;
            for(let i=0;i<goodsruleslist.length;i++){
                inter:
                    for(let j=0;j<goodsruleslist[i].nameList.length;j++){
                        let nameList=goodsruleslist[i].nameList[j];
                        for(let k=0;k<skuKeys.length;k++){
                            if(skuKeys[k].indexOf(nameList.specificationsId)>-1){
                                if(str==''){
                                    str=nameList.specificationsId
                                }else{
                                    str+=','+nameList.specificationsId
                                }
                                if(skuKeys[k].indexOf(str)>-1){
                                    str1=str;
                                    this.choose(i,j);
                                    chooseBtnType($('.goodTypeDiv').eq(i).find('.sku').eq(j))
                                    break inter;
                                }else{
                                    str=str1;
                                }
                            }
                        }
                    }
            }
            $('.sku').each(function() {
                let self = $(this);
                let attr_id = self.attr('data-attrId');
                if(!SKUResult[attr_id]) {
                    self.attr('disabled', 'disabled').addClass('disabledStyle');
                }
            }).click(function() {
                let self = $(this);
                chooseBtnType(self)
           });
            function chooseBtnType(self){
                //选中自己，兄弟节点取消选中
                self.toggleClass('active').siblings().removeClass('active');

                //已经选择的节点
                let selectedObjs = $('.active');

                if(selectedObjs.length) {
                    //获得组合key价格
                    let selectedIds = [];
                    selectedObjs.each(function() {
                        selectedIds.push($(this).attr('data-attrId'));
                    });
                    selectedIds.sort(function(value1, value2) {
                        return parseInt(value1) - parseInt(value2);
                    });
                    let len = selectedIds.length;
                    if(len===goodsruleslist.length){
                        let prices = SKUResult[selectedIds.join(',')].prices;
                        let count = SKUResult[selectedIds.join(',')].count;
                        if(that.state.goodMount>count[0]){
                            that.setState({goodMount:1})
                        }
                        that.setState({price:prices[0],goodStock:count[0]})
                    }
                    //用已选中的节点验证待测试节点 underTestObjs
                    $(".sku").not(selectedObjs).not(self).each(function() {
                        let siblingsSelectedObj = $(this).siblings('.active');
                        let testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                        if(siblingsSelectedObj.length) {
                            let siblingsSelectedObjId = siblingsSelectedObj.attr('data-attrId');
                            for(var i = 0; i < len; i++) {
                                (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
                            }
                        } else {
                            testAttrIds = selectedIds.concat();
                        }
                        testAttrIds = testAttrIds.concat($(this).attr('data-attrId'));
                        testAttrIds.sort(function(value1, value2) {
                            return parseInt(value1) - parseInt(value2);
                        });
                        if(!SKUResult[testAttrIds.join(',')]) {
                            $(this).attr('disabled', 'disabled').removeClass('active').addClass('disabledStyle');
                        } else {
                            $(this).removeAttr('disabled').removeClass('disabledStyle');
                        }
                    });
                } else {
                    //设置属性状态
                    $('.sku').each(function() {
                        SKUResult[$(this).attr('data-attrId')] ? $(this).removeAttr('disabled').removeClass('disabledStyle') : $(this).attr('disabled', 'disabled').removeClass('active').addClass('disabledStyle');
                    })
                }
            }
        },(err)=>{

        });
    }
    choose(i,j){
        const {goodDetails,goodDetailsActions,location}=this.props;
        const {goodInfo}=goodDetails;
        const {ids,index}=this.state;
        let idsArr=[];
        let indexArr=index;
        let str=i+''+j;
        let goodTypeStr='';
        let goodsId=location.state.goodsId;
        let len=0;
        if(indexArr.length==0){
            indexArr[i]=str;
        }else{
            let arrIndex=$.inArray(str,indexArr);
            if(arrIndex>-1){
                delete indexArr[arrIndex];
            }else{
                for(let t=0;t<indexArr.length;t++){
                    if(indexArr[t] && indexArr[t].charAt(0)==i){
                        indexArr[t]=str;
                        break;
                    }else{
                        indexArr[i]=str;
                        break;
                    }
                }
            }
        }
        indexArr.map((val,m)=>{
            if(val){
                len++;
                const m1=Number(val.charAt(0));
                const m2=Number(val.charAt(1));
                idsArr.push(goodInfo.goodsruleslist[m1].nameList[m2].specificationsId);
                if(m==0){
                    goodTypeStr=goodInfo.goodsruleslist[m1].type+':'+goodInfo.goodsruleslist[m1].nameList[m2].name
                }else{
                    goodTypeStr+=' '+goodInfo.goodsruleslist[m1].type+':'+goodInfo.goodsruleslist[m1].nameList[m2].name
                }
            }
        });
        this.setState({index:indexArr,specificationsText:goodTypeStr,ids:idsArr});
        //请求价格
        if(len==0){
            this.setState({price:goodInfo.price,goodStock:goodInfo.stock});
        }
        // if(len===goodInfo.goodsruleslist.length){
        //     let requestData={
        //         goodsId:goodsId,
        //         param1:idsArr[0],
        //         param2:idsArr[1]?idsArr[1]:0,
        //         param3:idsArr[2]?idsArr[2]:0
        //     };
        //     goodDetailsActions.getGoodSpecificationPrice('/webOrder/getPrice',requestData,(res)=>{
        //         if(this.state.goodMount>res.stock){
        //             this.setState({goodMount:1})
        //         }
        //         this.setState({price:res.price,goodStock:res.stock});
        //     },(err)=>{
        //
        //     })
        // }
    }
    render() {
        const {goodDetails}=this.props;
        const {goodInfo}=goodDetails;
        let flag=this.state.goodMount<this.state.goodStock;
        return (
            <div>
                <div className={`goodDialogCover ${goodDetails.isShow?'show':'hide'}`}>

                </div>
                <div className={`goodAlertDialog ${this.state.isShowAlert?'show':'hide'}`}>
                    <img src={require('../../images/goodDetails/b40.png')}/>
                    <span>{this.state.AlertStr}</span>
                </div>
                <div className={`goodDialogContainer ${goodDetails.isShow?'up':goodDetails.isShow===null?'':'down'}`}>
                    <div className='goodDesContainer'>
                        <header className='goodDialog'>
                            <div className="borderDiv"><img src={goodInfo.goodsUrlList[0].hosrUrl+goodInfo.goodsUrlList[0].pictureFileUrl}/></div>
                            <div className='goodDialogHeader'>
                                <p>{goodInfo.goodsName}</p>
                                <p>{`${this.state.price?this.state.price:goodInfo.price}*${this.state.goodMount}`}</p>
                                <p>{this.state.specificationsText?this.state.specificationsText:'请选择商品规格'}</p>
                            </div>
                            <div className="closeDialog" onClick={()=>{this.hideDialog()}}>
                                <img src={require('../../images/goodDetails/b20.png')} />
                            </div>
                        </header>
                        <div className="middleContainer" id="wrapper">
                            <div>
                        {
                            goodInfo.goodsruleslist.map((val,i)=>{
                                return(
                                    <section className="goodType" key={i}>
                                        <h1>{val.type}</h1>
                                        <div className="goodTypeDiv">
                                            {
                                                val.nameList.map((v,j)=>{
                                                    return(
                                                        <input key={j} type="button" className="sku" data-attrId={v.specificationsId} value={v.name} onClick={()=>{this.choose(i,j)}}/>
                                                    )
                                                })
                                            }
                                        </div>
                                    </section>
                                )
                            })
                        }
                        <section className="goodMount">
                            <h1>数量</h1>
                            <div>
                                <button className={this.state.goodMount<=1?'cancelClick':'canClick'} onClick={()=>this.reduceGoodNum()}>－</button>
                                <span>{this.state.goodMount}</span>
                                <button className={flag?'canClick':'cancelClick'} onClick={()=>this.addGoodNum()}>＋</button>
                            </div>
                        </section>
                                </div>
                        </div>
                        {
                            goodDetails.openType!==2?
                                <footer>
                                    <button onClick={()=>{this.submit()}} className={goodDetails.openType==0?"buyButtonWidth":"addCartButtonWidth"}>确认</button>
                                </footer>:
                                <footer className="chooseTypeFooter">
                                    <button onClick={()=>{this.submit(0)}} className="addCart">加入购物车</button>
                                    <button onClick={()=>{this.submit(1)}} className="buyNow">立即购买</button>
                                </footer>
                        }
                    </div>
                </div>
            </div>
        );
    }
    submit(opts){
        const {goodDetailsActions ,goodDetails,router,location}=this.props;
        const {goodInfo}=goodDetails;
        const {ids}=this.state;
        let idsArr=ids;
        let len=0;
        idsArr.map((val,i)=>{
            if(val){
                len++;
            }
        });
        if(len!==goodInfo.goodsruleslist.length){
            this.setState({isShowAlert:true,AlertStr:'请选择商品规格'});
            setTimeout(()=>{
                this.setState({isShowAlert:false});
            },1000);
            return;
        }
        let type=(opts || opts===0)?opts:goodDetails.openType;
        let userInfo = db.readUserInfo();
        let goodCartInfo=[{
            goodNam:goodInfo.goodsName,
            goodsId:location.state.goodsId,
            number:this.state.goodMount,
            goodSpecification:this.state.specificationsText,
            param1:idsArr[0],
            param2:idsArr[1]?idsArr[1]:0,
            param3:idsArr[2]?idsArr[2]:0,
            zoomUrl:goodInfo.goodsUrlList[0].hosrUrl+goodInfo.goodsUrlList[0].pictureFileUrl,
            price:this.state.price,
            stock:this.state.goodStock,
            restrictionsNumber:goodInfo.restrictionsNumber
        }];
        switch (type){
            //1 立即购买  0 加入购物车
            case 0:
                if(userInfo){
                    let requestData={
                        userId:userInfo.userId,
                        shopList:JSON.stringify([{
                            goodsId:location.state.goodsId,
                            number:this.state.goodMount,
                            param1:idsArr[0],
                            param2:idsArr[1]?idsArr[1]:0,
                            param3:idsArr[2]?idsArr[2]:0
                        }])
                    };
                    console.log(requestData);
                    goodDetailsActions.addCart('/shopping/insertshop',requestData,()=>{
                        db.saveGoods(goodCartInfo);
                        this.props.callBack();
                        setTimeout(()=>{
                            this.props.callBack();
                        },1000);
                        goodDetailsActions.showDialog(false);
                    },(err)=>{

                    });
                }else{
                    db.saveGoods(goodCartInfo);
                    this.props.callBack();
                    setTimeout(()=>{
                        this.props.callBack();
                    },1000);
                    goodDetailsActions.showDialog(false);
                }
                break;
            case 1:
                if(userInfo){
                    router.push({
                        pathname: contants.commonUrl+'/settlement',
                        state:{
                            goodInfo:goodCartInfo,
                            isInCart:1
                        }
                    });
                }else{
                    router.push({
                        pathname: contants.commonUrl+'/login',
                        state:{
                            pathname:contants.commonUrl+'/settlement',
                            type:3,
                            goodInfo:goodCartInfo
                        }
                    });
                }

                break;
        }
    }
    hideDialog(){
        const { goodDetailsActions}=this.props;
        goodDetailsActions.showDialog(false);
    }
    reduceGoodNum(){
        if(this.state.goodMount<=1){

        }else{
            let goodMount=this.state.goodMount-1;
            this.setState({goodMount:goodMount});
        }
    }
    addGoodNum(){
        const {goodInfo}=this.props.goodDetails;
        let flag=this.state.goodMount<this.state.goodStock;
        if(flag){
            let goodMount=this.state.goodMount+1;
            this.setState({goodMount:goodMount});
        }
    }
}

