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
import DetailModal from './DetailModal';
import {styles} from './GoodsListStyles';

class GoodsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showData: {},
            modalShow: false,
            keyWord: '',
            categories: []

        };
    }

    componentDidMount() {
        const that = this;
        request('home/goods-list', {}, {limit: 10, offset: 0})
            .then(res => {
                if (res.retCode === 0) {
                    that.setState({
                        data: res.data.dataArr
                    });
                }
            });

        request('category/get-categories-list', {})
            .then(res => {
                console.log(res);
                if (res.retCode === 0) {
                    that.setState({
                        categories: res.data
                    });
                }
            });
    }

    showModal = (item, key) => {
        this.setState({
            showData: item,
            keyWord: key,
            modalShow: true
        });
    };

    modalClose = () => {
        this.setState({
            modalShow: false
        })
    };


    render() {
        const dataRow = this.state.data;
        return (
            <Paper>
                <RaisedButton
                    primary={true}
                    style={{margin: '8px'}}
                    onclick={()=>{this.showModal(null, 'addGoods')}}
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
                                                    this.showModal(item, 'showDetail')
                                                }}
                                            >查看详情</RaisedButton>
                                            <RaisedButton
                                                primary={true}
                                                onClick={() => {
                                                    this.showModal(item, 'editDetail')
                                                }}
                                            >编辑</RaisedButton>
                                            <RaisedButton primary={true}>删除</RaisedButton>
                                        </TableRowColumn>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
                <DetailModal
                    keyWord={this.state.keyWord}
                    data={this.state.showData}
                    open={this.state.modalShow}
                    handleClose={this.modalClose}
                    categories={this.state.categories}
                />
            </Paper>
        )
    }
}

export default GoodsList;