/**
 * @author dondevi
 * @create 2108-06-25
 */

export default ({ Vue }) => {
  Vue.prototype.$session = new Proxy({}, {

    set (target, name, value) {
      if (value === null) {
        window.sessionStorage.removeItem(`$session.${name}`);
      } else {
        window.sessionStorage.setItem(`$session.${name}`, JSON.stringify(value));
      }
      target[name] = value;
      return value;
    },

    get (target, name) {
      if (name in target) { return target[name]; }
      let value = window.sessionStorage.getItem(`$session.${name}`);
      if (value === null) { return value; }
      value = target[name] = JSON.parse(value);
      return value;
    },

  });
};
