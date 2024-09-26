import React from 'react';
import { getIn } from 'formik';

const responseToBlob = response => {
  const format = response.headers['content-type'].split('/')[1];
  let blob = '';
  const { data } = response;
  if (format === 'xlsx' || format === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i !== byteCharacters.length; i += 1) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  } else if (format === 'csv') {
    const readUTF8 = data.toString('utf8');
    blob = new Blob([readUTF8], { type: 'application/vnd.ms-excel' });
  } else {
    blob = new Blob([data], { type: response.headers['content-type'] });
  }
  return blob;
};

const parseFilename = headers => {
  let filename = '';
  const disposition = headers['content-disposition'];
  if (disposition && (disposition.indexOf('attachment') !== -1 || disposition.indexOf('inline') !== -1)) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  return filename;
};

const parseUrlParams = params => {
  const options = {};
  params
    .replace(/\?/g, '')
    .split('&')
    .forEach(item => {
      const [key, value] = item.split('=');
      options[key] = value;
    });
  return options;
};

const downloadFile = response => {
  const blob = responseToBlob(response);
  const filename = parseFilename(response.headers);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}`;
  link.click();
  window.URL.revokeObjectURL(url);
};

const insertString = (value, position, str) => {
  return value.slice(0, position) + str + value.slice(position);
};

const hideString = (string, num) => {
  const regex = new RegExp(`^.{${num}}`, 'g');
  return string.replace(regex, match => '*'.repeat(match.length));
};

const rutFormat = value => {
  let rut = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/-/g, '');
  if (rut.length > 1) {
    rut = insertString(rut, -1, '-');
  }
  if (rut.length > 5) {
    rut = insertString(rut, -5, '.');
  }
  if (rut.length > 9) {
    rut = insertString(rut, -9, '.');
  }
  return rut;
};

const validRutInput = e => {
  const re = /^[0-9kK\b]+$/;
  const rawRut = e.target.value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/-/g, '');
  return e.target.value === '' || re.test(rawRut);
};

const licenseFormat = value => {
  let rut = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/-/g, '');
  if (rut.length > 1) {
    rut = insertString(rut, -1, '-');
  }
  return rut;
};

const isAlphanumeric = (value, field, setFieldValue) => {
  const alphanumeric = /^[a-zA-Z0-9!?@#$&()<>'"´_áéíóúüÁÉÍÓÚÜñÑ\-`.+,\s]*$/;
  if (alphanumeric.test(value)) {
    setFieldValue(field.name, value);
  }
};

const isNumeric = (value, field, setFieldValue) => {
  const numeric = /^[0-9]*$/;
  if (numeric.test(value)) {
    setFieldValue(field.name, value);
  }
};

const validPhoneInput = e => {
  const re = /^[0-9\b]+$/;
  return e.target.value === '' || re.test(e.target.value);
};

// eslint-disable-next-line no-useless-escape
const R_EMAIL = /^(?=.{1,64}@)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(?=.{1,255}$)((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

const rutValidation = rutInput => {
  // FORMAT
  const rut = rutInput
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/-/g, '');
  const body = rut.slice(0, -1);
  let dv = rut.slice(-1).toUpperCase();
  // Compute
  let sum = 0;
  let multiple = 2;
  // For every digit
  for (let i = 1; i <= body.length; i += 1) {
    // Get product
    const index = multiple * rut.charAt(body.length - i);
    // add to count
    sum += index;
    // In range [2,7]
    if (multiple < 7) {
      multiple += 1;
    } else {
      multiple = 2;
    }
  }
  // Division Remainder
  const dvComputed = 11 - (sum % 11);
  // (0 & K)
  dv = dv === 'K' ? 10 : dv;
  dv = dv === '0' ? 11 : dv;
  // Is valid?
  if (`${dvComputed}` !== `${dv}`) {
    return false;
  }
  return true;
};

const isValidRut = rut => {
  const result =
    (/^\d{1,2}\.?\d{3}\.?\d{3}[-]?[0-9kK]{1} *$/i.test(rut) || /^\d{1,2}\.\d{3}\.\d{3}[-]?[0-9kK]{1} *$/i.test(rut)) &&
    rutValidation(rut);
  return result;
};

const handleWorkflowStatus = status => {
  if (!status) {
    return '';
  }
  switch (status) {
    case 'approved':
      return <span className="status status-primary">APROBADO</span>;
    case 'pending':
      return <span className="status status-info">PENDIENTE</span>;
    default:
      return <span className="status status-danger">RECHAZADO</span>;
  }
};

const handleDaysShow = (item, attribute) => {
  return `${item?.[attribute]} ${item?.[attribute] === 1 ? 'día' : 'días'}`;
};

const compare = (row, dir, array) => {
  const arrayCompare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const colA = a[row.selector]?.toUpperCase() || '';
    const colB = b[row.selector]?.toUpperCase() || '';

    let reverse = 1;
    if (dir === 'asc') reverse = -1;
    if (colA > colB) return 1 * reverse;
    if (colA < colB) return -1 * reverse;
    return 0;
  };
  array.sort(arrayCompare);
};

const sortFunction = (rows, field, direction) => {
  const arrayCompare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const colA = a[field.selector]?.toUpperCase() || '';
    const colB = b[field.selector]?.toUpperCase() || '';

    let reverse = 1;
    if (direction === 'asc') reverse = -1;
    if (colA > colB) return 1 * reverse;
    if (colA < colB) return -1 * reverse;
    return 0;
  };
  if (!rows || rows.length === 0) return [];
  if (!field) return rows;
  const newArray = rows.slice(0);
  newArray.sort(arrayCompare);
  return newArray;
};

const filterArray = (array, query, keys) => {
  if (query === '') {
    return array;
  }
  if (array.length === 0) {
    return array;
  }
  return array.filter(item => {
    let inQuery = false;
    keys.forEach(key => {
      let vKey = getIn(item, key);
      vKey = Array.isArray(vKey) ? vKey.map(k => k.label) : vKey;
      if (
        String(vKey)
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        inQuery = true;
      }
    });
    return inQuery;
  });
};

const isObject = v => typeof v === 'object';

const emptyStringRecursive = obj => {
  if (!isObject(obj)) return obj;

  const newObj = obj;
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(subObj => emptyStringRecursive(subObj));
    } else if (value === null) {
      newObj[key] = '';
    }
  });
  return newObj;
};

const camelCase = str => str.replace(/[_.-](\w|$)/g, (_, x) => x.toUpperCase());

const camelCaseEmptyStringRecursive = obj => {
  if (obj === null) return '';

  if (Array.isArray(obj)) {
    return obj.map(value => camelCaseEmptyStringRecursive(value));
  }

  if (isObject(obj)) {
    const newObject = {};
    Object.entries(obj).forEach(([key, value]) => {
      newObject[camelCase(key)] = camelCaseEmptyStringRecursive(value);
    });
    return newObject;
  }
  return obj;
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

const delayMethod = (method, time = 150) => {
  setTimeout(method, time);
};

const sideScroll = (htmlElement, direction, speed = 20, distance = 400, step = 15) => {
  let scrollAmount = 0;
  const slideTimer = setInterval(() => {
    /* eslint-disable no-param-reassign */
    if (direction === 'left') {
      htmlElement.scrollLeft -= step;
    } else {
      htmlElement.scrollLeft += step;
    }
    scrollAmount += step;

    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
};

const groupBy = (array, attribute, optionalAttribute = null) => {
  return array.reduce((acc, current) => {
    const { [`${attribute}`]: key, [`${optionalAttribute}`]: optionalKey } = current;
    const vKey = key || optionalKey;
    if (acc.includes(acc.find(obj => Object.keys(obj).includes(vKey)))) {
      acc.find(obj => Object.keys(obj).includes(vKey) && obj[`${vKey}`].push(current));
    } else {
      acc.push({ [vKey]: [current] });
    }
    return acc;
  }, []);
};

const addLabelValue = (array, key) => array.map(obj => ({ ...obj, label: obj[key], value: obj.id }));

const sortByAttribute = (array, attribute, order = 'asc') => {
  return array.sort((a, b) => {
    const aAttr = a[attribute]?.toLowerCase();
    const bAttr = b[attribute]?.toLowerCase();

    if (order === 'desc') {
      if (aAttr < bAttr) return 1;
      if (bAttr < aAttr) return -1;
    } else {
      if (aAttr > bAttr) return 1;
      if (bAttr > aAttr) return -1;
    }
    return 0;
  });
};

const excludeKeys = (object, excludes) => {
  const copyObject = Object.assign({}, object);
  excludes.map(key => delete copyObject[key]);
  return copyObject;
};

const intToFloat = (num, decPlaces = 0) => {
  return num.toLocaleString(undefined, { maximumFractionDigits: decPlaces })
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;
  const latDif = lat2Rad - lat1Rad;
  const lonDif = lon2Rad - lon1Rad;
  const a =
    Math.sin(latDif / 2) * Math.sin(latDif / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDif / 2) * Math.sin(lonDif / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (earthRadius * c).toFixed(2);
};

export {
  addLabelValue,
  camelCaseEmptyStringRecursive,
  compare,
  delayMethod,
  downloadFile,
  emptyStringRecursive,
  excludeKeys,
  filterArray,
  formatBytes,
  groupBy,
  handleDaysShow,
  handleWorkflowStatus,
  hideString,
  licenseFormat,
  isAlphanumeric,
  isNumeric,
  isValidRut,
  parseUrlParams,
  R_EMAIL,
  rutFormat,
  rutValidation,
  sideScroll,
  sortByAttribute,
  sortFunction,
  validPhoneInput,
  validRutInput,
  intToFloat,
  calculateDistance
};
