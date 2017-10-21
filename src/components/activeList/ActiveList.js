import React from 'react';
import {request} from './../../common/request';
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

class ActiveList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    request('admin/activity/list', {}, {limit: 10, offset: 0})
      .then(res => {
      });
  }

  render() {
    const dataRow = [];
    return (
      <Paper>
        <RaisedButton
          primary={true}
          style={{margin: '8px'}}
          onClick={() => {
            this.showModal(null, 'addGoods');
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
              <TableHeaderColumn style={styles.bigColumn}>商品名称</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>商品价格</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>库存</TableHeaderColumn>
              <TableHeaderColumn style={styles.smallColumn}>销量</TableHeaderColumn>
              <TableHeaderColumn style={styles.bigColumn}>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              dataRow.map(item => {
                return (
                  <TableRow key={item.id} selectable={false}>
                    <TableRowColumn style={styles.smallColumn}>{item.id}</TableRowColumn>
                    <TableRowColumn style={styles.bigColumn}>{item.goods_name}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.goods_price}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.goods_storage}</TableRowColumn>
                    <TableRowColumn style={styles.smallColumn}>{item.goods_salenum}</TableRowColumn>
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
                      <RaisedButton primary={true}>删除</RaisedButton>
                    </TableRowColumn>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default ActiveList;