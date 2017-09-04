// Adapted from jQuery.param:
// https://github.com/jquery/jquery/blob/2.2-stable/src/serialize.js
function buildParams(prefix, obj, addFn) {
  var name;
  if (Array.isArray(obj)) {
    // Serialize array item.
    obj.forEach((value, index) => {
      if (/\[\]$/.test(prefix)) {
        // Treat each array item as a scalar.
        addFn(prefix, value);
      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(
          prefix +
            "[" +
            (typeof value === "object" && value !== null && value !== undefined
              ? index
              : "") +
            "]",
          value,
          addFn
        );
      }
    });
  } else if (typeof obj === "object") {
    // Serialize object item.
    for (name in obj) {
      buildParams(prefix + "[" + name + "]", obj[name], addFn);
    }
  } else {
    // Serialize scalar item.
    addFn(prefix, obj);
  }
}

export default function objectToQueryParamString(obj) {
  var parts = [];
  var addFn = function(key, value) {
    value = value === null || value === undefined ? "" : value;
    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  };

  Object.keys(obj).forEach(key => {
    buildParams(key, obj[key], addFn);
  });

  return parts.join("&").replace(/%20/g, "+");
}
