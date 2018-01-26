// This is a file copied by your subgenerator
define([
    './../controllers'
    , '../../cons/simpleCons'
], function (mod, con) {
    mod.controller('videogroups.updateController', updateController)

    updateController.$injector = ['$scope', '$http', '$rootScope', '$uibModal', '$state', '$stateParams', 'widget', 'comfunc', '$filter', '$timeout'];
    function updateController($scope, $http, $rootScope, $uibModal, $state, $stateParams, widget, comfunc, $filter, $timeout) {
        $scope.param = {skus: [], products: []};
        $scope._tmp = {skus: [], products: []};
        if ($stateParams.id) {
            widget.ajaxRequest({
                url: con.live_domain + '/live/videogroups/' + $stateParams.id,
                method: 'GET',
                scope: $scope,
                success: function (json) {
                    $scope.param = json.data;
                    // 记录变化使用的临时变量
                    $scope._tmp = {
                        skus: angular.copy(json.data.skus),
                        products: angular.copy(json.data.products)
                    }
                    $scope.getDataFlag = true;
                }
            })
        }
        $scope.verify_room = function () {
            var has_room = false;
            angular.forEach($scope.param.rooms, function (val, key) {
                if (val.room_id == $scope.room_id) {
                    has_room = true;
                }
            });
            if ($scope.room_id && !has_room) {
                return true;
            } else if (has_room) {
                return '房间ID已存在!';
            } else {
                return '请输入房间ID!';
            }
        }
        $scope.add_room = function (json) {
            // console.log(json);
            var has_room = false;
            if (json.code == 0) {
                angular.forEach($scope.param.rooms, function (val, key) {
                    if (val.room_id == $scope.room_id) {
                        has_room = true;
                    }
                });
                if (!has_room) {
                    $scope.param.rooms = $scope.param.rooms || [];
                    $scope.param.rooms.push({
                        room_id: json.data.id,
                        room: {
                            title: json.data.title,
                            live_status: json.data.live_status,
                            plans: json.data.plans
                        }

                    });
                } else {
                    widget.msgToast('已经存在了')
                }
            } else {
                widget.msgToast('没有相关的房间ID');
                return false;
            }
        }
        $scope.verify_product = function (product_id, index) {
            if (product_id) {
                return true;
            } else {
                return '请输入活动ID!!';
            }
        }
        $scope.add_product = function (json, index) {
            if (json.code == 0) {
                $scope.param.products[index]._tmp_options = [];
                angular.forEach(json.data, function (val, key) {
                    $scope.param.products[index]._tmp_options.push({
                        option: {
                            option_type: val.option_type,
                            option_status: val.option_status,
                            option_name: val.option_name
                        },
                        option_id: val.option_id,
                        product_id: val.product_id,
                        text: val.option_name + '(' + $filter('product_option_status')(val.option_status) + ')',
                        value: val.option_id
                    });
                })
                // angular.forEach(json.data.options, function (val, key) {
                //     $scope.param.products[index]._tmp_options.push({
                //         text: val.option_name,
                //         value: val.option_id,
                //         option_id: val.option_id,
                //         option_name: val.option_name,
                //         product_id: val.product_id
                //     });
                // });
                // angular.forEach(json.data.groupbuy_options, function (val, key) {
                //     $scope.param.products[index]._tmp_options.push({
                //         text: val.option_name,
                //         value: val.option_id,
                //         option_id: val.option_id,
                //         option_name: val.option_name,
                //         product_id: val.product_id
                //     });
                // });
                // angular.forEach(json.data.gift_options, function (val, key) {
                //     $scope.param.products[index]._tmp_options.push({
                //         text: val.option_name,
                //         value: val.option_id,
                //         option_id: val.option_id,
                //         option_name: val.option_name,
                //         product_id: val.product_id
                //     });
                // });
                $scope.param.products[index]._tmp_options_selected = [];
                angular.forEach($scope.param.products[index].options, function (val, key) {
                    if (val.option_id) {
                        $scope.param.products[index]._tmp_options_selected.push(val.option_id);
                        angular.forEach($scope.param.products[index]._tmp_options, function (_tmp_options_val, _tmp_options_key) {
                            if (val.option_id == _tmp_options_val.option_id) {
                                _tmp_options_val.id = val.id;
                            }
                        });
                    }
                });
                // console.log($scope.param.products[index]._tmp_options_selected);
                // console.log(1);
            }
        }
        $scope.update_option = function () {
            if ($scope.param.products) {
                angular.forEach($scope.param.products, function (product, product_key) {
                    if (product._tmp_options && product._tmp_options.length > 0) {
                        product.options = [];
                        angular.forEach(product._tmp_options, function (_tmp_option_val, _tmp_option_key) {
                            angular.forEach(product._tmp_options_selected, function (_tmp_options_selected_val, _tmp_options_selected_key) {
                                if (_tmp_option_val.option_id == _tmp_options_selected_val) {
                                    var has_option = false;
                                    angular.forEach(product.options, function (option_val, option_key) {
                                        if (option_val.option_id == _tmp_options_selected_val) {
                                            has_option = true;
                                        }
                                    });
                                    if (!has_option) {
                                        product.options.push(_tmp_option_val);
                                    }
                                }
                            })
                        })
                    }
                });
            }
        }
        $scope.$watch('param.product_id', function (product_id) {
            if (product_id && product_id != 0) {
                $scope.param.product_url = $rootScope.common.wx_domain + '/product/detail/product_id/' + product_id + '?utm_source=appbuy';
            } else {
                $scope.param.product_url = '';
            }
        })


        $scope.reset_open_time = function (type) {
            console.log(type);
            $scope.param.open_time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }

        // products 有变化 自动更新授权的时间
        $scope.$watch('param.products', function (products_val, products_old_val) {
            if (products_val) {
                $scope.update_option();
                if (products_old_val && (products_val.length != $scope._tmp.products.length)) {
                    $scope.reset_open_time('products1');
                } else {
                    angular.forEach(products_val, function (val, key) {
                        if (!$scope._tmp.products[key] || !$scope._tmp.products[key].options) {
                            $scope.reset_open_time('products2');
                        } else if ($scope._tmp.products[key] && $scope._tmp.products[key].options && JSON.stringify(val.options) != JSON.stringify($scope._tmp.products[key].options)) {
                            $scope.reset_open_time('products3');
                        }
                    })
                }
            } else {
                // console.log('还没有products');
            }
        }, true);

        // skus 有变化 自动更新授权的时间
        $scope.$watch('param.skus', function (sku_val, sku_old_val) {
            if (sku_val) {
                if (sku_old_val && (sku_val.length != $scope._tmp.skus.length)) {
                    $scope.reset_open_time('sku1');
                } else {
                    angular.forEach(sku_val, function (val, key) {
                        if (!$scope._tmp.skus[key] || !$scope._tmp.skus[key].sku) {
                            $scope.reset_open_time('sku2');
                        } else if ($scope._tmp.skus[key] && $scope._tmp.skus[key].sku && val.sku != $scope._tmp.skus[key].sku) {
                            $scope.reset_open_time('sku3');
                        }
                    })
                }
            } else {
                // console.log('还没有skus');
            }
            // if ($scope.getDataFlag && (sku_old_val || (sku_old_val != undefined && JSON.stringify(val) != JSON.stringify($scope._tmp.skus)))) {
            //     console.log(sku_old_val, JSON.stringify(val), JSON.stringify($scope._tmp.skus));
            //     $scope.reset_open_time('skus');
            // }
        }, true);

        $scope.submit = function (status) {
            $scope.param.video_count = $scope.param.rooms && $scope.param.rooms.length || 0;
            // if ($scope.param.video_count == 0) {
            //     widget.msgToast('视频数量不能为0!');
            //     return false;
            // }
            if ($scope.param.pay_type == 1) {
                $scope.param.skus = [];
                $scope.param.products = [];
                $scope.param.product_id = '';
                $scope.param.product_url = '';
                $scope.param.onoff = 2;
            } else if ($scope.param.pay_type == 2) {
                if ($scope.param.skus.length == 0 && $scope.param.products.length == 0) {
                    widget.msgToast('收费模式下,关联SKU和关联活动类目不能同时为空!');
                    return false;
                } else if ($scope.param.products.length > 0) {
                    var err_option = false;
                    angular.forEach($scope.param.products, function (val, key) {
                        if (val.options.length == 0) {
                            err_option = true;
                        }
                    });
                    if (err_option) {
                        widget.msgToast('收费模式下,关联活动类目不能为空!');
                        return false;
                    }
                }

            }
            widget.ajaxRequest({
                url: con.live_domain + '/live/videogroups' + ($stateParams.id ? ('/' + $stateParams.id) : ''),
                method: $stateParams.id ? 'PUT' : 'POST',
                scope: $scope,
                data: $scope.param,
                success: function (json) {
                    widget.msgToast('发布成功！');
                    $state.go(con.state.main + '.videogroups.list');
                }
            })
        }
    };
});
