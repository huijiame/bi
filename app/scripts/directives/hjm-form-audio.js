define([
    '../directives/directives',
    '../cons/simpleCons',
], function(mod, cons) {

    mod
        .directive('formAudio', function($rootScope, $state, $http, $filter, $templateCache, $compile, widget, $log, $timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: $templateCache.get('app/' + cons.DIRECTIVE_PATH + 'hjm/hjm-form-element.html'),
                scope: {
                    ngModel: '=ngModel',
                    ngModelText: '@ngModel',
                    text: '@',
                    name: '@',
                    required: '@',
                    max: '@',
                    callback: '&',
                    token: '@',
                    hideBar: '=',
                },
                link: function($scope, $element, $attrs, $ctrl) {
                    var name = $scope.name ? (' name="' + $scope.name + '"') : (' name="' + $scope.ngModelText + '"');
                    var required = $scope.required ? (' required ') : '';
                    var required_span = $scope.required ? ('<span class="form_label_danger">*</span>') : '&nbsp;&nbsp;';
                    var max = $scope.max ? (' max="' + $scope.max + '"') : '';
                    var token = $scope.token ? (' token="' + $scope.token + '"') : (' token="resource"');

                    $timeout(function() {
                        var disabledRole = ($scope.$parent && $scope.$parent.disabledRole) ?
                            (' disabled-role="' + $scope.$parent.disabledRole + '"') : '';
                        var uploadHtml =
                            // $scope.token ?
                            '<show-upload-audio-token audio="ngModel" hide-bar="hideBar"  ' + name + max + required + disabledRole + token + '></show-upload-audio-token>';
                        var content = '<label class="col-sm-2 control-label">' + $scope.text + required_span + '</label>' +
                            '<div class="col-sm-8" style="">' + uploadHtml +
                            '<input class="hide" ng-model="ngModel" ' + max + name + disabledRole + ' ng-minlength="' + ($scope.required ? 1 : 0) + '">' +
                            '</div>';
                        // content += '===={{$parent.form["' + ($scope.name || $scope.ngModelText) + '"]}}===='
                        $element.find('.form_element').html(content);
                        $compile($element.contents())($scope);
                        // console.log($scope.$parent.FormBody[$scope.ngModelText]);
                        if ($scope.$parent.FormBody && $scope.$parent.FormBody[$scope.ngModelText]) {
                            $scope.$parent.FormBody[$scope.ngModelText].text = $scope.text || $scope.ngModelText;
                        }
                    }, 0);
                },
            };
        })
        .directive('formAudioSingle', function($rootScope, $state, $http, $filter, $templateCache, $compile, widget, $log, $timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: $templateCache.get('app/' + cons.DIRECTIVE_PATH + 'hjm/hjm-form-element.html'),
                scope: {
                    ngModel: '=ngModel',
                    ngModelText: '@ngModel',
                    text: '@',
                    name: '@',
                    required: '@',
                    max: '@',
                    callback: '&',
                    token: '@',
                    noLabel: '@',// 没有label
                    // hideBar: '=',
                },
                link: function($scope, $element, $attrs, $ctrl) {
                    var name = $scope.name ? (' name="' + $scope.name + '"') : (' name="' + $scope.ngModelText + '"');
                    var required = $scope.required ? (' required ') : '';
                    var required_span = $scope.required ? ('<span class="form_label_danger">*</span>') : '&nbsp;&nbsp;';
                    var max = $scope.max ? (' max="' + $scope.max + '"') : '';
                    var token = $scope.token ? (' token="' + $scope.token + '"') : (' token="resource"');

                    scope.tmpNgModel = [];
                    $scope.$watch('ngModel', function(url) {
                        if (!!url) {
                            $scope.tmpNgModel = [{pic_url: url, pic_width: 100, pic_hight: 100}];
                        } else {
                            $scope.tmpNgModel = [];
                        }
                    }, true);

                    $scope.$watch('tmpNgModel', function(arr_pic_val) {
                        if ($scope.tmpNgModel && $scope.tmpNgModel[0] && $scope.tmpNgModel[0].pic_url) {
                            $scope.ngModel = $scope.tmpNgModel[0].pic_url;
                        } else {
                            $scope.ngModel = null;
                        }

                    }, true);

                    $timeout(function() {
                        $scope.hideBar = [1, 1, 1, 1, 1];
                        var disabledRole = ($scope.$parent && $scope.$parent.disabledRole) ?
                            (' disabled-role="' + $scope.$parent.disabledRole + '"') : '';
                        var uploadHtml =
                            '<show-upload-audio-token audio="tmpNgModel" hide-bar="hideBar"  ' + name + max + required + disabledRole + token + '></show-upload-audio-token>';
                        var content = '';
                        if ($scope.noLabel) {
                            content = uploadHtml + '<input class="hide" ng-model="tmpNgModel" ' + max + name + disabledRole + required + '></div>';
                        } else {
                            content = '<label class="col-sm-2 control-label">' + $scope.text + required_span + '</label>' +
                                '<div class="col-sm-8" style="">' + uploadHtml +
                                '<input class="hide" ng-model="tmpNgModel" ' + max + name + disabledRole + ' ng-minlength="' + ($scope.required ? 1 : 0) + '">' +
                                '</div>';
                        }
                        // content += '===={{$parent.form["' + ($scope.name || $scope.ngModelText) + '"]}}===='
                        $element.find('.form_element').html(content);
                        $compile($element.contents())($scope);
                        // console.log($scope.$parent.FormBody[$scope.ngModelText]);
                        if ($scope.$parent.FormBody && $scope.$parent.FormBody[$scope.ngModelText]) {
                            $scope.$parent.FormBody[$scope.ngModelText].text = $scope.text || $scope.ngModelText;
                        }
                    }, 0);
                },
            };
        });

});
