define([
    '../directives/directives',
    '../cons/simpleCons'
], function (mod, cons) {

    mod
        .directive('hjmGrid', function ($rootScope, $state, $http, $filter, $templateCache, $compile, widget, $log) {
            return {
                restrict: 'EA',
                replace: true,
                template: $templateCache.get('app/' + cons.DIRECTIVE_PATH + 'hjm/hjm-grid.html'),
                controller: ['$scope', function ($scope) {
                    $scope.initTableRequestSend = false;//是否初始化过 table

                    $scope.modsconfs = angular.copy(cons.modsconfs);
                    this.modsconfs = angular.extend({}, $scope.modsconfs);
                    this.buildSearchBar = function (config, element) {
                        var router = buildRouter(config);
                        if (config.searchSupport) {
                            var preSelectionSearch = '';
                            if (config.preSelectionSearch) {
                                preSelectionSearch = ' pre-selection="searchParams"';
                            }
                            var searchHtml = '<div hjm-search-bar search-items="searchItems" search-text="searchParams"' + preSelectionSearch +
                                'reset-search="refreshCurrentView" search-action="searchAction(searchParams)"></div>'
                            return router + searchHtml;
                        }
                        return router + '';
                    }

                    this.buildTable = function (columns, config) {
                        var header = buildHeader(columns, config);
                        var rowDef = buildRows(columns, config);
                        var tpigination = buildTfoot(columns, config);
                        return '<table class="table table-bordered table-striped table-hover">' + header + rowDef + '</table>' + tpigination;
                    }

                    function buildRouter(config) {
                        var router = '';
                        if (config.route && config.route.length > 0) {
                            angular.forEach(config.route, function (router_val, router_key) {
                                router += '<a class="btn btn-success btn-rounded" ui-sref="' + router_val.value + '" >' + router_val.text + '</a>';
                            });
                            return '<div class="row"><div class="col-sm-12"><div class="panel panel-default"><div class="panel-body">' + router + '</div></div></div></div>';
                        }
                        return '';
                    }

                    function buildHeader(columns, config) {
                        var headerContent = '';
                        angular.forEach(columns, function (col) {
                            var cssProperty = col.className ? ' class="' + col.className + '" ' : "";
                            headerContent += '<th' + cssProperty + '>' + col.name + '</th>';
                        });
                        // console.log('headerContent :: ', '<thead><tr>' + headerContent + '</tr></thead>');
                        return '<thead><tr>' + headerContent + '</tr></thead>';
                    }

                    function buildRows(columns, config) {
                        // console.log(arguments);
                        var useBindOnce = config.useBindOnce || 'bindonce';
                        var itemList = config.itemList || 'list';
                        var rowItemName = config.rowItemName || 'item';
                        var rowItem = '';
                        angular.forEach(columns, function (col) {
                            var cellContent = cellRender(col, rowItemName, useBindOnce);
                            var cssProperty = col.className ? ' class="' + col.className + '" ' : "";
                            rowItem += '<td' + cssProperty + '>' + cellContent + '</td>'
                        });
                        return '<tbody><tr ' + useBindOnce + ' ng-repeat="' + rowItemName + ' in ' + itemList + '">' + rowItem + '</tr></tbody>'

                    }

                    function buildTfoot(columns, config) {
                        if (config.paginationSupport)
                            return '<div hjm-pigination-bar page-info="pageInfo"><div>';
                        return '';
                    }

                    function cellRender(colDef, rowItemName, useBindOnce) {
                        var cellContent = '';
                        var cellFilter = colDef.filter;
                        var colField = colDef.field;
                        var itemString = rowItemName + '.' + colField;
                        var fieldDirective = colDef.fieldDirective;
                        if (fieldDirective) {
                            return fieldDirective;
                        }
                        if (colField) {
                            if (cellFilter) {
                                if (angular.isArray(cellFilter)) {
                                    itemString += '|' + cellFilter;
                                } else if (angular.isString(cellFilter)) {
                                    itemString += '|' + cellFilter;
                                }
                            }
                            if (colDef.truncateText) {
                                var textLength = colDef.truncateTextLength;
                                var textBreakOnWord = colDef.truncateTextBreakOnWord;
                                itemString += '|' + ('characters: ' + textLength || 10) + ' : ' + textBreakOnWord;
                                if (!!colDef.tooltip) {
                                    cellContent = '<span ng-bind="' + itemString + '" tooltip="{{' + rowItemName + '.' + colDef.tooltip + '}}"' +
                                        ' tooltip-placement="' + (colDef.tooltipPlacement || 'bottom') + '" ></span>';
                                } else {
                                    cellContent = '<span ng-bind="' + itemString + '" ></span>';

                                }
                            } else {
                                if (useBindOnce == false) {
                                    if (colDef.htmlField) {
                                        cellContent = '<span ng-bind=' + itemString + ' ></span>'
                                    } else {
                                        cellContent = '{{' + itemString + '}}'
                                    }
                                } else {
                                    var bindTag = colDef.htmlField ? 'bo-html' : 'bo-text';
                                    cellContent = '<span ' + bindTag + '="' + itemString + '"></span>'
                                }
                            }
                        }
                        return cellContent;
                    }

                    this.refreshCurrentView = function () {
                        // $scope.searchParams = configDef.preSelectionSearch || {};
                        // $scope.filterParams = configDef.preSelectionFilter || [];
                        $scope.searchParams = {};
                        // console.log($scope.searchParams);
                    }
                }],
                scope: {
                    modid: '@',
                    config: '@',
                    columns: '@'
                },
                link: function ($scope, $element, $attrs, $ctrl) {
                    var columnsDef = '';
                    var configDef = '';
                    $scope.list = [];
                    $scope.searchParams = {};
                    $scope.searchParams = {};
                    $scope.filterParams = {};
                    $scope.searchAction = function (searchParams) {
                        $log.info('当前查询条件 :', $scope.searchParams);
                        $scope.pageInfo.currentPage = 1;
                        $scope.updateList();
                    }
                    $scope.updateList = function () {
                        var pageInfo = {
                            page: $scope.pageInfo.currentPage || 1,
                            count: configDef.pageInfo.count || 1,
                        };
                        var searchItemsParamDefault = {};
                        angular.forEach(configDef.searchItems, function (searchItems_val, searchItems_key) {
                            if (searchItems_val.default) {
                                angular.forEach(configDef.searchItems, function (searchItems_val, searchItems_key) {
                                    if (searchItems_val.default || searchItems_val.default == '') {
                                        eval('searchItemsParamDefault.' + searchItems_val.value + ' = ' + searchItems_val.default);
                                    }
                                });
                            }
                        });
                        var searchParam = angular.extend({}, configDef.preSelectionSearch, searchItemsParamDefault, $scope.searchParams, pageInfo);
                        // console.log(configDef.pageInfo);
                        widget.ajaxRequest({
                            method: 'GET',
                            url: configDef.api,
                            scope: $scope,
                            data: searchParam,
                            success: function (json) {
                                $scope.list = json.list;
                                $scope.pageInfo.totalItems = ((json.count == 0) ? 0 : (json.count || $scope.pageInfo.totalItems));//获取总数
                            }
                        });
                    }
                    $scope.$watchCollection('[columns,config,modid]', function (gridDef) {
                            //这里初始化 执行一次 以后不会执行
                            if (gridDef) {
                                var modidDef = gridDef[2];
                                // console.log('$ctrl.modsconfs', $ctrl.modsconfs);
                                angular.forEach($ctrl.modsconfs, function (val, key) {
                                    angular.forEach(val, function (v, k) {
                                        if (k == modidDef) {
                                            $scope.modDef = v;
                                            columnsDef = $scope.$eval('modDef.' + gridDef[0]);
                                            configDef = $scope.$eval('modDef.' + gridDef[1]);
                                            $scope.configDef = configDef;// 提供页面展示
                                        }
                                    });
                                    ;
                                })
                                if (!columnsDef || !configDef) {
                                    $log.error('未找到modid为' + modidDef + '的config,请检查对应配置文件');
                                    return false;
                                }
                                $scope.pageInfo = {
                                    itemsPerPage: configDef.pageInfo.count,
                                    maxSize: configDef.pageInfo.maxSize || 5,
                                    currentPage: configDef.pageInfo.page,
                                }//初始化   开始监听  paginationInfo
                                $scope.searchItems = configDef.searchItems || [];
                                $ctrl.refreshCurrentView();
                                // configDef.refreshCurrentView = $scope.refreshCurrentView;
                                var searchBar = $ctrl.buildSearchBar(configDef, $element);
                                var tableContent = $ctrl.buildTable(columnsDef, configDef);
                                // console.log(searchBar);
                                $element.find('.searchSection').html(searchBar);
                                $element.find(".gridSection").html(tableContent);
                                $compile($element.contents())($scope);
                                $scope.updateList();
                            }
                        }
                    );
                    $scope.$watch('pageInfo', function (pageInfoDef, pageInfoOld) {
                        if ($scope.initTableRequestSend == false) {
                            $scope.initTableRequestSend = true;
                        } else {
                            //初始化组件已经获取过一次数据 totalItems 为空 等 totalItems 不是空了就可以走正常的了
                            if (pageInfoDef && pageInfoOld.totalItems) {
                                // console.log('pageInfoDef  ', pageInfoDef, pageInfoOld);
                                $scope.updateList('$watch pageInfo');
                            }
                        }
                    }, true)
                }
            };
        })
        .directive('hjmSearchBar', function ($rootScope, $state, $http, $modal, $filter, widget, $templateCache, $compile) {
            return {
                restrict: 'EA',
                replace: true,
                require: "^hjmGrid",
                scope: {
                    searchItems: '=',
                    searchText: '=',
                    searchAction: '&'
                    // resetSearch: '&',
                    // searchParams: '='
                    // preSelection: '@',
                },
                controller: ['$scope', function ($scope) {
                    $scope.params = {};
                }],
                template: $templateCache.get('app/' + cons.DIRECTIVE_PATH + 'hjm/hjm-search-bar.html'),
                link: function ($scope, $element, $attrs, $ctrl) {
                    $scope.searchParams = {}
                    $scope.autoSearch = false;//是否自动搜索 有监听 autoSearch = !autoSearch 就能够自动搜索了
                    $scope.$watch('searchItems', function (searchItemsVal) {
                        if (searchItemsVal) {
                            $scope.searchItems = searchItemsVal;
                            var searchItemsHtml = ''
                            angular.forEach(searchItemsVal, function (val, key) {
                                var placeholder = '';
                                if (val.paramDirective) {
                                    searchItemsHtml += '<div class="form-group col-sm-6">' +
                                        '<label class="col-sm-2 control-label">' + val.text + '</label>' +
                                        '<div class="col-sm-10">' + val.paramDirective +
                                        '</div>' +
                                        '</div>';
                                } else {
                                    if (val.type == 'datetime' || val.type == 'date') {
                                        var dateHtml = val.type == "datetime" ?
                                        '<hjm_date_time ng-model="params.' + val.value + '"></hjm_date_time>'
                                            : '<hjm_date ng-model="params.' + val.value + '"></hjm_date>';
                                        searchItemsHtml += '<div class="form-group col-sm-6">' +
                                            '<label class="col-sm-2 control-label">' + val.text + '</label>' +
                                            '<div class="col-sm-10">' + dateHtml +
                                            '</div>' +
                                            '</div>';
                                    } else if (val.type == 'btnGroup') {
                                        // 赋予默认值  param 对象
                                        $scope.$eval('params.' + val.value + '="' + val.default + '"');
                                        var btnHtml = '';
                                        if (val.enum.length > 0) {
                                            angular.forEach(val.enum, function (enum_val, enum_key) {
                                                var btnClassHtml = ('"btn-primary":params.' + val.value + '=="' + enum_val.value + '"');
                                                btnHtml += (' <button type="button" class="btn btn-default" ' +
                                                ' ng-class={' + btnClassHtml + '}' +
                                                ' ng-model="params.' + val.value + '"' +
                                                ' ng-click="params.' + val.value + ' = \'' + enum_val.value + '\';autoSearch=!!!autoSearch;">' +
                                                enum_val.text + '</button>');
                                            });
                                            btnHtml = '<div class="btn-group" role="group">' + btnHtml + '</div>';
                                        }
                                        searchItemsHtml += '<div class="form-group col-sm-12">' +
                                            '<label class="col-sm-1 control-label">' + val.text + '</label>' +
                                            '<div class="col-sm-11">' + btnHtml +
                                            '</div>' +
                                            '</div>';
                                    } else {
                                        if (val.placeholder) {
                                            placeholder = 'placeholder="' + val.placeholder + '"';
                                        }
                                        searchItemsHtml += '<div class="form-group col-sm-6">' +
                                            '<label class="col-sm-2 control-label">' + val.text + '</label>' +
                                            '<div class="col-sm-10">' +
                                            '<input type="input" class="form-control" ' + placeholder +
                                            ' ng-model="params.' + val.value + '">' +
                                            '</div>' +
                                            '</div>';
                                    }
                                }
                            })
                            searchItemsHtml += '<div class="form-group col-sm-6">' +
                                '<label class="col-sm-2 control-label"></label>' +
                                '<button type="button" class="btn btn-success btn-bordered" ng-click="search()">' +
                                '<i class="fa fa-search"></i>' +
                                '&nbsp;&nbsp;&nbsp;查询&nbsp;&nbsp;&nbsp;' +
                                '</button>' +
                                '<button class="btn btn-info btn-bordered" ng-click="resetSearch($event)">' +
                                '<i class="fa fa-refresh"></i>' +
                                '&nbsp;&nbsp;&nbsp;重置&nbsp;&nbsp;&nbsp;' +
                                '</button>' +
                                '</div>';
                            $element.find('.searchParam').html(searchItemsHtml);
                            $compile($element.contents())($scope);
                        }
                    });
                    $scope.watch = [$scope.params, $scope.autoSearch];

                    $scope.$watch('autoSearch', function (val, oldval) {
                        $scope.watch[1] = val;
                    });
                    $scope.$watch('params', function (val) {
                        $scope.watch[0] = val;
                    }, true);

                    $scope.$watch('watch', function (newVal, oldVal) {
                        angular.extend($scope.searchText, $scope.params);
                        if (newVal[1] != oldVal[1])
                            $scope.search();
                    }, true);

                    $scope.search = function () {
                        $scope.searchAction();
                    }
                    $scope.resetSearch = function () {
                        // 清空对象  清空第一层
                        angular.forEach($scope.params, function (val, key) {
                            $scope.params[key] = undefined;
                        });
                        $ctrl.refreshCurrentView();
                    }
                    $scope.search_keyup = function (event) {
                        if (event.keyCode == 13) {
                            $scope.search();
                        }
                    }
                }
            }
        })
        .directive('hjmPiginationBar', function ($rootScope, $state, $http, $modal, $filter, widget, $templateCache, $compile) {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    pageInfo: '='
                },
                template: $templateCache.get('app/' + cons.DIRECTIVE_PATH + 'hjm/hjm-pagination-bar.html'),
                link: function ($scope, $element, $attrs, $ctrl) {
                    $scope.$watch('pageInfo', function (pageInfoDef) {
                        $scope.pageInfo = pageInfoDef;
                    });
                    $scope.getapi = function (currentPage) {
                        $scope.pageInfo.currentPage = currentPage;
                    }
                }
            }
        })

})
