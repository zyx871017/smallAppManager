import React from 'react';
import {connect} from 'react-redux';
import {activeList} from './../../actions';
import {RaisedButton, Dialog} from 'material-ui';
import AvatarEditor from 'react-avatar-editor';
import {styles} from './GoodsListStyles';
import upload from './../../common/image/upload.png';

class AddActiveImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      imgFieldOpen: false
    };
  }

  singleFileSelect = e => {
    const that = this;
    const image = e.currentTarget.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function (e) {
      that.setState({
        imgFieldOpen: true,
        fileUrl: e.target.result
      });
    };
  };

  secFileSelect = (e, key) => {
    const that = this;
    const image = e.currentTarget.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function (e) {
      const obj = {};
      obj[key] = e.target.result;
      that.props.patchActiveDetail(obj);
    };
  };

  setEditorRef = editor => {
    if (editor) this.editor = editor;
  };

  handleSave = () => {
    const img = this.editor.getImageScaledToCanvas().toDataURL();
    this.props.patchActiveDetail({image_url: img});
    this.setState({imgFieldOpen: false});
  };

  render() {
    const editActive = this.props.activeList.editActive;
    return (
      <div>
        <img
          src={editActive.image_url || upload}
          style={styles.mainImage}
          alt={upload}
        />
        <RaisedButton
          label=""
          primary={true}
          style={styles.fileSelectContent}
        >
          上传图片
          <input
            style={styles.fileSelect}
            type="file"
            accept="image/gif,image/jpeg,image/png"
            onChange={this.singleFileSelect}
          />
        </RaisedButton>
        <span
          style={{marginBottom: '12px', display: 'block'}}
        >请上传产品主图，主图会在小程序首页的轮播图中展示，尺寸建议为宽度为528像素，长度为167像素，图片大小建议小于1M</span>
        <Dialog
          contentStyle={{width: '668px'}}
          open={this.state.imgFieldOpen}>
          <AvatarEditor
            ref={this.setEditorRef}
            onSave={this.handleSave}
            image={this.state.fileUrl}
            width={600}
            height={190}
            border={10}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1}
            rotate={0}
          />
          <RaisedButton
            style={{display: 'block'}}
            primary={true}
            onClick={this.handleSave}
          >确认</RaisedButton>
        </Dialog>
      </div>
    );
  }
}

export default connect(
  state => ({
    activeList: state.activeList.toJS()
  }),
  dispatch => ({
    patchActiveDetail: dataObj => dispatch(activeList.patchActiveDetail(dataObj))
  })
)(AddActiveImage);