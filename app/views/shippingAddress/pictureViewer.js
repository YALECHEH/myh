/**
 * Created by JieLi on 2017/7/10.
 * 图片浏览器
 */


import React,{Component} from 'react';
import './pictureViewer.less';


import WxImageViewer from 'react-wx-images-viewer';

export default class PictureViewer extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

            imags:this.props.location.state.images,
            index:this.props.location.state.index,
            isOpen:false
        };
      }

    onClose(){
        this.props.router.goBack();
    }


    render() {
        console.log(this.props.location.state.images)
        const {
            imags,
            index,
            isOpen
        } = this.state;

        return (
            <div className="app">

                <WxImageViewer onClose={()=>this.onClose()} urls={this.state.imags} index={index}/>

            </div>
        )
    }




}