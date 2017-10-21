export const saveActiveList = (dataArr, total) => {
  return {
    type: 'SAVE_ACTIVE_LIST',
    dataArr,
    total
  }
};

export const pickActiveDetail = (dataObj) => {
  return {
    type: 'PICK_ACTIVE_DETAIL',
    dataObj
  }
};

export const patchActiveDetail = (dataObj) => {
  return {
    type: 'PATCH_ACTIVE_DETAIL',
    dataObj
  }
};

export const patchActiveList = (id, dataObj) => {
  return {
    type: 'PATCH_ACTIVE_LIST',
    id,
    dataObj
  }
};

export const addActiveGoods = () => {
  return {
    type: 'ADD_ACTIVE_GOODS',
  }
};

export const editActiveGoods = (number) => {
  return {
    type: 'EDIT_ACTIVE_GOODS',
    number
  }
};



