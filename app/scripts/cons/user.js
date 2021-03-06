define([], function() {
    var rtn = {
        userList: {
            columns: [
                {name: 'ID', field: 'user_id', className: 'text-center'},
                {name: '头像', fieldDirective: '<show_image url="item.avatar" width="100"></show_image>'},
                {name: '微信昵称', field: 'name', filter: 'null2empty'},
                {name: '性别', field: 'gender', filter: 'gender'},
                {name: '手机号', fieldDirective: ' <span ng-bind="item.mobile"></span>'},
                {
                    name: '获取验证码',
                    fieldDirective: '<div user-captcha data="item"></div>',
                },
                {name: '关联订单', fieldDirective: '<div user-order data="item"></div>'},
                {name: '收货地址', fieldDirective: '<div user-address data="item"></div>'},
                {name: '优惠券', fieldDirective: '<div user-coupon data="item"></div>'},
                // {name: '优惠券', field: 'coupon.count'},
                {
                    name: '时间', fieldDirective: '<span ng-bind="\'用户注册:\'+item.created_at" ng-if="item.created_at"></span><br> ' +
                    ' <span ng-bind="\'最后使用:\'+item.authed_at" ng-if="item.authed_at"></span><br>' +
                    ' <span ng-bind="\'禁言到期:\'+item.imblocktime" ng-if="item.imblocktime"></span>',
                },
                // {name: '直播禁言', fieldDirective: '<div user-block data="item"></div>'},
                {
                    name: '直播禁言管理',
                    fieldDirective: '<span user-live-block data="item"></span>',
                },
                // {
                //     name: '模拟登陆',
                //     fieldDirective: '<div user-token data="item"></div>',
                // },
                {
                    name: '绑定与解绑手机号',
                    fieldDirective: '<div user-mobile-unbind data="item"></div>',
                },
            ],
            columns_by_read: [
                {name: 'ID', field: 'user_id', className: 'text-center'},
                {name: '头像', fieldDirective: '<show_image url="item.avatar" width="100"></show_image>'},
                {name: '微信昵称', field: 'name', filter: 'null2empty'},
                {name: '性别', field: 'gender', filter: 'gender'},
                {name: '手机号', field: 'mobile'},
                {name: '关联订单', fieldDirective: '<div user-order data="item"></div>'},
                {name: '收货地址', fieldDirective: '<div user-address data="item"></div>'},
                {name: '优惠券', fieldDirective: '<div user-coupon data="item"></div>'},
                {name: '注册时间', field: 'created_at'},
                {name: '最近一次使用时间', field: 'authed_at', filter: 'null2empty'},
                {name: '绑定与解绑手机号', fieldDirective: '<div user-mobile-unbind data="item"></div>'},
            ],
            config: {
                title: '用户列表',
                api: '/users',
                rowItemName: 'item',
                searchSupport: true,
                searchItems: [
                    {value: 'mobile', text: '手机号码'},
                    {value: 'name', text: '微信昵称'},
                    {value: 'user_id', text: '用户ID'},
                    {value: 'openid', text: '微信ID'},
                    // {value: 'authed_at', text: '登陆日期', type: 'date'},
                    // {value: 'datetime_min', text: '开始时间', type: 'datetime'},
                    // {value: 'datetime_max', text: '结束时间', type: 'datetime'},
                ],
                preSelectionSearch: {
                    // ID: '123',
                },
                paginationSupport: true,
                pageInfo: {
                    count: 50,
                    page: 1,
                    maxSize: 2, //最大展示页，默认3
                    // showPageGoto: false //属性为true将显示前往第几页。
                },
                route: [{routeDirective: '<div user-captcha data="{mobile:undefined}"></div>'}],
                ext: {
                    showNum: [
                        {text: '总数', type: 'total'},
                    ],
                },
            },
        },
        vipUserList: {
            columns: [
                {name: '会员编号', field: 'vip_number'},
                {name: 'ID', field: 'user_id', className: 'text-center'},
                {name: '头像', fieldDirective: '<show_image url="item.avatar" width="100"></show_image>'},
                {name: '微信昵称', field: 'name'},
                {name: '性别', field: 'gender', filter: 'gender'},
                {name: '手机号', field: 'mobile'},
                {name: '关联订单', fieldDirective: '<div user-order data="item"></div>'},
                {name: '收货地址', fieldDirective: '<div user-address data="item"></div>'},
                {name: '优惠券', fieldDirective: '<div user-coupon data="item"></div>'},
                // {name: '优惠券', field: 'coupon.count'},
                // {name: '注册时间', field: 'created_at'},
                {
                    name: '会员期限',
                    fieldDirective: '开始:<span ng-bind="item.vip_start_time"></span>' +
                    '<br/>结束:<span ng-bind="item.vip_end_time"></span>' +
                    '<br/>最近一次登陆:<br/><span ng-bind="item.authed_at"></span>',
                },
                // {name: '最近一次使用时间', field: 'authed_at'},
                {name: '模拟登陆', fieldDirective: '<div user-token data="item"></div>'},
                {name: '会员', field: 'is_vip', filter: 'is_vip'},
                {name: '马甲', field: 'role_type', filter: 'keyVal:\'2\':\'马甲\':\'1\':\'\''},
                {name: '更新会员信息', fieldDirective: '<div vip-user-info-update data="item"></div>'},
            ],
            config: {
                title: 'VIP用户列表',
                api: '/users',
                rowItemName: 'item',
                searchSupport: true,
                searchItems: [
                    {value: 'mobile', text: '手机号码'},
                    {value: 'name', text: '微信昵称'},
                    {value: 'openid', text: '微信ID'},
                    {
                        value: 'role_type', text: '马甲', type: 'btnGroup', default: '', width: '6',
                        enum: [
                            {value: '', text: '全 部'},
                            {value: '2', text: '&nbsp;&nbsp;&nbsp;是&nbsp;&nbsp;&nbsp;'},
                            {value: '1', text: '&nbsp;&nbsp;&nbsp;否&nbsp;&nbsp;&nbsp;'},
                        ],
                    },
                    // {value: 'authed_at', text: '登陆日期', type: 'date'},
                    // {value: 'datetime_min', text: '开始时间', type: 'datetime'},
                    // {value: 'datetime_max', text: '结束时间', type: 'datetime'},
                ],
                preSelectionSearch: {
                    is_vip: [1, 3],
                    order_by: 'vip_start_time',
                    sort_asc: '1',
                },
                paginationSupport: true,
                pageInfo: {
                    count: 50,
                    page: 1,
                    maxSize: 2, //最大展示页，默认3
                    // showPageGoto: false //属性为true将显示前往第几页。
                },
                // route: [{value: 'product.add', text: '新增商品'}]
            },
        },
        customersList: {
            columns: [
                {name: 'ID', field: 'user_id', className: 'text-center'},
                {name: '头像', fieldDirective: '<show_image url="item.avatar" width="100"></show_image>'},
                {name: '头像', field: 'avatar', filter: 'null2empty'},
                {name: '微信昵称', field: 'name', filter: 'null2empty'},
                {name: '性别', field: 'gender', filter: 'gender'},
                {name: '手机号', field: 'mobile'},
                {name: '创建时间', field: 'created_at'},
            ],
            config: {
                title: '马甲列表',
                api: '/users/customers',
                rowItemName: 'item',
                searchSupport: false,
                searchItems: [
                    // {value: 'mobile', text: '手机号码'},
                    // {value: 'name', text: '微信昵称'},
                    // {value: 'openid', text: '微信ID'},
                    // {value: 'authed_at', text: '登陆日期', type: 'date'},
                    // {value: 'datetime_min', text: '开始时间', type: 'datetime'},
                    // {value: 'datetime_max', text: '结束时间', type: 'datetime'},
                ],
                preSelectionSearch: {
                    role_type: 2,
                },
                paginationSupport: true,
                pageInfo: {
                    count: 50,
                    page: 1,
                    maxSize: 5, //最大展示页，默认3
                    // showPageGoto: false //属性为true将显示前往第几页。
                },
                route: [{value: 'main.user.customersAdd', text: '新增马甲'},{routeDirective: '<div user-captcha data="{mobile:undefined}"></div>'}],
            },
        },
        userblockList: {
            columns: [
                {name: 'ID', field: 'user_id', className: 'text-center'},
                {name: '头像', fieldDirective: '<show_image url="item.user.avatar" width="100"></show_image>'},
                // {name: '头像', field: 'avatar', filter: 'null2empty'},
                {name: '微信昵称', field: 'user.name', filter: 'null2empty'},
                {name: '性别', field: 'user.gender', filter: 'gender'},
                {name: '手机号', field: 'user.mobile'},
                {
                    name: '禁言管理', className: 'text-center',
                    fieldDirective: '<span user-live-block data="item"></span>',
                },
            ],
            config: {
                title: '马甲列表',
                api: '/users/blockUsers',
                rowItemName: 'item',
                searchSupport: true,
                searchItems: [
                    {value: 'mobile', text: '手机号码'},
                    {value: 'name', text: '微信昵称'},
                    // {value: 'openid', text: '微信ID'},
                    // {value: 'authed_at', text: '登陆日期', type: 'date'},
                    // {value: 'datetime_min', text: '开始时间', type: 'datetime'},
                    // {value: 'datetime_max', text: '结束时间', type: 'datetime'},
                ],
                preSelectionSearch: {},
                paginationSupport: true,
                pageInfo: {
                    count: 50,
                    page: 1,
                    maxSize: 5, //最大展示页，默认3
                    // showPageGoto: false //属性为true将显示前往第几页。
                },
                route: [{value: 'main.user.customersAdd', text: '新增马甲'}],
            },
        },
    };
    return rtn;
});