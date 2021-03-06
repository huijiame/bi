// This is a file copied by your subgenerator
/**
 * 默认的产品首页和默认的跳转规则
 */
define([
        '../../states'
        , '../../../cons/simpleCons'
        , '../../../controllers/biz/answersController'
    ],
    function (stateModule, cons) {
        stateModule.config(
            ['$stateProvider', '$urlRouterProvider',
                function ($stateProvider, $urlRouterProvider) {
                    $stateProvider
                        .state(cons.state.main + '.answers', {
                            url: "/answers",
                            templateProvider: function ($templateCache) {
                                return $templateCache.get('app/' + cons.main_path + 'container.html');
                            }
                        })
                        .state(cons.state.main + '.answers.list', {
                            url: "/list",
                            views: {
                                "": {
                                    controller: 'answers.answersController',
                                    templateProvider: function ($templateCache) {
                                        return $templateCache.get('app/' + cons.live_path + 'answers/answers.html');
                                    },
                                    resolve: {
                                        question: function () {
                                            return '';
                                        }
                                    },
                                }
                            }
                        })
                    // .state(cons.state.main + '.answers.list', {
                    //     url: "/list",
                    //     views: {
                    //         "": {
                    //             templateProvider: function ($templateCache) {
                    //                 return '<div hjm-grid modid="answersList" config="config" columns="columns"></div>';
                    //             }
                    //         }
                    //     }
                    // })
                    // .state(cons.state.main + '.answers.add', {
                    //     url: "/add.html",
                    //     views: {
                    //         "": {
                    //             controller: 'answers.updateController',
                    //             templateProvider: function ($templateCache) {
                    //                 return $templateCache.get('app/' + cons.biz_path + 'answers/update.html');
                    //             }
                    //         }
                    //     }
                    // })
                    // .state(cons.state.main + '.answers.update', {
                    //     url: "/update.html/:id",
                    //     views: {
                    //         "": {
                    //             controller: 'answers.updateController',
                    //             templateProvider: function ($templateCache) {
                    //                 return $templateCache.get('app/' + cons.biz_path + 'answers/update.html');
                    //             }
                    //         }
                    //     }
                    // })
                }
            ]);
    })
