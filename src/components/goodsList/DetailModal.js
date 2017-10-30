import {
  Dialog,
  RaisedButton,
  Step,
  Stepper,
  StepButton
} from 'material-ui';
import React from 'react';
import AddGoodsDetail from './AddGoodsDetail';
import AddImage from './AddImage';
import AddGoodSpec from './AddGoodSpec';
import {request} from './../../common/request';
import {connect} from 'react-redux';

class DetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      fileUrl: ''
    };
  }

  handleClose = () => {
    this.props.handleClose();
  };

  getStepContent = (stepIndex) => {
    const {keyWord} = this.props;
    switch (stepIndex) {
      case 0:
        return <AddGoodsDetail keyWord={keyWord}/>;
      case 1:
        return <AddImage keyWord={keyWord}/>;
      case 2:
        return <AddGoodSpec keyWord={keyWord}/>;
      default:
        break;
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex === 2) {
      this.handleConfirm();
    }
    this.setState({
      stepIndex: stepIndex === 2 ? stepIndex : stepIndex + 1
    });
  };

  handleConfirm = () => {
    const queryData = this.props.goodsList.editGood;
    const keyWord = this.props.keyWord;
    let url = '';
    switch (keyWord) {
      case 'showDetail':
        return;
      case 'editDetail':
        url = 'admin/goods/edit-goods';
        break;
      case 'addGoods':
        url = 'admin/goods/add-goods';
        break;
      default:
        return;
    }
    const goods_spec = queryData.goods_spec;
    const goodsSpec = {};
    goods_spec.forEach(item => {
      const {key, value} = item;
      goodsSpec[key] = value;
    });
    queryData.goods_spec = goodsSpec;
    // 数据校验
    const {
      goods_name,
      goods_price,
      goods_marketprice,
      evaluation_count,
      evaluation_good_star,
      goods_storage,
      goods_salenum,
      goods_freight,
      goods_click,
      goods_image,
    } = queryData;

    if (!goods_name) {
      alert('商品名称不能为空！');
      return;
    }
    if (!goods_price || typeof parseInt(goods_price) !== 'number') {
      alert('商品价格输入有误或未输入！');
      return;
    }
    if (!goods_marketprice || isNaN(parseInt(goods_marketprice))) {
      alert('商品市场价输入有误或未输入');
      return;
    }
    if (isNaN(parseInt(evaluation_good_star))) {
      alert('商品评星输入有误，必须为数字');
      return;
    }
    if (isNaN(parseInt(evaluation_count))) {
      alert('商品评价数输入有误，必须为数字');
      return;
    }
    if (isNaN(parseInt(goods_storage))) {
      alert('商品库存输入有误，必须为数字');
      return;
    }
    if (isNaN(parseInt(goods_salenum))) {
      alert('商品销量输入有误，必须为数字');
      return;
    }
    if (isNaN(parseInt(goods_freight))) {
      alert('商品运费输入有误，必须为数字');
      return;
    }
    if (isNaN(parseInt(goods_click))) {
      alert('商品点击量输入有误，必须为数字');
      return;
    }
    if (!goods_image) {
      alert('商品主图为必填项目');
      return;
    }


    request(url, {
      method: 'POST',
      body: JSON.stringify(queryData)
    })
      .then(function () {
      });
  };

  render() {
    const {keyWord} = this.props;
    const {stepIndex} = this.state;

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
      <div style={{marginTop: 12}}>
        <RaisedButton
          label="取消"
          onClick={this.handleClose}
          style={{marginRight: 12}}
        />
        <RaisedButton
          label="上一步"
          disabled={stepIndex === 0}
          onClick={this.handlePrev}
          style={{marginRight: 12}}
        />
        <RaisedButton
          label={stepIndex === 2 ? '确认提交' : '下一步'}
          primary={true}
          onClick={this.handleNext}
        />
      </div>
    ];
    const contentStyle = {margin: '0 16px'};

    return (
      <Dialog
        open={this.props.open}
        actions={actions}
        autoScrollBodyContent={true}
        title={modalTitle}
      >
        <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
          <Stepper linear={false} activeStep={stepIndex}>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 0
                });
              }}>基本信息</StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 1
                });
              }}>图片上传</StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 2
                });
              }}>商品规格</StepButton>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            <div>
              {this.getStepContent(stepIndex)}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default connect(
  state => ({
    goodsList: state.goodsList.toJS(),
    categoriesList: state.categoriesList.toJS()
  })
)(DetailModal);