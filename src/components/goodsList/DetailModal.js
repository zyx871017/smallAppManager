import {
    Dialog,
    TextField,
    Divider,
    SelectField,
    RaisedButton,
    MenuItem
} from 'material-ui';
import AvatarEditor from 'react-avatar-editor'
import React from 'react';

class DetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileUrl: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        const data = nextProps.data;
        console.log(data);
        this.setState(data);
    }

    handleClose = () => {
        this.props.handleClose();
    };

    fileSelect = e => {
        const that = this;
        const image = e.currentTarget.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function (e) {
            that.setState({
                fileUrl: e.target.result
            })
        };

    };

    handleConfirm = () => {
        const {
            goods_name,
            category_id,
            goods_jingle,
            goods_price,
            goods_marketprice,
            goods_storage,
            goods_salenum,
            goods_click,
            goods_freight,
            evaluation_count,
            evaluation_good_star
        } = this.state;
        console.log(goods_name,
            category_id,
            goods_jingle,
            goods_price,
            goods_marketprice,
            goods_storage,
            goods_salenum,
            goods_click,
            goods_freight,
            evaluation_count,
            evaluation_good_star)
    };

    render() {
        const {data, keyWord, categories} = this.props;

        let modalTitle = '';
        switch (keyWord) {
            case 'showDetail':
                modalTitle = '商品详情';
                break;
            case 'editDetail':
                modalTitle = '编辑详情';
                break;
            case 'addGoods':
                modalTitle = '添加商品';
                break;
            default:
                break;
        }

        const actions = [
            <RaisedButton
                label="取消"
                keyboardFocused={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                label="确认"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleConfirm}
            />
        ];
        const isDisabled = (keyWord === 'showDetail');

        return (
            <Dialog
                open={this.props.open}
                actions={actions}
                autoScrollBodyContent={true}
                title={modalTitle}
            >
                {/*<input*/}
                {/*type="file"*/}
                {/*accept="image/gif,image/jpeg,image/png"*/}
                {/*onChange={this.fileSelect}*/}
                {/*/>*/}
                {/*<AvatarEditor*/}
                {/*image={this.state.fileUrl}*/}
                {/*width={250}*/}
                {/*height={250}*/}
                {/*border={50}*/}
                {/*color={[255, 255, 255, 0.6]} // RGBA*/}
                {/*scale={1.2}*/}
                {/*rotate={0}*/}
                {/*/>*/}
                <TextField
                    hintText="请输入商品名"
                    floatingLabelText="商品名"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.goods_name || ''}
                    onChange={(e) => {
                        this.setState({
                            goods_name: e.target.value
                        });
                    }}
                />
                <Divider/>
                <SelectField
                    hintText="请选择商品类型"
                    floatingLabelText="商品类型"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.category_id || 1}
                    onChange={(e, i, v) => {
                        this.setState({
                            category_id: v
                        })
                    }}
                >
                    {
                        categories.map(item => {
                            return (
                                <MenuItem value={item.id} primaryText={item.name}/>
                            )
                        })
                    }
                </SelectField>
                <Divider/>
                <TextField
                    hintText="请输入广告词"
                    floatingLabelText="广告词"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.goods_jingle || ''}
                    onChange={e => {
                        this.setState({
                            goods_jingle: e.target.value
                        })
                    }}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品价格"
                    floatingLabelText="商品价格"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.goods_price || ''}
                    onChange={e => {
                        this.setState({
                            goods_price: e.target.value
                        });
                    }}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品市场价"
                    floatingLabelText="市场价"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.goods_marketprice || ''}
                    onChange={e => {
                        this.setState({
                            goods_marketprice: e.target.value
                        })
                    }}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品库存"
                    floatingLabelText="商品库存"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.goods_storage || ''}
                    onChange={e => {
                        this.setState({
                            goods_storage: e.target.value
                        })
                    }}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品销量"
                    floatingLabelText="商品销量"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.goods_salenum || ''}
                    onChange={e => {
                        this.setState({
                            goods_salenum: e.target.value
                        })
                    }}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品访问量"
                    floatingLabelText="商品访问量"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.goods_click || ''}
                    onChange={e => {
                        this.setState({
                            goods_click: e.target.value
                        })
                    }}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品运费"
                    floatingLabelText="商品运费"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.goods_freight || ''}
                    onChange={e => {
                        this.setState({
                            goods_freight: e.target.value
                        })
                    }}
                />
                <Divider/>
                <TextField
                    hintText="请输入评价数"
                    floatingLabelText="商品评价数"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.evaluation_count || ''}
                    onChange={e => {
                        this.setState({
                            evaluation_count: e.target.value
                        })
                    }}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品星级"
                    floatingLabelText="商品星级"
                    style={{width: '100%'}}
                    underlineShow={false}
                    disabled={isDisabled}
                    value={this.state.evaluation_good_star || ''}
                    onChange={e => {
                        this.setState({
                            evaluation_good_star: e.target.value
                        })
                    }}
                />
                <Divider/>
            </Dialog>
        )
    }
}

export default DetailModal;