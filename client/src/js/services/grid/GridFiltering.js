angular.module('bhima.services')
.service('GridFilteringService', GridFilteringService);

GridFilteringService.$inject = ['appcache', 'uiGridConstants'];

/**
 * Grid Filter Service
 *
 * This service is responsible for defining the global configuration for
 * filtering for ui-grids.
 */
function GridFilteringService(AppCache, uiGridConstants) {

  /** @const service key */
  var serviceKey = '-Filtering';

  function GridFiltering(gridOptions, cacheKey) {
    var cacheGridApi = gridOptions.onRegisterApi;

    this.gridOptions = gridOptions;

    var cache = this.cache = AppCache(cacheKey + serviceKey);

    // global filtering configuration
    cache.enableFiltering = cache.enableFiltering || true;
    gridOptions.enableFiltering = cache.enableFiltering;

    gridOptions.onRegisterApi = function onRegisterApi(api) {
      this.gridApi = api;

      if (angular.isDefined(cacheGridApi)) {
        cacheGridApi(api);
      }

    }.bind(this);
  }

  /**
   * @method filterByDate
   *
   * @description
   * Matches the date string provided in the string.
   */
  GridFiltering.prototype.filterByDate = function filterByDate(searchValue, cellValue) {
    var cellDate = new Date(cellValue);

    var month = cellDate.getMonth();
    var date = cellDate.getDate();
    var year = cellDate.getFullYear();

    var cellMonth = (month < 9) ? '0' + (month + 1) : (month + 1);
    var cellDateLong = (date < 10) ? '0' + date : date;
    var cellDateString = year + '-' + cellMonth + '-' + cellDateLong;

    searchValue = searchValue.replace(/\\/g, '');

    return cellDateString.indexOf(searchValue) !== -1;
  };

  /**
   * @method toggleInlineFiltering
   *
   * @description
   * This method toggles the inline grid filters on the column headers of a grid.
   */
  GridFiltering.prototype.toggleInlineFiltering = function toggleInlineFiltering() {
    if (!this.gridOptions) { return; }

    this.gridOptions.enableFiltering = !this.gridOptions.enableFiltering;
    this.cache.enableFiltering = this.gridOptions.enableFiltering;

    this.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
  };

  return GridFiltering;
}
