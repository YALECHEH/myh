/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：申请售后服务
 */
import React from 'react';
import './apply_after_sales_service.less'
import {Picker, List, WhiteSpace, Toast, TextareaItem, Modal, ActivityIndicator} from 'antd-mobile';
import {fileUpload} from "../../common/Apis/Utils";
import {wxShare} from '../../common/Apis/wxJsApis'
import * as contants from '../../common/Apis/constants'
import * as db from '../../common/Apis/Utils';
import {post} from "../../common/Apis/Fetch";

const Item = List.Item;
var images = {
    localId: [],
    serverId: []
};

const type1 = [
    {
        label: '退款',
        value: '退款',
    }, {
        label: '退货退款',
        value: '退货退款',
    }
]
const type2 = [
    {
        label: '退款',
        value: '退款',
    }
]

// 如果不是使用 List.Item 作为 children
const CustomChildren = props => (
    <div
        onClick={props.onClick}
        className="border"
    >
        <div className="pick">
            <div className="pickText">
                <div className="pickLeft">售后类型</div>
                <div className="pickRight">{props.data}</div>
            </div>
            <div>
                <img src={require("../../images/aftersales/arrow.png")}/>
            </div>
        </div>
    </div>
);
// 如果不是使用 List.Item 作为 children
const CustomChildrenR = props => (
    <div
        onClick={props.onClick}
        className="border"
    >
        <div className="pick">
            <div className="pickText">
                <div className="pickLeft">申请原因</div>
                <div className="pickRight">{props.data}</div>
            </div>
            <div>
                <img src={require("../../images/aftersales/arrow.png")}/>
            </div>
        </div>
    </div>
);
export default class applyAfterSalesService extends React.Component {
    constructor(props) {
        super(props)
        console.log('applyAfterSalesSe constructor  11')
        this.state = {
            typeValue: '请选择',
            reasonValue: 0,
            reasonLabel: '请选择',
            files: [],
            orderNum: this.props.location.state.orderNum,
            orderTime: this.props.location.state.orderTime,
            totalMoney: this.props.location.state.returnMoney,
            typeData: this.props.location.state.type == 2 ? type2 : (this.props.location.state.type == 3 ? type1 : type2),
            imgAry: [],//上传的图片,
            desc: '',
            fileId: [],
            pictureFile: [],
            inputVa: this.props.location.state.type == 2 ? this.props.location.state.returnMoney : null,
            reasonData: [],
            showLoading: false,
        }
    }

    componentWillMount() {
        document.title = '申请退款';
        console.log('-------componentWillMount--------',this.state.imgAry.length)
    }
    componentWillUnmount() {
        console.log('-------componentWillUnmount--------',this.state.imgAry.length)
    }
    componentDidMount() {
        console.log('-------componentDidMount--------',this.state.imgAry.length)
        let url = db.userAgent() === 'Android' ? encodeURIComponent(location.href.split('#')[0]) : encodeURIComponent(contants.url);
        wxShare(url, [], {});

        post('/afterSale/searchReasonList', '', (data) => {
            if (data !== null && '' !== data) {
                console.log(data)
                if (data instanceof Array) {
                    let array = [];
                    for (let i = 0; i < data.length; i++) {
                        let reason = {
                            label: data[i].NAME,
                            value: data[i].DICTIONARY_ID,
                        }
                        array.push(reason);
                    }
                    console.log('array----->', array)
                    this.setState({reasonData: array})
                }
            }
        }, (err) => {
            console.log(err);
        })
    }


    handleSubmit() {
        if (this.state.typeValue == '请选择') {
            Toast.info("请选择售后类型");
            return;
        }

        if ( this.state.inputVa == null || this.state.inputVa == '' || parseInt(this.state.inputVa) === 0 ) {
            Toast.info("请输入退款金额")
            return;
        }

        if (this.state.reasonLabel == '请选择') {
            Toast.info("请选择售后原因");
            return;
        }

        if (parseInt(this.state.inputVa) > this.state.totalMoney) {
            Toast.info("退款金额超过最大限制");
            return;
        }

        if (this.state.desc.trim() == null || this.state.desc.trim() == '') {
            Toast.info("请填写问题描述");
            return;
        }

        // 有图片
        if (this.state.pictureFile.length > 0) {
            let upData = {file: this.state.pictureFile, userId: db.readUserInfo()['userId']}
            fileUpload(upData, (data) => {
                console.log('--------data---------', data);
                if (data.status == 1) {
                    console.log("上传图片成功")
                    this.state.fileId = data.UploadSuccessData;
                    console.log(...this.state.fileId)
                    let saleType = this.state.typeValue == '退款' ? 1 : 2;
                    let fileIdAry = [];
                    for (let i = 0; i < this.state.fileId.length; i++) {
                        fileIdAry.push(this.state.fileId[i].fileId)
                    }
                    let params = {
                        orderId: this.props.location.state.orderId,
                        saleType: saleType,
                        amount: this.state.inputVa,
                        describes: this.state.desc,
                        userId: db.readUserInfo()['userId'],
                        dictionaryId: this.state.reasonValue,
                        fileId: fileIdAry,
                    }
                    this.setState({showLoading: true});
                    post('/afterSale/applayAfterSale', params, (data) => {
                        this.setState({showLoading: false});
                        if (data.status === 0) {
                            const {router} = this.props;
                            router.replace({
                                pathname: contants.commonUrl + '/applySuccess',
                                query: {
                                    type: saleType
                                }
                            })
                        } else {
                            Toast.info(data.message);
                        }
                    }, (err) => {
                        this.setState({showLoading: false});
                        Toast.info(err);
                    })
                }
                else {
                    Toast.info("上传图片失败")
                }
            })
        }
        else {//没图片
            let saleType = this.state.typeValue == '退款' ? 1 : 2;
            let params = {
                orderId: this.props.location.state.orderId,
                saleType: saleType,
                amount: this.state.inputVa,
                describes: this.state.desc,
                userId: db.readUserInfo()['userId'],
                dictionaryId: this.state.reasonValue,
                fileId: this.state.fileId,
            }
            console.log('--------params--------', params)
            this.setState({showLoading: true});
            post('/afterSale/applayAfterSale', params, (data) => {
                this.setState({showLoading: false});
                if (data.status === 0) {
                    const {router} = this.props;
                    router.replace({
                        pathname: contants.commonUrl + '/applySuccess',
                        query: {
                            type: saleType
                        }
                    })
                } else {
                    Toast.info(data.message);
                }
            }, (err) => {
                this.setState({showLoading: false});
                Toast.info(err);
            })
        }
    }


    onClick() {
    }

    onChange(value) {
        let label;
        for (let i = 0; i < this.state.reasonData.length; i++) {
            if (value[0] === this.state.reasonData[i].value) {
                label = this.state.reasonData[i].label;
            }
        }
        this.setState({
            reasonValue: value[0],
            reasonLabel: label,
        });
    };

    getImage()//上传图片
    {
        console.log('上传图片')
        wx.chooseImage({
            success: function (res) {
                //images.localId = res.localIds;
                //this.setState({imgAry:images.localId})
                //$('#img').attr({'src':images.localId[0]})
                alert('已选择 ' + res.localIds.length + ' 张图片');
            }
        });

    }

    scanImg() {
        console.log('scan img')
        wx.previewImage({
            current: images.localId[0], // 当前显示图片的http链接
            urls: images.localId // 需要预览的图片http链接列表
        });
    }

    render() {
        console.log('图片长度'+this.state.imgAry.length+this.state.desc)
        return (
            <div>
                <div className="empty-view-apply"></div>
                <div className="order1">
                    <div className="orderNum"><span>订单号:</span><span>{this.state.orderNum}</span></div>
                    <div className="orderTime"><span>下单时间:</span><span>{this.state.orderTime}</span></div>
                </div>
                <Picker className="pickerType" data={this.state.typeData} cols={1}
                        onChange={v => {
                            document.title = v == '退款' ? '申请退款' : '申请退货退款'
                            this.setState({typeValue: v})
                        }
                        }>
                    <CustomChildren data={this.state.typeValue}/>
                </Picker>
                {(this.props.location.state.type != 2) && <div className="money1">
                    <div>退款金额</div>
                    <div>
                        <input placeholder="请输入退款金额"
                               ref="refundMoney" onInput={(event) => {
                                   //保留小数点后两位
                            let content = event.target.value;
                            let val = content.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                            let str = val.length > 11 ? val.splice(0, 11) : val;
                            this.setState({inputVa: str});
                        }}
                               value={this.state.inputVa}
                               type="number"/>
                    </div>
                </div>}

                {(this.props.location.state.type == 2) && <div className="money1">
                    <div>退款金额</div>
                    <div ref="refundMoney">{this.state.inputVa}</div>
                </div>}

                <div className="moneyTip">
                    <div>(最多<span>{this.state.totalMoney}</span>元，含发货邮费0.00元)</div>
                </div>

                <Picker className="pickerReason" data={this.state.reasonData} cols={1}
                        onChange={v => {
                            this.onChange(v)
                        }}>
                    <CustomChildrenR data={this.state.reasonLabel}/>
                </Picker>

                <div className="des">
                    <TextareaItem
                        title="问题描述"
                        autoHeight
                        placeholder="请你在此描述问题(可输入100字)" count={100}
                        labelNumber={5}
                        onChange={(v) => {
                            this.setState({desc: v});
                        }}
                    />

                    <div className="imgContainer">
                        {this.state.imgAry.map((content, i) => {
                            return (
                                <div className="addImg">
                                    <img src={content}
                                         onClick={this.pictureViewer.bind(this, i)}
                                    >
                                    </img>
                                    <img className='smallImg'
                                         onClick={this.deleteImg.bind(this, i)}

                                         src={require('../../images/aftersales/e10@1x.png')}
                                    ></img>
                                </div>
                            )
                        })}
                        {this.state.imgAry.length >= 5 ? null :
                            <div className="addImg">
                                <img src={require('../../images/aftersales/e7@1x.png')}
                                >
                                </img>
                                <input ref="addImg" id="takepicture" type="file" accept="image/*" capture="camera"
                                       onChange={this.changeImg.bind(this)}
                                />
                            </div>
                        }
                    </div>
                    <div className="upLoadInfo">最多可上传5张图片</div>
                </div>
                <div className="tipLeft3">提交服务单后，售后专员可能与你电话沟通，请保持手机畅通</div>
                <div className="tip3">商品寄回地址将在审核通过后以短信形式告知</div>
                <div className="sub" onClick={this.handleSubmit.bind(this)}>
                    提交
                </div>

                <ActivityIndicator
                    toast
                    text="Loading..."
                    animating={this.state.showLoading}
                />
            </div>
        )
    }

    deleteImg(i) {
        let imgAry = this.state.imgAry;
        imgAry.splice(i, 1)
        this.setState({imgAry: imgAry})
    }

    pictureViewer(i) {
        const {router} = this.props;
        router.push({
            pathname: contants.commonUrl + '/pictureLook',
            state: {
                images: this.state.imgAry,
                index: i,
            }
        })
    }

    changeImg(event) {
        let files = event.target.files, file;
        file = files[0];
        let URL = window.URL || window.webkitURL;
        let imgAry = this.state.imgAry;
        let blob = URL.createObjectURL(file)
        imgAry.push(blob);
        let array = this.state.pictureFile;
        // let arr = blob.split(":");
        // blob = arr[1] + ':' + arr[2] + arr[3]
        file.url = blob;
        array.push(file);
        this.setState({imgAry: imgAry})
        this.setState({pictureFile: array})
    }

    addImage() {//添加图片
        // Modal.alert('test')
        // console.log('添加图片')
        // this.refs.addImg.click();
        let takePicture = document.getElementById('takepicture');
        takePicture.click();
    }

    getImage() {
        let imgAry = [];
    }
}