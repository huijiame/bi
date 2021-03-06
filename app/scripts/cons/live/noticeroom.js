define(['.././common'], function (common) {
    var rtn = {
        noticeroomList: {
            columns: [
                {name: 'ID', field: 'id', className: 'text-right'},
                {name: '房间ID', field: 'room_id', className: 'text-center'},
                {name: '房间号', field: 'room.room_no', className: 'text-center'},
                {name: '房间名称', field: 'room.title', className: 'text-center'},
                {name: '发送时间', field: 'created_at|null2empty', className: 'text-center'},
                {name: '过期时间', field: 'expire_time|null2empty', className: 'text-center'},
            ],
            config: {
                title: '公告房间',
                api: '',
                rowItemName: 'item',
                searchSupport: false,
                searchItems: [
                    // {text: '(领取时间)--开始', value: 'start_time', type: 'datetime'},
                    // {text: '(领取时间)--结束', value: 'end_time', type: 'datetime'},
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
                ext: {
                    showNum: [
                        {text: '总数', type: 'total'},
                    ],
                }
            },
        }
    }
    return rtn;
});