import React from 'react';
import {connect} from 'react-redux';
import {Menu, MenuItem, Checkbox} from 'material-ui';
import {activeList} from './../../actions';
import {styles} from './GoodsListStyles';

class AddActiveGoods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      imgFieldOpen: false,
      menuSelected: this.props.categoriesList.categoriesList[0].id
    };
  }

  addSpec = () => {
    if (this.props.keyWord !== 'showDetail')
      this.props.addSpec();
  };

  menuOnchange = (e, v) => {
    this.setState({
      menuSelected: v
    });
  };

  goodCheck = e => {
    this.props.addActiveGoods(parseInt(e.target.value));
  };

  render() {
    const goodList = this.props.activeList.editActive.goods_list;
    const categoriesList = this.props.categoriesList.categoriesList;
    const goodsList = this.props.activeList.selectList;
    const keyWord = this.props.keyWord;
    const isDisabled = (keyWord === 'showDetail');
    return (
      <div>
        <div style={styles.categoryContent}>
          <Menu
            selectedMenuItemStyle={{
              backgroundColor: 'rgb(0, 188, 212)',
            }}
            value={this.state.menuSelected}
            menuItemStyle={{width: '100px'}}
            onChange={this.menuOnchange}
          >
            {categoriesList.map(item => {
              return (<MenuItem value={item.id} key={item.id} primaryText={item.name}/>);
            })}
          </Menu>
        </div>
        <div style={styles.goodsListContent}>
          {goodsList.map(item => {
            if (item.category_id === this.state.menuSelected) {
              return (<Checkbox
                label={item.goods_name}
                title={item.goods_name}
                value={item.id}
                key={item.id}
                disabled={isDisabled}
                style={styles.goodsCheckItem}
                labelStyle={styles.goodsCheckItem}
                checked={goodList.indexOf(item.id) >= 0}
                onCheck={this.goodCheck.bind(this)}
              />);
            }
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    goodsList: state.goodsList.toJS(),
    activeList: state.activeList.toJS(),
    categoriesList: state.categoriesList.toJS()
  }),
  dispatch => ({
    addActiveGoods: id => dispatch(activeList.addActiveGoods(id))
  })
)(AddActiveGoods);