import React from 'react';
import {
  TextField,
  Divider,
  SelectField,
  MenuItem,
} from 'material-ui';
import {connect} from 'react-redux';
import {activeList} from './../../actions';
import {activeType, discountType} from './../../common/common';

class AddActiveDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const {keyWord, activeList} = this.props;

    const isDisabled = (keyWord === 'showDetail');

    const editActive = activeList.editActive;

    const active_type = editActive.active_type.toString();
    const discount = editActive.discount.toString();

    return (
      <div>
        <TextField
          hintText="请输入活动名称"
          floatingLabelText="活动名称"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editActive.title || ''}
          onChange={e => {
            this.props.patchActiveDetail({title: e.target.value});
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入活动开始时间"
          floatingLabelText="开始时间(yyyy-mm-dd hh:mm:ss)"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editActive.start_time || ''}
          onChange={e => {
            this.props.patchActiveDetail({start_time: e.target.value});
          }}
        />
        <Divider/>
        <TextField
          hintText="请输入活动结束时间"
          floatingLabelText="结束时间(yyyy-mm-dd hh:mm:ss)"
          style={{width: '100%'}}
          underlineShow={false}
          disabled={isDisabled}
          value={editActive.end_time || ''}
          onChange={e => {
            this.props.patchActiveDetail({end_time: e.target.value});
          }}
        />
        <Divider/>
      </div>
    );
  }
}

export default connect(
  state => ({
    activeList: state.activeList.toJS()
  }),
  dispatch => {
    return {
      saveActiveList: dataArr => {
        dispatch(activeList.saveActiveList(dataArr));
      },
      patchActiveDetail: dataObj => {
        dispatch(activeList.patchActiveDetail(dataObj));
      }
    };
  }
)(AddActiveDetail);