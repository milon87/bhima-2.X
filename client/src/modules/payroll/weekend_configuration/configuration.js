angular.module('bhima.controllers')
.controller('ConfigurationWeekEndController', ConfigurationWeekEndController);

ConfigurationWeekEndController.$inject = [
  'ConfigurationWeekEndService', 'ModalService',
  'NotifyService', 'uiGridConstants', '$state', 'SessionService',
];

/**
 * WeekEnd Management Controller
 *
 * This controller is about the WeekEnd management module in the admin zone
 * It's responsible for creating, editing and updating a WeekEnd
 */
function ConfigurationWeekEndController(Configs, ModalService,
  Notify, uiGridConstants, $state, Session) {
  var vm = this;

  // bind methods
  vm.deleteConfig = deleteConfig;
  vm.editConfig = editConfig;
  vm.toggleFilter = toggleFilter;
  vm.currencySymbol = Session.enterprise.currencySymbol;

  // global variables
  vm.gridApi = {};
  vm.filterEnabled = false;

  var gridColumn =
    [
      { field : 'label', displayName : 'FORM.LABELS.DESIGNATION', headerCellFilter : 'translate' },
      { field : 'action',
        width : 80,
        displayName : '',
        cellTemplate : '/modules/payroll/weekend_configuration/templates/action.tmpl.html',
        enableSorting : false,
        enableFiltering : false,
      },
    ];

  // options for the UI grid
  vm.gridOptions = {
    appScopeProvider  : vm,
    enableColumnMenus : false,
    fastWatch         : true,
    flatEntityAccess  : true,
    enableSorting     : true,
    onRegisterApi     : onRegisterApiFn,
    columnDefs : gridColumn,
  };

  function onRegisterApiFn(gridApi) {
    vm.gridApi = gridApi;
  }

  function toggleFilter() {
    vm.filterEnabled = !vm.filterEnabled;
    vm.gridOptions.enableFiltering = vm.filterEnabled;
    vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
  }

  function loadConfigs() {
    vm.loading = true;

    Configs.read()
    .then(function (data) {
      vm.gridOptions.data = data;
    })
    .catch(Notify.handleError)
    .finally(function () {
      vm.loading = false;
    });
  }

  // switch to delete warning mode
  function deleteConfig(title) {
    ModalService.confirm('FORM.DIALOGS.CONFIRM_DELETE')
    .then(function (bool) {
      if (!bool) { return; }

      Configs.delete(title.id)
      .then(function () {
        Notify.success('FORM.INFO.DELETE_SUCCESS');
        loadConfigs();
      })
      .catch(Notify.handleError);
    });
  }

  // update an existing WeekEnd Configuration
  function editConfig(title) {
    $state.go('configurationWeekEnd.edit', { id : title.id });
  }

  loadConfigs();
}