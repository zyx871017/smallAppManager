import {fromJS} from 'immutable';

const iniState = {
  goodsList: [],
  editGood: {
    goods_name: '',
    goods_image: '',
    goods_type_id: 0,
    goods_collect: 0,
    category_id: 0,
    goods_jingle: '',
    goods_price: 0,
    goods_marketprice: 0,
    goods_serial: '',
    goods_click: 0,
    goods_salenum: 0,
    goods_spec: [],
    goods_storage: 0,
    goods_state: 0,
    goods_verify: 0,
    create_time: '',
    update_time: '',
    goods_freight: 0,
    evaluation_good_star: 0,
    evaluation_count: 0,
  }
};

const goodsList = (state = fromJS(iniState), action) => {
  switch (action.type) {
    case 'SAVE_GOODS_LIST':
      return state.merge(fromJS({goodsList: action.dataArr, goodsTotal: action.total}));
    case 'PATCH_GOOD_DETAIL':
      return state.mergeDeep(fromJS({editGood: action.dataObj}));
    case 'PICK_GOOD_DETAIL':
      return state.set('editGood', fromJS(action.dataObj));
    case 'PATCH_GOODS_LIST':
      return state;
    case 'ADD_SPEC':
      return state.updateIn(
        ['editGood', 'goods_spec'],
        arr => arr.push(fromJS({key: '', value: ''}))
      );
    case 'EDIT_SPEC':
      return state.updateIn(
        ['editGood', 'goods_spec', action.index],
        value => value.merge(action.dataObj)
      );
    default:
      return state;
  }
};

export default goodsList;