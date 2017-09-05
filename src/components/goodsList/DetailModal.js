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
        super(props)
        this.state = {
            fileUrl: ''
        }
    }

    handleClose = () => {
        this.props.handleClose();
    };

    fileSelect = e => {
        const that = this;
        const image = e.currentTarget.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = function(e) {
            that.setState({
                fileUrl:e.target.result
            })
        };

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
                onClick={this.handleClose}
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
                <input
                    type="file"
                    accept="image/gif,image/jpeg,image/png"
                    onChange={this.fileSelect}
                />
                <AvatarEditor
                    image={this.state.fileUrl}
                    width={250}
                    height={250}
                    border={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1.2}
                    rotate={0}
                />
                <TextField
                    hintText="请输入商品名"
                    floatingLabelText="商品名"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.goods_name || ''}
                />
                <Divider/>
                <SelectField
                    hintText="请选择商品类型"
                    floatingLabelText="商品类型"
                    underlineShow={false}
                    disabled={isDisabled}
                    value={data.category_id || 1}
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
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.goods_jingle || ''}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品价格"
                    floatingLabelText="商品价格"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.goods_price || ''}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品市场价"
                    floatingLabelText="市场价"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.goods_marketprice || ''}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品库存"
                    floatingLabelText="商品库存"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.goods_storage || ''}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品销量"
                    floatingLabelText="商品销量"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.goods_salenum || 0}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品访问量"
                    floatingLabelText="商品访问量"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.goods_click || ''}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品运费"
                    floatingLabelText="商品运费"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.goods_freight || ''}
                />
                <Divider/>
                <TextField
                    hintText="请输入评价数"
                    floatingLabelText="商品评价数"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.evaluation_count || ''}
                />
                <Divider/>
                <TextField
                    hintText="请输入商品星级"
                    floatingLabelText="商品星级"
                    underlineShow={false}
                    disabled={isDisabled}
                    defaultValue={data.evaluation_good_star || ''}
                />
                <Divider/>
            </Dialog>
        )
    }
}

export default DetailModal;