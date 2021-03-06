// This is a file copied by your subgenerator
/**
 * 默认的产品首页和默认的跳转规则
 */
define([
        '../states'
        , '../../cons/simpleCons'
    ],
    function (stateModule, cons) {
        stateModule.config(
            ['$stateProvider', '$urlRouterProvider',
                function ($stateProvider, $urlRouterProvider) {
                    $stateProvider
                        .state(cons.state.main + '.groupbuy', {
                            url: "/groupbuy",
                            templateProvider: function ($templateCache) {
                                return $templateCache.get('app/' + cons.main_path + 'container.html');
                            }
                        })
                        .state(cons.state.main + '.groupbuy.list', {
                            url: "/list.html",
                            views: {
                                "": {
                                    // controller: 'pintuanController'
                                    templateProvider: function ($templateCache) {
                                        return $templateCache.get('app/' + cons.biz_path + 'groupbuy/list.html');
                                    }
                                }
                            }
                        })
                        .state(cons.state.main + '.groupbuy.update', {
                            url: "/update.html/:activity_id",
                            views: {
                                "": {
                                    // controller: "pintuan.updateController",
                                    templateProvider: function ($templateCache) {
                                        return $templateCache.get('app/' + cons.biz_path + 'groupbuy/update.html');
                                    }
                                }
                            }
                        })
                }
            ])
        ;
    })
