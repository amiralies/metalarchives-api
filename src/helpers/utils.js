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
}

module.exports = Utils;
