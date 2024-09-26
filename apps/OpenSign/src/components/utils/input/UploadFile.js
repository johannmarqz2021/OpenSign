/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Form, ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Icon from '../../Icons';

class UploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name || ' '
    };
  }

  componentDidUpdate(prevState) {
    const { name } = this.props;
    const { name: sName } = this.state;
    if (name !== sName && prevState.name === sName) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ name });
    }
  }

  _handleFileChange(e) {
    const { onChange } = this.props;
    e.preventDefault();
    if (e.target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    onChange(file);
  }

  render() {
    const {
      abbr,
      error,
      inputFileId,
      label,
      touched,
      formats,
      disabled,
      direction,
      delayShow,
      delayHide,
      tooltipText
    } = this.props;
    const acceptedFormats = formats?.length ? formats.join(',') : '';
    return (
      <div className={`text-xs ${error && touched ? 'is-invalid' : ''} ${disabled && 'disabled'}`}>
        {label && (
          <Form.Label className="block">
            {label} {abbr && <abbr className="text-red-500 text-[13px]">*</abbr>}
            {tooltipText && (
              <ButtonToolbar className="ml-2">
                <OverlayTrigger
                  key={direction}
                  placement={direction}
                  delay={{ show: delayShow, hide: delayHide }}
                  overlay={<Tooltip>{tooltipText}</Tooltip>}
                >
                  <Icon icon="help-circle" height="15px" width="15px" />
                </OverlayTrigger>
              </ButtonToolbar>
            )}
          </Form.Label>
        )}
        <div className="flex gap-1 justify-center items-center input-group">
          <div className="custom-file">
            <input
              type="file"
              className="op-file-input op-file-input-bordered op-file-input-sm focus:outline-none hover:border-base-content w-full text-xs"
              id={inputFileId}
              aria-describedby="inputGroupFileAddon01"
              onChange={e => this._handleFileChange(e)}
              accept={acceptedFormats}
            />
          </div>
        </div>
        {error && touched && <Form.Text className="text-danger mb-2">{error}</Form.Text>}
      </div>
    );
  }
}

UploadFile.defaultProps = {
  onChange: () => {},
  inputFileId: 'inputGroupFile01',
  delayHide: 0,
  delayShow: 250,
  direction: 'bottom',
  tooltipText: ''
};

export default UploadFile;
