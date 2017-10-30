import React from 'react';
import {connect} from 'react-redux';
import {activeList} from './../../actions';
import {TextField} from 'material-ui';
import {styles} from './GoodsListStyles';

class EditGoodsCount extends React.Component {
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
    const editActive = this.props.activeList.editActive;
    const goodsList = this.props.goodsList.goodsList;
    const goods_list = editActive.goods_list;
    const goods_count = editActive.goods_count;
    const goods_name = [];
    goods_list.forEach(item => {
      for (let i = 0; i < goodsList.length; i++) {
        if (goodsList[i].id === item) {
          goods_name.push(goodsList[i].goods_name);
        }
      }
    });

    const keyWord = this.props.keyWord;
    const isDisabled = (keyWord === 'showDetail');
    return (
      <div>
        {goods_name.map((item, idx) => (
          <div style={styles.specItem} key={idx}>
            <TextField
              hintText="商品名"
              floatingLabelText="商品名"
              value={item}
              key={idx}
              disabled={true}
              style={styles.specKey}
            />:
            <TextField
              hintText="请输入商品数量"
              floatingLabelText="商品数量"
              value={goods_count[idx]}
              disabled={isDisabled}
              onChange={e => {
                this.props.editGoodCount(idx, e.target.value);
              }}
              style={styles.specValue}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default connect(
  state => ({
    activeList: state.activeList.toJS(),
    goodsList: state.goodsList.toJS()
  }),
  dispatch => ({
    editGoodCount: (idx, value) => dispatch(activeList.editGoodCount(idx, value))
  })
)(EditGoodsCount);