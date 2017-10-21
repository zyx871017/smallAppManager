import React from 'react';
import {connect} from 'react-redux';
import {goodsList} from './../../actions';
import {TextField, FloatingActionButton} from 'material-ui';
import AvPlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import {styles} from './GoodsListStyles';

class AddGoodSpec extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      imgFieldOpen: false
    };
  }

  addSpec = () => {
    if (this.props.keyWord !== 'showDetail')
      this.props.addSpec();
  };

  render() {
    const goodSpec = this.props.goodsList.editGood.goods_spec;
    const keyWord = this.props.keyWord;
    const isDisabled = (keyWord === 'showDetail');
    return (
      <div>
        {goodSpec.map((item, idx) => (
          <div style={styles.specItem}>
            <TextField
              hintText="请输入规格标题"
              floatingLabelText="规格标题"
              value={item.key}
              disabled={isDisabled}
              onChange={e => {
                this.props.editSpec(idx, {key: e.target.value});
              }}
              style={styles.specKey}
            />:
            <TextField
              hintText="请输入规格值"
              floatingLabelText="规格值"
              value={item.value}
              disabled={isDisabled}
              onChange={e => {
                this.props.editSpec(idx, {value: e.target.value});
              }}
              style={styles.specValue}
            />
          </div>
        ))}
        <div style={{width: '100%', padding: '12px 46px', boxSizing: 'border-box'}}>
          <FloatingActionButton
            iconStyle={styles.specAddBtn}
            style={{
              width: 100
            }}
            onClick={this.addSpec}
          >
            <AvPlaylistAdd/>
          </FloatingActionButton>
          <span
            style={{display: 'inline-block', marginTop: 12}}
          >需要添加新的规格信息，点击添加按钮，左侧填写规格标题，右侧填写规格信息！</span>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    goodsList: state.goodsList.toJS()
  }),
  dispatch => ({
    patchGoodDetail: dataObj => dispatch(goodsList.patchGoodDetail(dataObj)),
    addSpec: () => dispatch(goodsList.addSpec()),
    editSpec: (index, dataObj) => dispatch(goodsList.editSpec(index, dataObj))
  })
)(AddGoodSpec);