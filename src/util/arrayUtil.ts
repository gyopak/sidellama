/**
 * remove an item from an array at the specified index and return a new array
 * @param array
 * @param index
 * @returns {*[]}
 */
export const removeArrayItemAtIndex = (array: Array<any>, index: number) => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
];

/**
 * replace an item from an array at the specified index and return a new array
 * @param array
 * @param replacement
 * @param index
 * @returns {*[]}
 */
export const replaceArrayItemAtIndex = (array: Array<any>, replacement: any, index: number) => [
  ...array.slice(0, index),
  replacement,
  ...array.slice(index + 1)
];

/**
 * add an item to an array at the specified index and return a new array
 * @param array
 * @param item
 * @param index
 * @returns {*[]}
 */
export const addArrayItemAtIndex = (array: Array<any>, item: any, index: number) => [
  ...array.slice(0, index),
  item,
  ...array.slice(index)
];

/**
 * map and filter an array at the same time, thus reducing iterations
 * @param array
 * @param filter
 * @param map
 */
export const arrayFilterAndMap = (array: Array<any>, filter: ((input: any) => boolean), map: ((input: any) => any)) => array.reduce((result, current) => {
  if (filter(current)) {
    result.push(map(current));
  }

  return result;
}, []);

/**
 * get all the unique values into a new array
 * @param array
 * @param uniqueByFn
 * @returns {[]}
 */
export const unique = (array: Array<any>, uniqueByFn?: (input: any) => string) => {
  const newArray = [];
  const map = {};

  for (let i = 0; i < array.length; i += 1) {
    let stringValue = uniqueByFn ? uniqueByFn(array[i]) : array[i];

    try {
      stringValue = JSON.stringify(stringValue);
    } catch (e) {
      // do nothing
    }

    if (typeof stringValue !== 'string') {
      throw new Error('uniqueByFn must return a string');
    }

    // @ts-ignore
    if (!map[stringValue]) {
      newArray.push(array[i]);

      // @ts-ignore
      map[stringValue] = true;
    }
  }

  return newArray;
};

/**
 * update an array item with a matching value using a modification function
 * @param array
 * @param keyName
 * @param value
 * @param modificationFunction
 */
export const modifyArrayItemAt = (array: Array<any>, keyName: string | ((input: any) => any), value: any, modificationFunction: (input: any) => any) => array.map(element => {
  const isFunctionMatch = (typeof keyName === 'function' && keyName(element));
  const isValueMatch = (typeof keyName === 'string' && element[keyName] === value);
  const modifier = typeof value === 'function' ? value : modificationFunction;

  if (typeof modifier !== 'function') {
    throw new Error('you must pass a function as the 3rd or 4th argument');
  }

  if (isFunctionMatch || isValueMatch) {
    if (Array.isArray(element)) {
      return [...modifier(element)];
    }

    if (typeof element === 'object') {
      return { ...modifier(element) };
    }

    return modifier(element);
  }

  return element;
});

/**
 * remove an array item with a matching value
 * @param array
 * @param keyName
 * @param value
 */
export const removeArrayItemAt = (array: Array<any>, keyName: string, value: any) => array.filter(element => {
  if (value && typeof element === 'object' && element[keyName] === value) {
    return false;
  }

  if (value === undefined) {
    return element !== keyName;
  }

  return true;
});

/**
 * replace an array item with a matching value
 * @param array
 * @param keyName
 * @param value
 * @param newItem
 */
export const replaceArrayItemAt = (array: Array<any>, keyName: string, value: any, newItem: any) => array.map((element: any) => {
  if (element[keyName] === value) {
    return newItem;
  }

  return element;
});

/**
 * get an value from an object at a specified path
 * @param input
 * @param path
 * @param defaultValue
 * @param shouldThrow
 * @param allowFalsyValues - return default value if value is falsy
 * @returns {null|*}
 */
export const get: any = (
  input: Array<any>,
  path: string | string[] | ((input: any) => any),
  defaultValue = null,
  shouldThrow = false,
  allowFalsyValues = true
) => {
  if (typeof path === 'function') {
    return path(input);
  }

  if (typeof path === 'string') {
    path = path.split('.');
  }

  if (path.length === 0) {
    return input;
  }

  const key: any = path.shift();

  if (key && input[key] !== undefined) {
    if (typeof input[key] === 'object') {
      return get(input[key], path);
    }

    if (!input[key] && !allowFalsyValues) {
      return defaultValue;
    }

    return input[key];
  }

  if (shouldThrow) {
    throw new Error(`Item at path ${path} not found in object`);
  }

  return defaultValue;
};

/**
 * set an object value at a specific path
 * @param obj
 * @param path
 * @param val
 */
export const set = (obj: any | Array<string>, path: string | Array<string>, val: any): void => {
  function stringToPath(stringPath: string | Array<string>): Array<string> {
    if (typeof stringPath !== 'string') return stringPath;

    const output: Array<string> = [];

    stringPath.split('.').forEach(item => {
      item.split(/\[([^}]+)\]/g).forEach(key => {
        if (key.length > 0) {
          output.push(key);
        }
      });
    });

    return output;
  }

  path = stringToPath(path);

  const { length } = path;
  let current: any | Array<any> = obj;

  path.forEach((key: string, index: number) => {
    const isArray = key.slice(-2) === '[]';

    key = isArray ? key.slice(0, -2) : key;

    // @ts-ignore
    if (isArray && !Array.isArray(current[key])) {
      // @ts-ignore
      current[key] = [];
    }

    if (index === length - 1) {
      if (isArray) {
        // @ts-ignore
        current[key].push(val);
      } else {
        // @ts-ignore
        current[key] = val;
      }
    } else {
      // @ts-ignore
      if (!current[key]) {
        // @ts-ignore
        current[key] = {};
      }

      // @ts-ignore
      current = current[key];
    }
  });
};

/**
 * create a hash map from an array using the value found at a path
 * @param inputArray
 * @param path
 * @param valuesAsArrays
 * @returns {*}
 */
export function createMap(inputArray: Array<any>, path = null, valuesAsArrays = false) {
  return inputArray.reduce((hashmap, element) => {
    const keyValue = path
      ? get(element, path)
      : element;

    if (!keyValue) return hashmap;

    if (valuesAsArrays) {
      return { ...hashmap, [keyValue]: [...(hashmap[keyValue] || []), element] };
    }

    return { ...hashmap, [keyValue]: element };
  }, {});
}

/**
 * subtracts the items in one array from another array, returning a new array
 * @param arr1
 * @param arr2
 * @returns {*}
 */
export function subtractArrays(arr1: Array<any>, arr2: Array<any>) {
  return arr1
    .filter(item => !arr2.includes(item));
}

/**
 * curried sort callback to sort alphanumerically by a specific key
 * @param a
 * @param b
 * @returns {number}
 */
export function sortAlphaNumeric(key = null) {
  return (a: any, b: any) => {
    const isNumber = (v: any) => (+v).toString() === v;

    const aValue = key ? get(a, key) : a;
    const bValue = key ? get(b, key) : b;

    const aPart = aValue.match(/\d+|\D+/g) || '';
    const bPart = bValue.match(/\d+|\D+/g) || '';

    let i = 0; const len = Math.min(aPart.length, bPart.length);
    while (i < len && aPart[i] === bPart[i]) { i += 1; }

    if (i === len) {
      return aPart.length - bPart.length;
    }

    if (isNumber(aPart[i]) && isNumber(bPart[i])) {
      return aPart[i] - bPart[i];
    }

    return aPart[i].localeCompare(bPart[i]);
  };
}

/**
 * Slice an array into chunks of a specific size
 * @param array {Array}
 * @param size {Number}
 * @returns {Array}
 */
export function chunkArray(array:Array<any>, size: number) {
  const res = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    res.push(chunk);
  }

  return res;
}

export default {};
