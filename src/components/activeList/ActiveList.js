import React from 'react';
import {request} from './../../common/request';
import {activeType, noDataActive} from './../../common/common';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  RaisedButton,
  Paper
} from 'material-ui';
import {styles} from './GoodsListStyles';
import {connect} from 'react-redux';
import {activeList} from './../../actions';
import Pagination from './../common/Pagination';
import DetailModal from './DetailModal';

class ActiveList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      keyWord: ''
    };
  }

  componentDidMount() {
    const that = this;
    request('admin/activity/list', {}, {limit: 10, offset: 0})
      .then(res => {
        if (res.retCode == 0) {
          that.props.saveActiveList(res.data, res.total);
        }
      });
    request('admin/home/goods-list', {}, {})
      .then(res => {
        that.props.saveSelectList(res.data.dataArr);
      })
  }

  showModal = (id, key) => {
    if (id === null) {
      this.props.pickActiveDetail(noDataActive);
    } else {
      const activeList = this.props.activeList.activeList;
      activeList.forEach(item => {
        if (item.id === id) {
          this.props.pickActiveDetail(item);
        }
      });
    }
    this.setState({
      keyWord: key,
      modalShow: true
    });
  };

  modalClose = () => {
    this.setState({
      modalShow: false
    });
  };

  deleteActive = id =>{
    request(`admin/activity/del/${id}`, {
      method: 'DELETE'
    })
      .then(function (res) {
        if(res.retCode === 0){
          alert('删除成功');
        }
      });
  };

  render() {
    const dataRow = this.props.activeList.activeList;
    return (
      <Paper>
        <RaisedButton
          primary={true}
          style={{margin: '8px'}}
          onClick={() => {
            this.showModal(null, 'addActive');
          }}
        >
          添加
        </RaisedButton>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn style={styles.smallColumn}>ID</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>活动名称</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>活动类型</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>活动力度</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>开始时间</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>结束时间</TableHeaderColumn>
              <TableHeaderColumn style={styles.bigColumn}>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              dataRow.map(item => {
                return (
                  <TableRow key={item.id} selectable={false}>
                    <TableRowColumn style={styles.smallColumn}>{item.id}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.title}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{activeType[item.active_type]}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.discount}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.start_time}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.end_time}</TableRowColumn>
                    <TableRowColumn style={styles.bigColumn}>
                      <RaisedButton
                        primary={true}
                        onClick={() => {
                          this.showModal(item.id, 'showDetail');
                        }}
                      >查看详情</RaisedButton>
                      <RaisedButton
                        primary={true}
                        onClick={() => {
                          this.showModal(item.id, 'editDetail');
                        }}
                      >编辑</RaisedButton>
                      <RaisedButton onClick={()=>{this.deleteActive(item.id);}} primary={true}>删除</RaisedButton>
                    </TableRowColumn>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
        <Pagination
          total={this.props.activeList.total}
          limit={10}
          pageChange={this.pageChange}
        />
        <DetailModal
          keyWord={this.state.keyWord}
          open={this.state.modalShow}
          handleClose={this.modalClose}
        />
      </Paper>
    );
  }
}

export default connect(
  state => ({
    activeList: state.activeList.toJS()
  }),
  dispatch => ({
    saveActiveList: (dataArr, total) => dispatch(activeList.saveActiveList(dataArr, total)),
    pickActiveDetail: (dataObj) => dispatch(activeList.pickActiveDetail(dataObj)),
    saveSelectList: dataArr => dispatch(activeList.saveSelectList(dataArr))
  })
)(ActiveList);