function MockStore (options) {
}

MockStore.prototype.save = function (fn) {
  fn && fn();
  return this;
}

module.exports = {
  session: {
    Store: MockStore
  }
};