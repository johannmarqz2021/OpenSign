import * as Yup from 'yup';
import moment from 'moment';

import { isValidRut, R_EMAIL } from './utils';

const SUPPORTED_FORMATS = ['application/x-pkcs12'];

// Para usar este método:
// Yup.string().emailOrRut('El email o RUT que ingresaste no es válido'),
Yup.addMethod(Yup.string, 'emailOrRut', function emailRutValidate(message) {
  return this.test('test-name', message, function validLogin(value) {
    const { path, createError } = this;
    if (!value) {
      return false;
    }
    if (value.indexOf('@') !== -1) {
      // email validation
      if (R_EMAIL.test(value)) {
        return true;
      }
      if (value.length >= 4) {
        return createError({
          path,
          message: 'El email que ingresaste no es válido'
        });
      }
    } else {
      // rut validation
      if (isValidRut(value)) {
        return true;
      }
      const rut = value
        .replace(/\s/g, '')
        .replace(/\./g, '')
        .replace(/-/g, '');
      if (rut.length >= 4 && !Number.isNaN(Number(rut))) {
        return createError({
          path,
          message: 'El RUT que ingresaste no es válido'
        });
      }
    }
    return false;
  });
});

Yup.addMethod(Yup.string, 'emailValidation', function emailValidation(message) {
  return this.test('test-name', message, function validLogin(value) {
    const { path, createError } = this;
    if (!value) {
      return false;
    }
    if (value.indexOf('@') !== -1) {
      // email validation
      if (R_EMAIL.test(value)) {
        return true;
      }
      if (value.length >= 4) {
        return createError({
          path,
          message: 'El email que ingresaste no es válido'
        });
      }
    } else {
      return true;
    }
    return false;
  });
});

Yup.addMethod(Yup.string, 'emailDtValidation', function emailDtValidation(message) {
  return this.test('test-name', message, function validLogout(value) {
    const { path, createError } = this;
    if (!value) {
      return false;
    }

    if (value.substr(0, 1) === '.') {
      return createError({
        path,
        message
      });
    }

    if (value.substr(-1, 1) === '.') {
      return createError({
        path,
        message
      });
    }
    if (!/^[a-zA-Z0-9!#$%&'*/=?^_.+`{|}~\s-]*$/.test(value)) {
      return createError({
        path,
        message
      });
    }

    return true;
  });
});

Yup.addMethod(Yup.string, 'rut', function rutValidate(message) {
  return this.test('test-name', message, function validRut(value) {
    // rut validation
    if (value && isValidRut(value)) {
      return true;
    }
    return false;
  });
});

Yup.addMethod(Yup.mixed, 'isCertificate', function (message) {
  return this.test('is-file-valid', message, function (value) {
    const { path, createError } = this;
    if (!value || !SUPPORTED_FORMATS.includes(value.type)) {
      return createError({ path, message: message || 'El archivo no es un certificado válido' });
    }

    return true;
  });
});

Yup.addMethod(Yup.string, 'alphanumeric', function stringValidate(message) {
  return this.matches(/^[a-zA-Z0-9!?@#$&()<>'"´_áéíóúüÁÉÍÓÚÜñÑ\-`.+,\s]*$/, message);
});

Yup.addMethod(Yup.date, 'formatdate', function dateToMomentFormat() {
  return this.transform(function formatMoment(value, originalValue) {
    const newValue = moment(originalValue, 'DD/MM/YYYY');
    return newValue.isValid() ? newValue.toDate() : new Date('');
  });
});

Yup.addMethod(Yup.array, 'rangedate', function validRangeDate(requiredEndDate) {
  return this.test('test-name', 'Debes seleccionar una fecha de inicio', function formatMoment(value) {
    const { path, createError } = this;
    if (value) {
      const [startDateValue, endDateValue] = value;
      const startFormatted = moment(startDateValue, 'DD/MM/YYYY');
      if (startFormatted.isValid()) {
        const endFormatted = moment(endDateValue, 'DD/MM/YYYY');
        if (endFormatted.isValid()) {
          return moment(endFormatted, 'DD/MM/YYYY').isSameOrAfter(moment(startFormatted, 'DD/MM/YYYY'))
            ? true
            : createError({
                path,
                message: 'La fecha de término debe ser mayor o igual a la fecha de inicio'
              });
        }
        if (requiredEndDate) {
          return createError({
            path,
            message: 'Debes seleccionar una fecha de término'
          });
        }
        return true;
      }
    }
    return false;
  });
});


