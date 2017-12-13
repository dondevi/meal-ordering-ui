/**
 * =============================================================================
 *  Util Functions
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-25
 *
 */

/**
 * [{ key, }...] => { key, children: [{ key, children: [...] }...] }
 * @deprecated - No use anymore
 */
export function covertArrayToObject (array, keys, layer = 0) {
  var preKey = keys[layer - 1];
  var nowKey = keys[layer];
  var tmp = {};
  var res = { count: array.length, children: [] };
  if (!nowKey) {
    res.children = array;
    res[preKey] = array[0][preKey];
    return res;
  }
  array.forEach(item => {
    var val = item[nowKey];
    tmp[val] = tmp[val] || [];
    tmp[val].push(item);
    if (preKey) {
      res[preKey] = item[preKey];
    }
  });
  for (let key in tmp) {
    var child = covertArrayToObject(tmp[key], keys, layer + 1);
    res.children.push(child);
  }
  return res;
}
