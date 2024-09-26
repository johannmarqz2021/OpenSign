import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { Form, InputGroup, ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Icon from '../../Icons';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import './react-datepicker.css'
registerLocale('es', es);

const FormikDatePicker = ({
  abbr,
  delayHide,
  delayShow,
  direction,
  disabled,
  error,
  helpText,
  label,
  margin,
  tooltipText,
  touched,
  value,
  name,
  placeholderText,
  showIcon,
  dateFormat,
}) => {
  const { setFieldValue } = useFormikContext();

  const valueDate = value ? new Date(value) : null;

  return (
    <Form.Group className={`text-xs ${disabled ? 'disabled' : ''} ${margin} ${error && touched ? 'is-invalid' : ''}`}>
      {label && (
        <Form.Label className="block">
          {label}
          {abbr && <span className="text-red-500 text-[13px]">*</span>}
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
      <InputGroup className='w-full'>
        <DatePicker
          locale="es"
          showIcon={showIcon}
          selected={valueDate}
          onChange={(date) => setFieldValue(name, date ? date : '')} 
          dateFormat={dateFormat}
          placeholderText={placeholderText}
          className="op-input op-input-bordered op-input-sm focus:outline-none hover:border-base-content w-full text-xs"
        />
      </InputGroup>
      {error && touched && <Form.Text className="text-danger">{error}</Form.Text>}
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
    </Form.Group>
  );
};

FormikDatePicker.propTypes = {
  delayHide: PropTypes.number,
  delayShow: PropTypes.number,
  direction: PropTypes.string,
  margin: PropTypes.string,
  tooltipText: PropTypes.string,
  abbr: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  touched: PropTypes.bool,
  value: PropTypes.any,
  placeholderText: PropTypes.string,
  dateFormat: PropTypes.string,
  showIcon: PropTypes.bool
};

FormikDatePicker.defaultProps = {
  delayHide: 0,
  delayShow: 250,
  direction: 'bottom',
  margin: '',
  tooltipText: '',
  abbr: false,
  disabled: false,
  error: '',
  helpText: '',
  label: '',
  touched: false,
  value: null,
  placeholderText: '',
  dateFormat: 'dd/MM/yyyy',
  showIcon: true
};

export default FormikDatePicker;
