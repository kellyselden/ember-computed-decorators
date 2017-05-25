import extractValue from './utils/extract-value';
import isDescriptor from './utils/is-descriptor';
import isComputed from 'ember-macro-helpers/is-computed';
import getValue from 'ember-macro-helpers/get-value';

function handleDescriptor(target, property, desc, fn, params = []) {
  return {
    enumerable: desc.enumerable,
    configurable: desc.configurable,
    writable: desc.writable,
    initializer: function() {
      params = params.map(param => {
        if (typeof param === 'function') {
          param = extractValue(param(target, property, desc));
        }
        if (isComputed(param)) {
          param = getValue({ context: target, macro: param });
        }
        return param;
      });

      return fn(...params);
    }
  };
}

export default function macroAlias(fn) {
  return function(...params) {
    if (isDescriptor(params[params.length - 1])) {
      return handleDescriptor(...params, fn);
    } else {
      return function(target, property, desc) {
        return handleDescriptor(target, property, desc, fn, params);
      };
    }
  };
}
