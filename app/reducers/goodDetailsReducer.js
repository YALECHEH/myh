/**
 * Created by chenmao on 2016/11/29.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShow:null,
    openType:0,
    isShowLoading:false,
    goodInfo:null,
    goodSpecification:null,
    grayArr:[]
});
let goodDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_GOOD_DETAILS:{
            return state.merge({
                isShow:action.isShow,
                openType:action.openType
            })
        }
        case types.IS_SHOW_LOADING:{
            return state.merge({
                isShowLoading:action.isShowLoading
            })
        }
        case types.RECEIVE_GOOD_DETAILS:{
            return state.merge({
                goodInfo:action.goodInfo
            })
        }
        case types.RECEIVE_GOOD_SPECIFICATION:{
            return state.merge({
                goodSpecification:action.goodSpecification
            })
        }
        case types.GET_GOODTYPE_SERVER:{
            return state.merge({
                grayArr:action.grayArr
            })
        }
        default:
            return state;
    }
};

export default goodDetailsReducer;
