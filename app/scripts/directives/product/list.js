define([
    '../../directives/directives',
    '../../cons/simpleCons',
], function(mod, simpleCons) {
    mod.directive('productPattern', function($templateCache) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: $templateCache.get('app/' + simpleCons.DIRECTIVE_PATH + 'product/product-pattern.html'),
            link: function($scope, $element, $attrs) {
                $scope.cities = [];
                if ($scope.data.citys) {
                    angular.forEach($scope.data.citys, function(val) {
                        $scope.cities.push(val.city_name);
                    });
                    // console.log($scope.cities.join(','));
                }
            },
        };
    }).directive('groupbuyPattern', function($templateCache, $filter, $compile) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<p class="txt"></p>',
            // template: $templateCache.get('app/' + simpleCons.DIRECTIVE_PATH + 'product/groupbuy-pattern.html'),
            link: function($scope, $element, $attrs) {
                // console.log($scope.data);
                // console.log(1);
                if ($scope.data && $scope.data.category == 1) {
                    // $scope.txt = '砍价团';
                    // $scope.txt += '<br/>拼团有效时间:' + $filter('second2hour')($scope.data.group_seconds) + '小时';
                    // $scope.txt += '<br/>起始价:' + $scope.data.high_price;
                    // $scope.txt += '<br/>底价:' + $scope.data.bottom_price;
                    // $scope.txt += '<br/>单人返现:' + $scope.data.per_cut_amount;
                } else if ($scope.data && ($scope.data.category == 2 || $scope.data.category == 4)) {
                    $scope.txt = ($scope.data.category == 2) ? '人数团' : ($scope.data.category == 4 ? '人数团+直接买' : '');
                    $scope.txt += $scope.data.group_seconds ? ('<br/>拼团有效时间:' + $filter('second2hour')($scope.data.group_seconds) + '小时') : '';
                    $scope.txt += $scope.data.group_end_time ? ('<br/>拼团时长:' + $filter('remaining_time')($scope.data.group_end_time, $scope.data.created_at)) : '';
                    $scope.txt += $scope.data.groupbuy_end_type ? ('<br/>结束类型:' + $filter('groupbuy_end_type')($scope.data.groupbuy_end_type)) : '';
                    $scope.txt += '<br/>人数:' + $scope.data.group_min_num;
                    $scope.txt += '<br/>单价:' + $scope.data.price;
                }
                $element.find('.txt').html($scope.txt);
                $compile($element.contents())($scope);
            },
        };
    }).directive('productChangeStatus', function($templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<p class="change-status"></p>',
            link: function($scope, $element, $attrs) {
                var status_text = '';
                var click_text = '';
                var class_text = '';
                var status_title = '';
                if ($scope.data.status == 1) {
                    status_title = '下线';
                    status_text = 'ng-bind="\'下线商品\'"';
                    class_text = 'ng-class={\"btn-warning\":true} ';
                    click_text = 'ng-click="change(3);"';
                    $scope.show_text = true;
                } else if ($scope.data.status == 3) {
                    status_title = '上线';
                    status_text = 'ng-bind="\'上线商品\'"';
                    class_text = 'ng-class={\"btn-primary\":true} ';
                    click_text = 'ng-click="change(1);"';
                    $scope.show_text = true;
                }
                $scope.change = function(status) {
                    if (confirm('确认修改为' + status_title + '状态?')) {
                        widget.ajaxRequest({
                            url: '/products/' + $scope.data.product_id || 0,
                            method: 'patch',
                            scope: $scope,
                            data: {status: status},
                            success: function(json) {
                                widget.msgToast('修改成功,请刷新查看');
                                $scope.$parent.$parent.searchAction();
                            },
                        });
                    }
                };
                var content = '<a class="btn btn-rounded btn-xs"' + class_text + status_text + click_text +
                    ' ng-show="show_text" show-role="\'admin,op\'"></a>';
                $element.find('.change-status').html(content);
                $compile($element.contents())($scope);
            },
        };
    }).directive('changeProductType', function($templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<p class="change-product-type"  show-role="admin"></p>',
            link: function($scope, $element, $attrs) {
                var product_type_text = '';
                var click_text = '';
                var class_text = '';
                var product_type_title = '';
                if ($scope.data.product_type == 1) {
                    product_type_title = '测试';
                    product_type_text = 'ng-bind="\'改为测试\'"';
                    class_text = 'ng-class={\"btn-warning\":true} ';
                    click_text = 'ng-click="change(2);"';
                    $scope.show_text = true;
                } else if ($scope.data.product_type == 2) {
                    product_type_title = '正式';
                    product_type_text = 'ng-bind="\'改为正式\'"';
                    class_text = 'ng-class={\"btn-primary\":true} ';
                    click_text = 'ng-click="change(1);"';
                    $scope.show_text = true;
                }
                $scope.change = function(product_type) {
                    if (confirm('确认修改为' + product_type_title + '数据?')) {
                        widget.ajaxRequest({
                            url: '/products/' + ($scope.data.product_id || 0) + '/prodtype',
                            method: 'PUT',
                            scope: $scope,
                            data: {product_type: product_type},
                            success: function(json) {
                                widget.msgToast('修改成功,请刷新查看');
                                $scope.$parent.$parent.searchAction();
                            },
                        });
                    }
                };
                var content = '<a class="btn btn-rounded btn-xs"' + class_text + product_type_text + click_text +
                    ' ng-show="show_text" show-role="\'admin,op\'"></a>';
                $element.find('.change-product-type').html(content);
                $compile($element.contents())($scope);
            },
        };
    }).directive('productEdit', function($rootScope, $templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<p class="product-edit"></p>',
            link: function($scope, $element, $attrs) {
                var content = '';
                $scope.isActProduct = $scope.data.sku == 3 ? '.act' : '';
                if ('admin,op'.indexOf($rootScope.hjm.role) > -1) {
                    content = '<a class="btn btn-success btn-rounded btn-sm"' +
                        'ui-sref="main.product' + $scope.isActProduct + '.update({product_id:' + $scope.data.product_id + '})" show-role="\'admin,op\'" >编辑</a>';
                } else {
                    content = '<a class="btn btn-info btn-rounded btn-sm"' +
                        'ui-sref="main.product' + $scope.isActProduct + '.update({product_id:' + $scope.data.product_id + '})" show-role="\'!admin,op\'" >详情</a>';
                }
                $element.find('.product-edit').html(content);
                $compile($element.contents())($scope);
            },
        };
    }).directive('actEdit', function($rootScope, $templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
                callback: '&',
            },
            template: '<p class="act-edit"></p>',
            link: function($scope, $element, $attrs) {
                var content = '';
                if ('admin,op'.indexOf($rootScope.hjm.role) > -1) {
                    content = '<a class="btn btn-success btn-rounded btn-sm"' +
                        'ui-sref="main.act.update({product_id:' + $scope.data.product_id + '})" show-role="\'admin,op\'" >编辑</a>';
                } else {
                    content = '<a class="btn btn-info btn-rounded btn-sm"' +
                        'ui-sref="main.act.update({product_id:' + $scope.data.product_id + '})" show-role="\'!admin,op\'" >详情</a>';
                }
                $element.find('.act-edit').html(content);
                $compile($element.contents())($scope);
            },
        };
    }).directive('actCopy', function($rootScope, $templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<p class="act-copy"></p>',
            link: function($scope, $element, $attrs) {
                var content = '<a class="btn btn-success btn-rounded btn-sm"' +
                    'ui-sref="main.act.copy({product_id:' + $scope.data.product_id + '})" >复制</a>';
                $element.find('.act-copy').html(content);
                $compile($element.contents())($scope);
            },
        };
    }).directive('productAdd', function($rootScope, $templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<a class="btn btn-success btn-rounded btn-sm pull-right" style="margin-top: -5.5px;margin-left: 5px;" ' +
            'ui-sref="main.product.add" show-role="\'admin,op\'" >新增商品</a>',
            link: function($scope, $element, $attrs) {
            },
        };
    }).directive('productActAdd', function($rootScope, $templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<a class="btn btn-success btn-rounded btn-sm pull-right" style="margin-top: -5.5px;margin-left: 5px;" ' +
            'ui-sref="main.product.act.add" show-role="\'admin,op\'" >新增活动类商品</a>',
            link: function($scope, $element, $attrs) {
            },
        };
    }).directive('actAdd', function($rootScope, $templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<a class="btn btn-success btn-rounded btn-sm pull-right" style="margin-top: -5.5px;" ' +
            'ui-sref="main.act.add" show-role="\'admin,op\'" >新增活动</a>',
            link: function($scope, $element, $attrs) {
            },
        };
    }).directive('productOption', function($templateCache) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: $templateCache.get('app/' + simpleCons.DIRECTIVE_PATH + 'product/product-option.html'),
            link: function($scope, $element, $attrs) {

            },
        };
    }).directive('productOrderCopies', function($rootScope, $templateCache, $filter, $compile, widget, $uibModal) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<a class="btn btn-rounded btn-sm btn-info" ng-bind="data.order.order_copies||0" ng-click="show_order_copies()"' +
            ' ></a>',
            link: function($scope, $element, $attrs) {
                var supscope = $scope;
                $scope.show_order_copies = function() {
                    // if ('adminpm'.indexOf($rootScope.hjm.role) == -1) {
                    //     widget.msgToast('权限不够');
                    //     return false;
                    // }

                    var modalInstance = $uibModal.open({
                        template: '<div modal-panel title="title" tmpl="tmpl"></div>',
                        controller: function($scope, $uibModalInstance) {
                            widget.ajaxRequest({
                                url: '/products/' + (supscope.data.product_id || 0) + '/options',
                                method: 'get',
                                scope: $scope,
                                data: {
                                    count: 200,
                                },
                                success: function(json) {
                                    $scope.rtn_json = json.data;
                                },
                            });

                            $scope.tmpl = '<div class="form-horizontal" name="FormBody" novalidate>' +
                                ' <div form-table ng-model="rtn_json" config="{readonly:\'true\',orderBy:\'[option_type,order_by]\'}"' +
                                'columns="[{\'name\': \'ID\', \'field\': \'option_id\',\'hide\':\'true\'},' +
                                '{\'name\': \'活动类型\', \'field\': \'option_type\',\'filter\':\'product_category\',readonly:\'true\'},' +
                                '{\'name\': \'排序\', \'field\': \'order_by\',readonly:\'true\'},' +
                                '{\'name\': \'类目ID\', \'field\': \'option_id\',readonly:\'true\'},' +
                                '{\'name\': \'类目\', \'field\': \'option_name\',readonly:\'true\'},' +
                                '{\'name\': \'价格\', \'field\': \'option_price\',readonly:\'true\'},' +
                                '{\'name\': \'剩余库存\', \'field\': \'left_inventory\',readonly:\'true\'},' +
                                '{\'name\': \'已售库存\', \'field\': \'used_count\',readonly:\'true\'},' +
                                '{\'name\': \'库存\', \'field\': \'option_inventory\',readonly:\'true\'},' +
                                '{\'name\': \'状态\', \'field\': \'option_status\',filter:\'product_option_status\',readonly:\'true\'}' +
                                ']"></div>' +
                                '</div>';
                            $scope.title = '类目详情';
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'lg',
                    });
                };
            },
        };
    }).directive('actChangeNotice', function($rootScope, $templateCache, $filter, $compile, widget, $uibModal, $timeout) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<p><a class="btn btn-rounded btn-xs btn-primary" ng-click="show_act_change_notice()" >活动开始通知</a></p>',
            link: function($scope, $element, $attrs) {
                var supscope = $scope;
                $scope.show_act_change_notice = function() {
                    var modalInstance = $uibModal.open({
                        template: '<div modal-panel title="title" tmpl="tmpl"></div>',
                        controller: function($scope, $uibModalInstance) {
                            $scope.title = '发送活动开始通知';
                            $scope.tmpl = '<form class="form-horizontal" name="FormBody" novalidate' +
                                ' disabled-role="\'admin,op\'" >' +
                                '<h4>报名用户会收到活动开始通知（微信／短信），请确认无误后操作。</h4>' +
                                '<div form-date-time text="活动开始时间" ng-model="param.act_start_time" ng-disabled="true"></div>' +
                                '<div form-date-time text="活动结束时间" ng-model="param.act_end_time" ng-disabled="true"></div>' +
                                '<div form-input text="活动地址" ng-model="param.act_address" ng-disabled="true"></div>' +
                                '<div form-input text="详细地址" ng-model="param.act_detailed_address" ng-disabled="true"></div>' +
                                '<a class="btn btn-success btn-rounded pull-right" ng-click="submit()">确定</a>' +
                                '</form>';
                            $timeout(function() {
                                $scope.param = supscope.data;
                                // console.log($scope.param);
                            }, 0);
                            $scope.submit = function() {
                                // console.log($scope);
                                widget.ajaxRequest({
                                    url: '/products/' + (supscope.data.product_id || 0) + '/notify',
                                    method: 'PUT',
                                    scope: $scope,
                                    data: {},
                                    success: function(json) {
                                        widget.msgToast('发送活动开始通知成功!');
                                    },
                                });
                            };
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'lg',
                    });
                };
            },
        };
    }).directive('actCrowdfunding', function($rootScope, $templateCache, $filter, $compile, widget, $uibModal, $timeout) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<p><a class="btn btn-rounded btn-xs btn-warning" ng-click="show_act_crowdfunding()"' +
            ' ng-show="data.category==3&&is_show">发送众筹结果通知</a></p>',
            link: function($scope, $element, $attrs) {
                var supscope = $scope;
                $scope.is_show = true;
                if ($scope.data.category == 3) {
                    if (!($filter('remaining_time')(supscope.data.act_apply_end_time) == '已结束'
                        || $filter('arraySum')($scope.data.options, 'left_inventory') == 0)) {
                        $scope.is_show = false;
                    }
                }
                $scope.show_act_crowdfunding = function() {
                    // if (!$scope.is_show) {
                    //     widget.msgToast('众筹报名结束，或库存已售完，才能发送众筹结果通知');
                    //     return false;
                    // }
                    var modalInstance = $uibModal.open({
                        template: '<div modal-panel title="title" tmpl="tmpl"></div>',
                        controller: function($scope, $uibModalInstance) {
                            $scope.title = '发送众筹结果通知';
                            $scope.tmpl = '<form class="form-horizontal" name="FormBody" novalidate >' +
                                '<h4>请选择该众筹结果，操作完成后，报名用户会收到消息提醒；若众筹失败，则该活动订单会全部自动取消！请确认无误后再操作。</h4>' +
                                '<div form-radio text="众筹结果" ng-model="param.act_result" ng-disabled="disabled_act_result"' +
                                ' source="[{text:\'众筹成功\',value:\'1\'},{text:\'众筹失败\',value:\'2\'}]" ></div>' +
                                '<div form-textarea text="失败原因" ng-model="param.act_update_reason" ng-show="param.act_result==2"' +
                                ' data-placeholder="请填写失败原因，不超过30个字"></div>' +
                                '<a class="btn btn-success btn-rounded pull-right" ng-click="submit()">确定</a>' +
                                '</form>';
                            $timeout(function() {
                                $scope.param = {product_id: supscope.data.product_id};
                            }, 0);
                            $scope.$watch('param.act_result', function(val) {
                                if (val && val == 1) {
                                    $scope.param.act_update_reason = '';
                                }
                            });
                            $scope.submit = function() {
                                if (!$scope.param.act_result) {
                                    widget.msgToast('没有选择众筹结果');
                                    return false;
                                }
                                if ($scope.param.act_result == 2 && $scope.param.act_update_reason == '') {
                                    widget.msgToast('众筹失败要写原因');
                                    return false;
                                }
                                if ($scope.param.act_update_reason && $scope.param.act_update_reason.length > 30) {
                                    widget.msgToast('众筹失败原因字数要在30个以内');
                                    return false;
                                }
                                widget.ajaxRequest({
                                    url: '/products/' + (supscope.data.product_id || 0) + '/crowdfunding',
                                    method: 'PUT',
                                    scope: $scope,
                                    data: $scope.param,
                                    success: function(json) {
                                        $scope.rtn_json = json.data;
                                        widget.msgToast('发送众筹结果通知成功');
                                    },
                                    failure: function(json) {
                                        widget.msgToast(json.message);
                                        $scope.cancel();
                                    },
                                });
                            };
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: '',
                    });
                };
            },
        };
    }).directive('actOrderCopies', function($templateCache, $filter, $compile, widget, $uibModal) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<a class="btn btn-info btn-rounded btn-sm" ng-click="show();" ng-bind="text"></a>',
            link: function($scope, $element, $attrs) {
                $scope.text = (($scope.data.order || {}).order_count || 0);// + '/' + (($scope.data.allorder || {}).count || 0);
                $scope.ext = {product_id: $scope.data.product_id};
                var supscope = $scope;
                $scope.show = function() {
                    var modalInstance = $uibModal.open({
                        template: '<div hjm-grid modid="orderList" config="config_by_act_2" columns="columns_by_act" ext-search="ext"></div>',
                        controller: function($scope, $uibModalInstance) {
                            $scope.ext = supscope.ext;
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'lg',
                    });
                };
            },
        };
    }).directive('weinxiView', function($rootScope, $templateCache, $filter, $compile, widget, $uibModal, $timeout) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<a class="btn btn-rounded btn-link" ng-click="show_weixin_view()" style="padding-left: 0;">公众号购买链接</a>',
            link: function($scope, $element, $attrs) {
                var supscope = $scope;
                $scope.show_weixin_view = function() {
                    var modalInstance = $uibModal.open({
                        template: '<div modal-panel title="title" tmpl="tmpl"></div>',
                        controller: function($scope, $uibModalInstance) {
                            $scope.title = '公众号购买链接';
                            $scope.tmpl = '<form class="form-horizontal" name="FormBody" novalidate>' +
                                '<div form-textarea text="链接地址" ng-model="link"></div>' +
                                '<a class="btn btn-warning btn-rounded pull-right" ng-click="cancel()">关闭</a>' +
                                '</form>';
                            $timeout(function() {
                                $scope.link = simpleCons.wx_domain + '/product/detail/product_id/' + supscope.data.product_id;
                            }, 0);
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'lg',
                    });
                };
            },
        };
    }).directive('accountIdToName', function($rootScope, $templateCache, $filter, $compile, widget) {
        return {
            multiElement: true,
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<span ng-bind="account_name"></span>',
            link: function($scope, $element, $attrs) {
                angular.forEach($rootScope.account_list, function(val) {
                    if (val.account_id == $scope.data.account_id) {
                        $scope.account_name = '负责人:' + val.username;
                    }
                });
                if (!$scope.account_name) {
                    $scope.account_name = '负责人ID:' + $scope.data.account_id;
                }
            },
        };
    }).directive('actDistribution', function($rootScope, $templateCache, $filter, $compile, widget, $uibModal, $timeout) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                data: '=',
            },
            template: '<p><a class="btn btn-rounded btn-xs btn-primary" ng-click="open()" >分销设置</a></p>',
            link: function($scope, $element, $attrs) {
                var supscope = $scope;
                $scope.open = function() {
                    var modalInstance = $uibModal.open({
                        template: '<div modal-panel title="title" tmpl="tmpl"></div>',
                        controller: function($scope, $uibModalInstance) {
                            $scope.title = '分销设置';
                            $scope.tmpl = $templateCache.get('app/' + simpleCons.biz_path + 'act/distribution.html');
                            $scope.init = function() {
                                widget.ajaxRequest({
                                    url: '/products/' + (supscope.data.product_id || 0) + '/distribution',
                                    method: 'get',
                                    scope: $scope,
                                    data: {},
                                    success: function(json) {
                                        var o = json.data || {};
                                        o.title = supscope.data.title;
                                        o.product_id = supscope.data.product_id;

                                        // 一级
                                        o.groupbuy_in_level_one = Number(o.groupbuy_in_level_one || 10);
                                        o.groupbuy_elastic_level_one = Number(o.groupbuy_elastic_level_one || 10);
                                        o.poster_level_one = Number(o.poster_level_one || 10);

                                        // 二级
                                        o.groupbuy_in_level_two = Number(o.groupbuy_in_level_two || 0);
                                        o.groupbuy_elastic_level_two = Number(o.groupbuy_elastic_level_two || 0);
                                        o.poster_level_two = Number(o.poster_level_two || 0);

                                        o.open_state = o.open_state || '2';
                                        o.open_product_poster = o.open_product_poster || '1';
                                        o.open_groupbuy_poster = o.open_groupbuy_poster || '1';
                                        $scope.param = o;
                                    },
                                });
                            };
                            $scope.init();
                            $scope.$watch('param.open_state', function(val, oldVal) {
                                if (val == 1) {
                                    $scope.param.open_product_poster = 2;
                                    $scope.param.open_groupbuy_poster = 2;
                                }
                            }, true);
                            $scope.submit = function() {
                                // console.log($scope);
                                widget.ajaxRequest({
                                    url: '/products/' + (supscope.data.product_id || 0) + '/distribution',
                                    method: 'PUT',
                                    scope: $scope,
                                    data: $scope.param,
                                    success: function(json) {
                                        widget.msgToast('提交成功!');
                                        $scope.cancel();
                                    },
                                });
                            };
                            $scope.cancel = function() {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        size: 'lg',
                    });
                };
            },
        };
    });
});
