import {fromJS} from 'immutable';

const iniState = {
  activeList: [],
  editActive: {
    discount: 9,
    goods_list: [],
    goods_count: [],
    start_time: null,
    image_url: 'https://image.qaformath.com/computer_superapp/banner01.jpg',
    create_time: '2017-10-16 16:10:14',
    end_time: null,
    active_type: 3,
    title: '丢丢丢',
    id: 4,
    sort: 4,

  }
};

const activeList = (state = fromJS(iniState), action) => {
  switch (action.type) {
    case 'SAVE_ACTIVE_LIST':
      return state.merge(fromJS({activeList: action.dataArr, total: action.total}));
    case 'PICK_ACTIVE_DETAIL':
      return state.set('editActive', fromJS(action.dataObj));
    case 'PATCH_ACTIVE_DETAIL':
      return state.mergeDeep(fromJS({editActive: action.dataObj}));
    case 'ADD_ACTIVE_GOODS': {
      const index = state.getIn(['editActive', 'goods_list']).indexOf(action.id);
      if (index >= 0) {
        state = state.updateIn(['editActive', 'goods_list'], arr => arr.delete(index));
        state = state.updateIn(['editActive', 'goods_count'], arr => arr.delete(index));
      } else {
        state = state.updateIn(['editActive', 'goods_list'], arr => arr.push(action.id));
        state = state.updateIn(['editActive', 'goods_count'], arr => arr.push(1));
      }
      return state;
    }
    case 'EDIT_GOOD_COUNT':
      if (isNaN(action.value)) {
        return state;
      }
      return state.setIn(['editActive', 'goods_count', action.idx], parseInt(action.value || 0));
    default:
      return state;
  }
};

export default activeList;