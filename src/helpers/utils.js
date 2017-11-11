class Utils {
  static makeSearchRegex(str) {
    const pattern = `^${str}.*$`;
    let regex;
    try {
      regex = new RegExp(pattern, 'i');
    } catch (e) {
      return false;
    }
    return regex;
  }

  static sendError(errStatus, errMessage) {
    const err = new Error(errMessage);
    err.status = errStatus;
    return err;
  }
}

module.exports = Utils;
