import {fromJS} from 'immutable';

const iniState = {
  activeList: [],
  editActive: {
    activeName: '1元秒杀',
    activeSummary: '限时限量抢购！！！',
    startTime: '2017-10-21 00:00:00',
    endTime: '2017-10-24 00:00:00',
    image_url: '',

  }
};

const activeList = (state = fromJS(iniState), action) => {
  switch (action.type) {
    case 'SAVE_ACTIVE_LIST':
      return state.merge(fromJS({activeList: action.dataArr, total: action.total}));
    case 'PICK_ACTIVE_DETAIL':
      return state;
    case 'PATCH_ACTIVE_DETAIL':
      return state;
    case 'PATCH_ACTIVE_LIST':
      return state;
    case 'ADD_ACTIVE_GOODS':
      return state;
    case 'EDIT_ACTIVE_GOODS':
      return state;
    default:
      return state;
  }
};

export default activeList;