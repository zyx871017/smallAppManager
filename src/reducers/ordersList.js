import {fromJS} from 'immutable';

const iniState = {
  ordersList: [],
  ordersTotal: 0
};

const goodsList = (state = fromJS(iniState), action) => {
  switch (action.type) {
    case 'SAVE_ORDER_LIST':
      return state.merge(fromJS({ordersList: action.dataArr, ordersTotal: action.total}));
    case 'PICK_ORDER_DETAIL':
      return state.set('editGood', fromJS(action.dataObj));
    case 'PATCH_ORDER_LIST':
      return state;
    default:
      return state;
  }
};

export default goodsList;