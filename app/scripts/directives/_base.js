define([
    './directives',
    '../cons/simpleCons',
    './hjm-grid',// grid
    './hjm-form',// form
    './hjm-form-valid',// form-valid 表单验证
    './hjm-ueditor',// ueditor
    './nav-top',// 上边内容
    './side-left',// 左边菜单
    './hjmdirectives',
    './role-permission',
    './show_image',
    './select_city',
    './select_boards',// 负责人管理中 选择板块
    // './order_list',// 订单列表
    // './pintuan_order_list',// 拼团的订单列表
    './show_str',// 分割逗号隔开的字符串展示
    './thumb',// 展示本地图片
    './common_form',// 公用表单更新,添加  menu 使用
    './common_list',// 公用表单列表
    // './bindHtmlCompile',// 编译带绑定的 bindHtmlCompile
    './baidumap',// 百度地图绑定
    './product/list',// 商品规则
    './groupbuy/list',// 拼团规则
    './order/list',// 订单规则
    './deliveries/list',// 配送规则
    './banner/list',// 配送规则
    './user/list',// 用户规则
    './sms/list',// 短信群发规则
    './account/list',//账户 权限  菜单 规则
    './exchangecode/list',//账户 权限  菜单 规则
    './export/list',//导出 规则
    './refund/list',//财务 规则
    './subject/list',//专题 规则
    './resource/list',//专题 规则
    // './subject_group/list',//专题组 规则
    './tmpl/modal_panel_tmpl',//
], function (mod,
             simpleCons) {
    mod

    /** 文本编辑器
     * <show-textarea ng-model="data" placeholder="你需要在文本框里默认显示文字"></show-textarea>
     * data: ng-model绑定输出的数据格式输出如下：
     * {
    *    'size'   : '', 字体大小
    *    'align'  : '', 字体对齐
    *    'weight' : '', 字体粗细
    *    'style'  : '', 字体斜体
    *    'color'  : '', 字体颜色
    *    'content': ''  文本内容
    * }
     */
        .directive('showTextarea', function ($state, $rootScope, $timeout, $compile) {
            return {
                restrict: 'E',
                replace: true,
                require: '?ngModel',
                scope: {},
                template: '<div class="panel panel-default">' +
                '    <div class="panel-heading" ng-class="{\'hide\':disabled}" >' +
                '        <select ng-options="opts.id as opts.val for opts in FontOpts.size" ng-change="selectOpts()" ng-model="Update.font_size" style="width:100px;margin-left:10px;">' +
                '            <option value="" disabled="false">大小</option>' +
                '        </select>' +
                '        <input type="color" ng-model="Update.font_color" ng-change="selectOpts()" style="width:70px;margin-left:10px;border-radius:5px;">' +
                '        <select ng-options="opts.id as opts.val for opts in FontOpts.align" ng-change="selectOpts()" ng-model="Update.font_align" style="width:70px;margin-left:10px;">' +
                '            <option value="" disabled="false">对齐</option>' +
                '        </select>' +
                '        <select ng-options="opts.id as opts.val for opts in FontOpts.bold" ng-change="selectOpts()" ng-model="Update.font_bold" style="width:70px;margin-left:10px;">' +
                '            <option value="" disabled="false">粗细</option>' +
                '        </select>' +
                '        <select ng-options="opts.id as opts.val for opts in FontOpts.ita" ng-change="selectOpts()" ng-model="Update.font_ita" style="width:70px;margin-left:10px;">' +
                '            <option value="" disabled="false">斜体</option>' +
                '        </select>' +
                '    </div>' +
                '    <div class="panel-body">' +
                '        <textarea class="form-control" rows="5" disabled-role="\'{{disabledRole}}\'" contentEditable=true style="height:auto;" ng-model="Update.content" ng-style="FontStyle" placeholder="{{Attrs.placeholder}}"></textarea>' +
                '    </div>' +
                '</div>',
                link: function ($scope, $element, $attrs, ngModel) {
                    $timeout(function () {
                        // console.log($scope, $attrs);
                        $scope.disabled = ($attrs.disabled ? true : false);
                        $scope.disabledRole = $attrs.disabledRole || '';
                    }, 0);
                    if (!ngModel) return;
                    ngModel.$render = function () {
                        $scope.Update = angular.extend({}, ngModel.$viewValue || {
                                'font_size': '',
                                'font_align': '',
                                'font_bold': '',
                                'font_style': '',
                                'font_color': '',
                                'font_ita': '',
                                'content': ''
                            });
                        $scope.selectOpts();
                    };

                    // 设置基础输出
                    $scope.Attrs = {
                        placeholder: $attrs.placeholder || ''
                    };

                    // 界面配置
                    $scope.FontOpts = {
                        size: [
                            {id: 'large', val: 'large'},
                            {id: 'medium', val: 'medium'},
                            {id: 'small', val: 'small'}
                        ],
                        align: [
                            {id: '1', val: 'left'},
                            {id: '2', val: 'center'},
                            {id: '3', val: 'right'}
                        ],
                        bold: [
                            {id: '1', val: 'bolder'},
                            {id: '0', val: 'normal'}
                        ],
                        ita: [
                            {id: '1', val: 'italic'},
                            {id: '0', val: 'normal'}
                        ]
                    };
                    $scope.obj_id2val = function (obj, id) {
                        var rtn = '';
                        angular.forEach(obj, function (v, k) {
                            if (v.id == id) {
                                rtn = v.val;
                            }
                        });
                        return rtn;
                    }
                    // 数据change
                    $scope.selectOpts = function () {
                        $scope.FontStyle = {
                            'font-size': $scope.obj_id2val($scope.FontOpts.size, $scope.Update.font_size) || '',
                            'text-align': $scope.obj_id2val($scope.FontOpts.align, $scope.Update.font_align) || '',
                            'font-weight': $scope.obj_id2val($scope.FontOpts.bold, $scope.Update.font_bold) || '',
                            'font-style': $scope.obj_id2val($scope.FontOpts.ita, $scope.Update.font_ita) || '',
                            'color': $scope.Update.font_color || ''
                            //'text-align': $scope.Update.font_align || '',
                            //'font-weight': $scope.Update.font_bold || '',
                            //'font-style': $scope.Update.font_style || '',
                            //'color': $scope.Update.font_color || ''
                        };

                        ngModel.$setViewValue($scope.Update);
                    };
                }
            };
        })


        /** 图片上传组件模块
         * <show-upload images="data" hasImages="true/false" max="9"></show-upload>
         * 返回的格式就是$scope.uploader.queue里的所有字段
         * @attrs:
         *   images: 绑定的图片数组对象
         *   nax: 容许最大上传数目，默认为9
         *   hasImages: 这个是拿取老数据必须填的true/false;
         *
         * @reponse/@request:
         * images: [{
    *   url:
    *   width:
    *   height:
    * }]
         */
        .directive('showUpload', function ($state, $rootScope, $timeout, FileUploader, $templateCache, $parse, widget) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    images: '=',
                    required: '@',
                },
                template: $templateCache.get('app/' + simpleCons.DIRECTIVE_PATH + 'upload/showUpload.html'),
                controller: function ($scope, $element, $attrs) {
                    $timeout(function () {
                        $scope.disabled = ($attrs.disabled ? true : false);
                        $scope.disabledRole = $attrs.disabledRole || '';
                        // console.log($scope, $attrs.disabledRole);
                        // console.log($scope, $attrs, $scope.disabled);
                    }, 0);
                    $scope.uploader = new FileUploader({
                        url: simpleCons.qiniu_domain + '/qiniu/controller.php?action=uploadimage'
                    });
                    var init = false;
                    $scope.$watch('images', function (imagesVal) {
                        $scope.max = $attrs.max || 100;
                        // console.log('images1111', imagesVal, init, $scope.uploader.queue);
                        if (imagesVal && (imagesVal.length > 0 ) && !init && $scope.uploader.queue.length == 0) {
                            init = true;
                            if ($scope.images && $scope.images.length > 0) {
                                angular.forEach($scope.images, function (v, k) {
                                    $scope.uploader.queue.push({
                                        pic_id: v.pic_id || undefined,
                                        url: v.pic_url || v.url || '',
                                        width: v.pic_width || v.width || 100,
                                        height: v.pic_height || v.height || 100,
                                        size: v.pic_size || v.size || 1,
                                        updated_at: v.updated_at || undefined,
                                        old: true,
                                        progress: 100,
                                        isUploaded: true,
                                    });
                                });
                            }
                        }
                    }, true);

                    // 删除历史数据
                    $scope.removeImage = function (key) {
                        $scope.uploader.queue.splice(key, 1);
                        updateImages();
                    };
                    // 上传成功
                    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                        // console.log(fileItem, response);
                        if (response) {
                            if (response.code == 1001) {
                                // console.log(1, response);
                                alert(response.msg);
                                fileItem.qiniu_url = '';
                                fileItem.isReady = false;
                                fileItem.isError = true;
                                fileItem.isUploaded = true;
                                fileItem.isSuccess = false;
                                updateImages();
                                // return false;
                            } else if (!response.url || response.state == 'ERROR') {
                                // console.log(2, response);
                                fileItem.qiniu_url = '';
                                fileItem.isReady = false;
                                fileItem.isError = true;
                                fileItem.isUploaded = true;
                                fileItem.isSuccess = false;
                                // return false;
                                updateImages();
                            } else {
                                // console.log(3, response);
                                fileItem.qiniu_url = response.url;
                                fileItem.width = response.width;
                                fileItem.height = response.height;
                                // fileItem.size = response.size;
                                //console.log(fileItem);

                                //console.log('success', $scope.uploader);
                                updateImages();
                            }
                        }
                    };

                    // FILTERS
                    $scope.uploader.filters.push({
                        name: 'imageFilter',
                        fn: function (item /*{File|FileLikeObject}*/, options) {
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                        }
                    });

                    $scope.uploader.filters.push({
                        name: 'customFilter',
                        fn: function (item /*{File|FileLikeObject}*/, options) {
                            var len = ($scope.images && $scope.images != 'undefined') ? $scope.images.length : 0;
                            return this.queue.length < $scope.max - len;
                        }
                    });

                    $scope.uploader.onAfterAddingAll = function (fileItems) {
                        angular.forEach(fileItems, function (v, k) {
                            $scope.images.push({});
                        });
                        $timeout(function () {
                            updateImages();
                        }, 0);
                    };
                    $scope.log = function () {
                        updateImages();
                        widget.msgToast('确认排序成功')
                        console.log($scope.uploader.queue);
                    }
                    // 全部取消
                    $scope.removeAll = function () {
                        // $scope.uploader.clearQueue();
                        if (!confirm('确定全部移除吗?')) {
                            return false;
                        }
                        $scope.images = [];
                        $scope.uploader.queue = [];
                    }
                    // $scope.uploader.clearAll = function () {
                    //     $scope.images = [];
                    //     $scope.uploader.queue = [];
                    //     $scope.uploader.progress = 0;
                    // };


                    // 移除上传的数据
                    $scope.delImage = function (key, obj) {
                        if (!confirm('确定移除?')) {
                            return false;
                        }
                        if (obj.updated_at) {
                            $scope.uploader.queue.splice(key, 1);
                        } else {
                            obj.remove();
                        }
                        // console.log(obj);
                        updateImages();
                    };


                    function updateImages() {
                        // 重新填充 images 对象
                        init = true;
                        $scope.images = [];
                        angular.forEach($scope.uploader.queue, function (v, k) {
                            // console.log(v.url);
                            if (v.updated_at) {
                                $scope.images.push({
                                    // pic_id: v.pic_id || undefined,
                                    // old: v.old || undefined,
                                    updated_at: v.updated_at || undefined,
                                    pic_url: v.url,
                                    pic_width: v.width,
                                    pic_height: v.height,
                                    // pic_size: v.size
                                });
                            } else {
                                $scope.images.push({
                                    pic_url: v.qiniu_url,
                                    pic_width: v.width,
                                    pic_height: v.height,
                                    // pic_size: v.size
                                });
                            }
                        });
                    }

                    $scope.getEle = function (eleKey) {
                        $scope.eleKey = eleKey;
                        // console.log($scope.eleKey,$scope.posIndex,$scope);
                        if (angular.isNumber($scope.eleKey) && angular.isNumber($scope.posIndex)) {
                            var a = $scope.eleKey < $scope.posIndex ? $scope.eleKey : ($scope.eleKey - 1);
                            var b = $scope.eleKey > $scope.posIndex ? $scope.posIndex : ($scope.posIndex - 1);
                            console.log($scope.eleKey + ' 插入到位置 ' + $scope.posIndex + '  ', a, b, $scope.uploader.queue);
                            var eleKeyObj = new Object($scope.uploader.queue[a]);
                            var posIndexObj = new Object($scope.uploader.queue[b]);
                            $scope.uploader.queue.splice(a, 1, posIndexObj);
                            $scope.uploader.queue.splice(b, 1, eleKeyObj);
                            // console.log($scope.uploader.queue);
                        }
                        updateImages();

                    }
                    $scope.getPos = function (posIndex) {
                        $scope.posIndex = posIndex;
                    }
                }
            };
        })
        .directive('showUploadToken', function ($state, $rootScope, $timeout, FileUploader, $templateCache, $parse, widget) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    images: '=',
                    required: '@',
                    token: '@',
                },
                template: $templateCache.get('app/' + simpleCons.DIRECTIVE_PATH + 'upload/showUpload.html'),
                controller: function ($scope, $element, $attrs) {
                    $timeout(function () {
                        $scope.disabled = ($attrs.disabled ? true : false);
                        $scope.disabledRole = $attrs.disabledRole || '';
                        // console.log($scope, $attrs.disabledRole);
                        // console.log($scope, $attrs, $scope.disabled);
                    }, 0);
                    $scope.uploader = new FileUploader({
                        // url: simpleCons.qiniu_domain + '/qiniu/controller.php?action=uploadimage'
                        url: 'https://up.qbox.me/'
                    });
                    var init = false;
                    $scope.$watch('images', function (imagesVal) {
                        $scope.max = $attrs.max || 100;
                        // console.log('images1111', imagesVal, init, $scope.uploader.queue);
                        if (imagesVal && (imagesVal.length > 0 ) && !init && $scope.uploader.queue.length == 0) {
                            init = true;
                            if ($scope.images && $scope.images.length > 0) {
                                angular.forEach($scope.images, function (v, k) {
                                    $scope.uploader.queue.push({
                                        pic_id: v.pic_id || undefined,
                                        url: v.pic_url || v.url || '',
                                        width: v.pic_width || v.width || 100,
                                        height: v.pic_height || v.height || 100,
                                        size: v.pic_size || v.size || 1,
                                        updated_at: v.updated_at || undefined,
                                        old: true,
                                        progress: 100,
                                        isUploaded: true,
                                    });
                                });
                            }
                        }
                    }, true);

                    // 删除历史数据
                    $scope.removeImage = function (key) {
                        $scope.uploader.queue.splice(key, 1);
                        updateImages();
                    };
                    //选择文件之后
                    $scope.uploader.onAfterAddingFile = function (fileItem) {
                        // $scope.uploader.onBeforeUploadItem = function (fileItem) {
                        // console.log('onAfterAddingFile', fileItem);
                        var fileItemTmpl = {name: fileItem._file.name, type: $scope.token};
                        widget.ajaxRequest({
                            url: '/supports/uptoken',
                            method: 'get',
                            scope: $scope,
                            data: fileItemTmpl,
                            success: function (json) {
                                // console.log(json);
                                // console.log(form, item.formData);
                                fileItem.formData.push({key: json.data.key, token: json.data.token});
                            }
                        })
                    }
                    // 上传成功
                    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                        // console.log(fileItem, response);
                        if (response) {
                            if (response.code == 1001) {
                                // console.log(1, response);
                                alert(response.msg);
                                fileItem.qiniu_url = '';
                                fileItem.isReady = false;
                                fileItem.isError = true;
                                fileItem.isUploaded = true;
                                fileItem.isSuccess = false;
                                updateImages();
                                // return false;
                            } else if (!response.url || response.state == 'ERROR') {
                                // console.log(2, response);
                                fileItem.qiniu_url = '';
                                fileItem.isReady = false;
                                fileItem.isError = true;
                                fileItem.isUploaded = true;
                                fileItem.isSuccess = false;
                                // return false;
                                updateImages();
                            } else {
                                // console.log(3, response);
                                fileItem.qiniu_url = response.url;
                                fileItem.width = response.width;
                                fileItem.height = response.height;
                                // fileItem.size = response.size;
                                //console.log(fileItem);

                                //console.log('success', $scope.uploader);
                                updateImages();
                            }
                        }
                    };

                    // FILTERS
                    $scope.uploader.filters.push({
                        name: 'imageFilter',
                        fn: function (item /*{File|FileLikeObject}*/, options) {
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                        }
                    });

                    $scope.uploader.filters.push({
                        name: 'customFilter',
                        fn: function (item /*{File|FileLikeObject}*/, options) {
                            var len = ($scope.images && $scope.images != 'undefined') ? $scope.images.length : 0;
                            return this.queue.length < $scope.max - len;
                        }
                    });

                    $scope.uploader.onAfterAddingAll = function (fileItems) {
                        $scope.images = $scope.images || [];
                        angular.forEach(fileItems, function (v, k) {
                            $scope.images.push({});
                        });
                        $timeout(function () {
                            updateImages();
                        }, 0);
                    };
                    $scope.log = function () {
                        updateImages();
                        widget.msgToast('确认排序成功')
                        console.log($scope.uploader.queue);
                    }
                    // 全部取消
                    $scope.removeAll = function () {
                        // $scope.uploader.clearQueue();
                        if (!confirm('确定全部移除吗?')) {
                            return false;
                        }
                        $scope.images = [];
                        $scope.uploader.queue = [];
                    }
                    // $scope.uploader.clearAll = function () {
                    //     $scope.images = [];
                    //     $scope.uploader.queue = [];
                    //     $scope.uploader.progress = 0;
                    // };


                    // 移除上传的数据
                    $scope.delImage = function (key, obj) {
                        if (!confirm('确定移除?')) {
                            return false;
                        }
                        if (obj.updated_at || obj.pic_id) {
                            $scope.uploader.queue.splice(key, 1);
                        } else {
                            obj.remove();
                        }
                        // console.log(obj);
                        updateImages();
                    };


                    function updateImages() {
                        // 重新填充 images 对象
                        init = true;
                        $scope.images = [];
                        angular.forEach($scope.uploader.queue, function (v, k) {
                            if (v.updated_at || v.pic_id) {
                                $scope.images.push({
                                    pic_id: v.pic_id || undefined,
                                    updated_at: v.updated_at || undefined,
                                    pic_url: v.url,
                                    pic_width: v.width,
                                    pic_height: v.height,
                                });
                            } else {
                                $scope.images.push({
                                    pic_url: v.qiniu_url,
                                    pic_width: v.width,
                                    pic_height: v.height,
                                });
                            }
                        });
                    }

                    $scope.getEle = function (eleKey) {
                        $scope.eleKey = eleKey;
                        // console.log($scope.eleKey,$scope.posIndex);
                        if (angular.isNumber($scope.eleKey) && angular.isNumber($scope.posIndex)) {
                            var a = $scope.eleKey < $scope.posIndex ? $scope.eleKey : ($scope.eleKey - 1);
                            var b = $scope.eleKey > $scope.posIndex ? $scope.posIndex : ($scope.posIndex - 1);
                            console.log($scope.eleKey + ' 插入到位置 ' + $scope.posIndex + '  ', a, b, $scope.uploader.queue);
                            var eleKeyObj = new Object($scope.uploader.queue[a]);//
                            var posIndexObj = new Object($scope.uploader.queue[b]);//
                            if ($scope.eleKey > $scope.posIndex) {
                                $scope.uploader.queue.splice(b, 0, eleKeyObj);
                                $scope.uploader.queue.splice(a + 1, 1);
                            } else if ($scope.eleKey < $scope.posIndex) {
                                $scope.uploader.queue.splice(b + 1, 0, eleKeyObj);
                                $scope.uploader.queue.splice(a, 1);
                            }
                            // console.log($scope.uploader.queue);
                        }
                        updateImages();

                    }
                    $scope.getPos = function (posIndex) {
                        $scope.posIndex = posIndex;
                    }
                }
            };
        })
});
