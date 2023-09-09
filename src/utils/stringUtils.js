import { transform, isEqual, isObject } from "lodash/fp";

export function validateEmail(email) {
  //eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

export function validateNumber(number) {
  const re = /^[1-9]\d*$/;
  return re.test(number);
};

export function getUserFullName(user) {
  return `${user.extras.firstName} ${user.extras.lastName}`;
}

const _transform = transform.convert({
  cap: false
});

const iteratee = baseObj => (result, value, key) => {
  if (!isEqual(value, baseObj[key])) {
    const valIsObj = isObject(value) && isObject(baseObj[key]);
    result[key] = valIsObj === true ? differenceObject(value, baseObj[key]) : value;
  }
};

export function differenceObject(targetObj, baseObj) {
  return _transform(iteratee(baseObj), null, targetObj);
}
