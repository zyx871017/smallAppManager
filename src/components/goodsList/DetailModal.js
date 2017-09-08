import {
  Dialog,
  RaisedButton,
  Step,
  Stepper,
  StepLabel,
} from 'material-ui';
import AvatarEditor from 'react-avatar-editor'
import React from 'react';
import AddGoodsDetail from './AddGoodsDetail';

class DetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
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

  getStepContent = (stepIndex) => {
    const {data, keyWord, categories} = this.props;
    switch(stepIndex){
      case 0:
        return <AddGoodsDetail data={data} keyWord={keyWord} categories={categories} />;
        break;
      case 1:
        return <div>2</div>;
        break;
      case 2:
        return <div>3</div>;
        break;
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
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
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
    const {keyWord} = this.props;
    const {stepIndex, finished} = this.state;

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
    const contentStyle = {margin: '0 16px'};

    return (
      <Dialog
        open={this.props.open}
        actions={actions}
        autoScrollBodyContent={true}
        title={modalTitle}
      >
        <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
          <Stepper activeStep={stepIndex}>
            <Step>
              <StepLabel>基本信息</StepLabel>
            </Step>
            <Step>
              <StepLabel>图片上传</StepLabel>
            </Step>
            <Step>
              <StepLabel>商品规格</StepLabel>
            </Step>
          </Stepper>
          <div style={contentStyle}>
            {finished ? (
              <p>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    this.setState({stepIndex: 0, finished: false});
                  }}
                >
                  Click here
                </a> to reset the example.
              </p>
            ) : (
              <div>
                <p>{this.getStepContent(stepIndex)}</p>
                <div style={{marginTop: 12}}>
                  <RaisedButton
                    label="Back"
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
              </div>
            )}
          </div>
        </div>
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

      </Dialog>
    )
  }
}

export default DetailModal;