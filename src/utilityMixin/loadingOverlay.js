const loadingOverlay = {
  color: '#16ccd9',
  canCancel: false,
  loader: 'dots',
  width: 120,
  height: 120
};

export const showLoadingOverlay = function () {
  return this.$loading.show(loadingOverlay);
};

export const hideLoadingOverlay = function (loader) {
  loader.hide();
};