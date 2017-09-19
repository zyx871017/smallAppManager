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
      finished: false,
      stepIndex: 0,
      fileUrl: ''
    }
  }

  handleClose = () => {
    this.props.handleClose();
  };

  getStepContent = (stepIndex) => {
    const {keyWord} = this.props;
    switch(stepIndex){
      case 0:
        return <AddGoodsDetail keyWord={keyWord} />;
        break;
      case 1:
        return <AddImage keyWord={keyWord} />;
        break;
      case 2:
        return <AddGoodSpec keyWord={keyWord} />;
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
    if(stepIndex === 2){
      this.handleConfirm();
    }
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handleConfirm = () => {
    const queryData = this.props.goodsList.editGood;

    request('admin/goods/add-goods',{
      method: 'POST',
      body: JSON.stringify(queryData)
    })
      .then(function (res) {
        console.log(res);
      });
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
                  stepIndex: 0,
                  finished: false
                })
              }}>基本信息</StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 1,
                  finished: false
                })
              }}>图片上传</StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => {
                this.setState({
                  stepIndex: 2,
                  finished: false
                })
              }}>商品规格</StepButton>
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
              </div>
            )}
          </div>
        </div>
      </Dialog>
    )
  }
}

export default connect(
  state => ({
    goodsList: state.goodsList.toJS(),
    categoriesList : state.categoriesList.toJS()
  })
)(DetailModal);