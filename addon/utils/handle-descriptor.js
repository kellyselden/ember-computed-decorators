import extractValue from './extract-value';
import computed from 'ember-macro-helpers/computed';

export default function handleDescriptor(target, key, desc, params = []) {
  return {
    enumerable: desc.enumerable,
    configurable: desc.configurable,
    writeable: desc.writeable,
    initializer: function() {
      if (!desc.writable) {
        throw new Error('ember-computed-decorators does not support using getters and setters');
      }

      let value = extractValue(desc);

      params = params.map(param => {
        if (typeof param === 'function') {
          param = extractValue(param(target, key, desc));
        }
        return param;
      });

      return computed(...params, value);
    }
  };
}
