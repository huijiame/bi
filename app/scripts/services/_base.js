define(['./services', '../cons/simpleCons', './widget', './comfunc'], function (mod, cons) {
    mod
        .run(['$rootScope', '$state', '$stateParams', '$http', '$modal', '$location', 'widget',
            function ($rootScope, $state, $stateParams, $http, $modal, $location, widget) {
                
                // $compileProvider.debugInfoEnabled(true);
                // 监听路由事件
                // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                // console.log(event, toState, toParams, fromState, fromParams);
                // 路由改变 初始化 search
                //初始化每次的 公共查询方法
                // $rootScope.searchkeyword = angular.noop();
                // $rootScope.current_state = $state.current.name;
                // console.log($rootScope.current_state);
                // console.log($state);
                // console.log($rootScope.hjm.menus);
                // console.log($state.current.name);
                // console.log($rootScope.mainmenu);
                // });
                //活动公共数据
                // 获取公共数据 初始化
                $rootScope.nowlogintimestamp = new Date().getTime();
                $rootScope.lastlogintimestamp = JSON.parse(localStorage.getItem('lastlogintimestamp')) || 0;
                if (parseInt(($rootScope.nowlogintimestamp - $rootScope.lastlogintimestamp) / (1000 * 60 * 60 * 24)) > 1) {
                    //超过一天就更新
                    $rootScope.lastlogintimestamp = JSON.parse($rootScope.nowlogintimestamp);
                    localStorage.removeItem('hjm');
                    // console.log($state);
                    // if($state.current.name!=='login'){
                    //     $state.go('login');
                    // }
                } else {
                    $rootScope.hjm = JSON.parse(localStorage.getItem('hjm'));
                    // $rootScope.selected = angular.copy($rootScope.hjm);
                    // $rootScope.selected.account_id = '';
                    $rootScope.current_city_name = $rootScope.hjm.current_city_name == '' ? '' : $rootScope.hjm.current_city_name;
                    $http.defaults.headers.common.Authorization = $rootScope.hjm.Authorization || '';
                }
                $rootScope.getaccount_times = 0;
                // 获取account_list
                $rootScope.get_account_list = function () {
                    if ($rootScope.hjm && $rootScope.hjm.Authorization) {
                        widget.ajaxRequest({
                            url: cons.api.account_mans,
                            method: 'GET',
                            data: {count: 1000, role: 'op,majia'},
                            success: function (json) {
                                json.data.unshift({
                                    account_id: "",
                                    city_name: "",
                                    email: "",
                                    mobile: "",
                                    role: "op",
                                    username: "全部联系人"
                                })
                                $rootScope.account_list = json.data;
                                angular.forEach($rootScope.account_list, function (val, key) {
                                    $rootScope.account_list[key].account_id += '';
                                });
                            },
                            failure: function () {
                                widget.msgToast('没有获取到公共数据');
                            }
                        })
                    }
                }
                // $rootScope.get_account_list();
            }
        ])

});
