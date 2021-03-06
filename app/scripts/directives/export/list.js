define([
    '../../directives/directives',
    '../../cons/simpleCons'
], function (mod, cons) {
    mod
        .directive('exportRun', function ($templateCache, $uibModal, $timeout, widget,$filter) {
            return {
                restrict: 'AE',
                replace: false,
                scope: {
                    data: '=',
                },
                template: '<a class="btn btn-primary btn-rounded btn-sm" ng-click="show_export();">导出数据</a>',
                link: function ($scope, $element, $attrs) {
                    var supscope = $scope;
                    $scope.show_export = function () {
                        var modalInstance = $uibModal.open({
                            template: '<div modal-panel title="title" tmpl="tmpl"></div>',
                            controller: function ($scope, $uibModalInstance) {
                                $scope.param = $scope.param || {};
                                $scope._param = $scope._param || {};
                                $scope.title = supscope.data.desc || '导出数据';
                                $scope.tmpl = '<form class="form-horizontal" name="FormBody" novalidate>' +
                                    '<style type="text/css"> .modal .checkbox-inline{margin-left: 0;}' +
                                    '.modal .checkbox-inline{padding-left: 0;}</style>';
                                $scope.condition = supscope.data.condition;
                                $scope.command = supscope.data.command;
                                // console.log($scope.condition);
                                angular.forEach($scope.condition, function (val, key) {
                                    if (val.type == 'checkbox') {
                                        if (val.defaultValue) {
                                            $scope.param[key] = val.defaultValue.map(function(v){
                                                return v+'';
                                            });
                                        }
                                        $scope.tmpl += '<div form-checkbox text="' + val.name + '" ng-model="param.' + key + '"' + ' default="" ' +
                                            ' source="condition[\'' + key + '\'].options"  ' + (val.required ? ('required=\"true\"') : '') + '></div>';
                                    } else if (val.type == 'radiobox') {
                                        $scope.tmpl += '<div form-radio text="' + val.name + '" ng-model="param.' + key + '"' +
                                            ' source="condition[\'' + key + '\'].options"  ' + (val.required ? ('required=\"true\"') : '') + '></div>';
                                    } else if (val.type == 'date') {
                                        $scope.tmpl += '<div form-date="" text="' + val.name + '" ng-model="param.' + key + '"  ' + (val.required ? ('required=\"true\"') : '') + '></div>';
                                    } else if (val.type == 'datetime') {
                                        $scope.tmpl += '<div form-date-time="" text="' + val.name + '" ng-model="param.' + key + '" required="true" ></div>';
                                    } else if (val.type == 'text') {
                                        $scope.tmpl += '<div form-input text="' + val.name + '" ng-model="param.' + key + '"  ' + (val.required ? ('required=\"true\"') : '') + '></div>';
                                    } else if (val.type == 'textarea') {
                                        $scope.tmpl += '<div form-textarea text="' + val.name + '" ng-model="_param.' + key + '"  ' + (val.required ? ('required=\"true\"') : '') + ' placeholder="多条数据回车换行,否则会出错" rows="10"></div>';
                                    }
                                    if (val.default_val) {
                                        $scope.param[key] = val.default_val;
                                    }
                                });


                                $scope.tmpl += '<h4 class="col-sm-offset-2 text-danger" ng-show="condition.start_time&&condition.end_time">选择时间区间不能超过60天</h4>  ';
                                $scope.tmpl += '<a class="btn btn-primary btn-rounded pull-right" ng-disabled="FormBody.$invalid"  ng-click="exec();">执行</a>'
                                $scope.tmpl += '</form>';
                                $scope.exec = function () {
                                    angular.forEach($scope.condition, function (val, key) {
                                        if (val.type == 'textarea' && $scope._param[key]) {
                                            $scope.param[key] = $scope._param[key].replace(/\n/g, ',').split(',');
                                            // console.log($scope.param[key]);
                                        }
                                    });
                                    angular.extend($scope.param, {command: $scope.command});

                                    // 测试时间区间不能超过60天
                                    if($scope.condition['start_time'] && $scope.condition['start_time']){
                                      var start = new Date($filter('date')($scope.param.start_time, 'yyyy-MM-dd HH:mm:ss')).getTime();
                                      var end = new Date($filter('date')($scope.param.end_time, 'yyyy-MM-dd HH:mm:ss')).getTime();
                                      if((end-start)>183*24*3600000){
                                          widget.msgToast('选择时间区间不能超过183天！');
                                          return false;
                                      }
                                    }

                                    if (confirm('确认将查询结果导出EXCEL吗?')) {
                                        widget.ajaxRequest({
                                            url: '/exports/exec',
                                            method: 'post',
                                            scope: $scope,
                                            data: $scope.param,
                                            timeout: 1000 * 60 * 60,
                                            success: function (json) {
                                                window.open(cons.domain + json.data.url);
                                            }
                                        })
                                    }
                                }
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss('cancel');
                                }
                            },
                            size: ''
                        });
                    }
                }
            }
        })
});
