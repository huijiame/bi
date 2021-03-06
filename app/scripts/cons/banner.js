define([], function () {
    var rtn = {
        bannerList: {
            columns: [
                {name: 'ID', field: 'banner_id', className: 'text-center'},
                {
                    name: '标题', field: 'title', truncateText: true,
                    truncateTextLength: 7,
                    truncateTextBreakOnWord: false,
                    tooltipPlacement: 'bottom',
                    tooltip: 'title',
                },
                {name: '当前排序', field: 'sort_num'},
                {name: '缩略图', fieldDirective: '<show_image url="item.pic_url" width="100"></show_image>'},
                {
                    name: 'URL', field: 'url',
                    truncateText: true,
                    truncateTextLength: 10,
                    truncateTextBreakOnWord: false,
                    tooltipPlacement: 'bottom',
                    tooltip: 'url',
                },
                // {
                //     name: '备注', field: 'remark',
                //     truncateText: true,
                //     truncateTextLength: 10,
                //     truncateTextBreakOnWord: false,
                //     tooltipPlacement: 'bottom',
                //     tooltip: 'remark',
                // },
                {name: '当前状态', field: 'status', filter: 'banner_status'},
                {
                    name: '展示时间',
                    fieldDirective: '<p ng-bind="((item.start_time || \'\')+(item.end_time || \'\')) |characters:6:true" ' +
                    'tooltip-placement="bottom" uib-tooltip="上线时间: {{item.start_time}} 下线时间: {{item.end_time}}">'
                },
                {
                    name: '创建时间', field: 'created_at', truncateText: true,
                    truncateTextLength: 10,
                    truncateTextBreakOnWord: false,
                    tooltip: 'created_at',
                    tooltipPlacement: 'bottom',

                },
                {
                    name: '操作',
                    fieldDirective: '<div banner-update data="item"></div>' +
                    '<div banner-change-status data="item"></div>'
                },
            ],
            config: {
                title: '运营位列表',
                api: '/banners',
                rowItemName: 'item',
                searchSupport: true,
                searchItems: [
                    {// 1 城市首页
                        value: 'category', text: '类型', type: 'btnGroup', default: '1', width: '6',
                        enum: [
                            {value: '1', text: '城市首页'},
                            {value: '', text: '全部类型'},
                        ]
                    },
                    {   // status 1 上线 2 下线
                        // available_type 1 有效期内 2 尚未开始	3 已经过期 4 有效期外
                        value: 'flag1',
                        text: '状态',
                        type: 'btnGroupArray',
                        default: 1, //有enum_text时 enumde index 的值
                        width: '6',
                        enum_text: ['status', 'available_type'],//  有  enum_text 说明是数组
                        enum: [
                            {value: ['', ''], text: '全部'},
                            {value: ['1', '1'], text: '正在进行'},
                            {value: ['2', ''], text: '已下线'},
                            {value: ['1', '2'], text: '待上线'},
                        ]
                    },
                    // {value: 'banner_id', text: '运营位ID'},
                    {value: 'keyword', text: '关键字', placeholder: '标题,URL,备注'},
                ],
                preSelectionSearch: {
                    // status: '0',
                },
                paginationSupport: true,
                pageInfo: {
                    count: 20,
                    page: 1,
                    maxSize: 2, //最大展示页，默认3
                    // showPageGoto: false //属性为true将显示前往第几页。
                },
                route: [{value: 'main.banner.add', text: '新增运营位'}]
            }
        }
    }
    return rtn;
});