export const saveActiveList = (dataArr, total) => {
  return {
    type: 'SAVE_ACTIVE_LIST',
    dataArr,
    total
  };
};

export const pickActiveDetail = (dataObj) => {
  return {
    type: 'PICK_ACTIVE_DETAIL',
    dataObj
  };
};

export const patchActiveDetail = (dataObj) => {
  return {
    type: 'PATCH_ACTIVE_DETAIL',
    dataObj
  };
};

export const patchActiveList = (id, dataObj) => {
  return {
    type: 'PATCH_ACTIVE_LIST',
    id,
    dataObj
  };
};

export const addActiveGoods = id => {
  return {
    type: 'ADD_ACTIVE_GOODS',
    id
  };
};

export const editGoodCount = (idx, value) => {
  return {
    type: 'EDIT_GOOD_COUNT',
    idx,
    value
  };
};


export const saveSelectList = dataArr => {
  return {
    type: 'SAVE_SELECT_LIST',
    dataArr
  }
};
