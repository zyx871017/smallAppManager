import {fromJS} from 'immutable';

const initialState = {
  activeList: [],
  editActive: {}
};

const activeList = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_ACTIVE_LIST':
      return state;
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