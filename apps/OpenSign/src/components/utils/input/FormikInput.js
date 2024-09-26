import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup, ButtonToolbar, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import Icon from '../../Icons';

const FormikInput = ({
  abbr,
  addon,
  classHelpText,
  delayHide,
  delayShow,
  defaultValue,
  direction,
  disabled,
  error,
  formInline,
  formType,
  helpText,
  inputType,
  label,
  leftAddon,
  margin,
  minInputHeight,
  placeholder,
  rightBtn,
  rightBtnClickHandler,
  selectedPlace,
  size,
  toolbarVariant,
  tooltipIcon,
  tooltipRight,
  tooltipSize,
  tooltipText,
  touched,
  widthInput,
  ...props
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.classList.remove('form-control');
    }
  }, []);

  const classNameInput = () => {
    if (inputType === 'file') {
      return 'op-file-input op-file-input-bordered op-file-input-sm focus:outline-none hover:border-base-content w-full text-xs'
    }
    return 'op-input op-input-bordered op-input-sm focus:outline-none hover:border-base-content w-full text-xs'
  }
  return (
    <Form.Group
      className={`text-xs ${formInline ? 'form-inline' : ''} ${disabled ? 'disabled' : ''} ${margin} ${error && touched ? 'is-invalid' : ''
        }`}
    >
      {label && (
        <>
          <Form.Label className="block">
            {label}
            {abbr && <span className="text-red-500 text-[13px]">*</span>}
            {tooltipText && !tooltipRight && (
              <ButtonToolbar className="ml-2">
                <OverlayTrigger
                  key={direction}
                  placement={direction}
                  delay={{ show: delayShow, hide: delayHide }}
                  overlay={<Tooltip>{tooltipText}</Tooltip>}
                >
                  <Icon icon={tooltipIcon} width={tooltipSize} />
                </OverlayTrigger>
              </ButtonToolbar>
            )}
          </Form.Label>
        </>
      )}
      <InputGroup className='flex gap-1 justify-center items-center'>
        {leftAddon && (
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">{leftAddon}</InputGroup.Text>
          </InputGroup.Prepend>
        )}

        <Form.Control
          style={{ width: `${widthInput}px`, minHeight: `${minInputHeight}px` }}
          disabled={disabled}
          size={size}
          placeholder={placeholder}
          ref={inputRef}
          className={classNameInput()}
          type={inputType}
          {...props}
        />
        {addon && (
          <InputGroup.Append>
            <InputGroup.Text id="basic-addon2">{addon}</InputGroup.Text>
          </InputGroup.Append>
        )}
        {rightBtn && (
          <InputGroup.Append>
            <Button id="basic-btn2" variant="outline-info" onClick={rightBtnClickHandler}>
              {rightBtn}
            </Button>
          </InputGroup.Append>
        )}
      </InputGroup>
      {tooltipText && tooltipRight && (
        <ButtonToolbar className="ml-2 mt-1">
          <OverlayTrigger
            key={direction}
            placement={direction}
            delay={{ show: delayShow, hide: delayHide }}
            overlay={<Tooltip>{tooltipText}</Tooltip>}
          >
            <Icon icon={tooltipIcon} width={tooltipSize} />
          </OverlayTrigger>
        </ButtonToolbar>
      )}
      {error && touched && <Form.Text className="text-danger">{error}</Form.Text>}
      {helpText && <Form.Text className={`${classHelpText || 'text-muted'} ml-2`}>{helpText}</Form.Text>}
    </Form.Group>
  )
};
FormikInput.propTypes = {
  delayHide: PropTypes.number,
  delayShow: PropTypes.number,
  direction: PropTypes.string,
  formInline: PropTypes.bool,
  margin: PropTypes.string,
  toolbarVariant: PropTypes.string,
  tooltipText: PropTypes.string,
  tooltipIcon: PropTypes.string,
  tooltipSize: PropTypes.string,
  tooltipRight: PropTypes.bool
};

FormikInput.defaultProps = {
  delayHide: 0,
  delayShow: 250,
  direction: 'bottom',
  formInline: false,
  margin: '',
  toolbarVariant: '',
  tooltipText: '',
  tooltipIcon: 'help-circle',
  tooltipSize: '15',
  tooltipRight: false
};

export default FormikInput;
