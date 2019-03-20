var doActive = null;
var status = {
    add:['增加','提交'],
    delete:['删除','删除'],
    modify:['修改','更新'],
    search:['查询','查询'],
    detail:['详情','详情']
};
// 分页参数
var start = 1;
var size = 20;
var current = 1;
var pageNumber;
var totalSize;

$(function(){
    // 日期插件初始化
    zaneDate({
        elem:'#ctime',
        begintime:'',
        format:'yyyy-MM-dd HH:mm:ss',
        showtime:true
    });
    // 日期插件初始化
    zaneDate({
        elem:'#searchTime',
        format:'yyyy-MM-dd HH:mm:ss',
        type:'doubleday',
        begintime:'',
        endtime:'',
        showtime:true
    });
    // var data=[{key:'fan1',value:'value',description:'description'},{key:'fan2',value:'value',description:'description'}];
    // renderList(data);
    // refish();

    // 关闭弹窗
    $('.content .close').click(function(){
        $(".dialog").hide();
        $("input").removeClass("scan");
        $("select").removeClass("scan");
        $("textarea").removeClass("scan");
        $(".form-con .submit").show();
        $('input').attr('disabled',false);
        $("select").attr('disabled',false);
        $("textarea").attr('disabled',false);
    });

    // 实现增加操作
    $('.add').click(function(){
        doActive = 'add';
         // 弹出dialog回显数据
        $(".dialog").show();

        $(".form h3").text(status.add[0]);
        $(".form-con .submit").text(status.add[1]);
        $(".form-con input.addDisabled").attr('disabled',false);
        $(".form-con input[name=key]").val('');
        $(".form-con input[name=value]").val('');
        $(".form-con textarea").val('');
    });

    // 实现搜索操作
    $('.search').click(function(){
        current = 1;
        getCount();
    });

    // 实现修改操作
    $('.modify').click(function(){
        doActive = 'modify';
        var tr = $(this).closest('tr');//找到tr元素
        var value = tr.find('td:eq(0)').html();
        getEchoData(value);
    });

    // 查看详情操作
    $('.detail').click(function(){
        doActive = 'detail';
        var tr = $(this).closest('tr');//找到tr元素
        var value = tr.find('td:eq(0)').html();
        getEchoData(value);
    });

    // 实现删除操作
    $('.delete').click(function(){
        var tr = $(this).closest('tr');//找到tr元素
        var key = tr.find('td:eq(0)').html();//找到td元素
        deleteData(key);
    });

    // 添加数据或更新数据
    $(".submit").click(function(){
        if(doActive === "modify"){
            var id = $(".form-con input[name=id]").val();
            var content = $(".form-con textarea.contentValue").val();
            var status = $(".form-con select.status").val();
            var ctime = new Date($("#ctime").val()).getTime();
            $.ajax({
                url: URL+"/agent/uploadlog/update",
                type: "get",
                data: {
                    id: id,
                    content: content,
                    status: status,
                    ctime: ctime
                },
                dataType: "json",
                headers: {"Authorization": token},
                success: function(res) {
                    console.log(res.data);
                    if(res.code=== 200){
                            getCount();
                            $(".dialog").hide();
                    }else{
                        error(xhr)
                    }
                },
                error: function(xhr){
                    error(xhr)
                }
            })
        }

    })


    // 获取列表数据条数
    getCount();

});
    // 列表数据渲染
    function renderList(data){
        $('table>tbody').empty();
        for(var i=0;i<data.length;i++){
            data[i].status = data[i].status == 0 ? '上报失败':'上报成功';
            data[i].ctime = formatTime(new Date(data[i].ctime*1000), format = 'YYYY-MM-DD HH:mm:ss');
            var html =
                '<tr><td>'+data[i].id
                +'</td><td>'+data[i].taskId
                +'</td><td>'+data[i].content
                +'</td><td>'+data[i].status
                +'</td><td>'+data[i].recordCount
                +'</td><td>'+data[i].ctime
                +'</td><td>';
            var button = '<a href="javascript:void(0);" class="button button6 detail">详情</a><a href="javascript:void(0);" class="button button3 modify">修改</a></td></tr>';
            $('table>tbody').append(html+button);
        }
        addTitle();
    }

    // 获取回显数据
    function getEchoData(value){
        $.ajax({
            url: URL+"/agent/uploadlog/detail",
            type: "get",
            data: {id: value},
            dataType: "json",
            headers: {"Authorization": token},
            success: function(res) {
                if(res.code=== 200){
                    // 弹出dialog回显数据
                    if(doActive === "detail"){
                        $(".dialog").show();
                        $(".form h3").text(status.detail[0]);
                        $(".form-con .submit").hide();
                        $(".form-con input.addDisabled").attr('disabled',true);

                        $(".form-con input[name=id]").val(res.data.id);
                        $(".form-con input[name=taskId]").val(res.data.taskId);
                        $(".form-con textarea.contentValue").val(res.data.content);
                        $(".form-con select.status").val(res.data.status);
                        $(".form-con input[name=recordCount]").val(res.data.recordCount);
                        var ctime = formatTime(new Date(res.data.ctime*1000), format = 'YYYY-MM-DD HH:mm:ss');
                        $("#ctime").val(ctime);
                        $("input").addClass("scan");
                        $("select").addClass("scan");
                        $("textarea").addClass("scan");
                        $('input').attr('disabled',true);
                        $("select").attr('disabled',true);
                        $("textarea").attr('disabled',true);
                    }else if(doActive === "modify"){
                        $(".dialog").show();
                        $(".form h3").text(status.modify[0]);
                        $(".form-con .submit").text(status.modify[1]);
                        $(".form-con input.addDisabled").attr('disabled',true);

                        $(".form-con input[name=id]").val(res.data.id);
                        $(".form-con input[name=taskId]").val(res.data.taskId);
                        $(".form-con textarea.contentValue").val(res.data.content);
                        $(".form-con select.status").val(res.data.status);
                        $(".form-con input[name=recordCount]").val(res.data.recordCount);
                        var ctime = formatTime(new Date(res.data.ctime*1000), format = 'YYYY-MM-DD HH:mm:ss');
                        $("#ctime").val(ctime);
                    }
                }
            }
        })
    }

    function getCount(){
        var taskId = $("#searchtaskId").val().trim();
        var status = $("#searchstatus").val();
        if($("#searchTime").val()){
            var time = $("#searchTime").val()?$("#searchTime").val().split("-"): '';
            var startTime = new Date(time[0]).getTime();
            var endTime = new Date(time[1]).getTime();
        }else {
            var startTime = '';
            var endTime = '';
        }

        $.ajax({
            url: URL+"/agent/uploadlog/count",
            type: "get",
            data: {
                taskId: taskId,
                status: status,
                startTime: startTime,
                endTime: endTime
            },
            dataType: "json",
            headers: {"Authorization": token},
            success: function(res) {
                console.log(res.data);
                if(res.code=== 200){
                    getList(res.data);
                    //分页
                    pageNumber = Math.ceil(res.data/size);
                    totalSize = res.data;
                    $("#page").paging({
                        pageNo:current,
                        totalPage: pageNumber,
                        totalSize: res.data,
                        callback: function(curNum) {
                            current = curNum;
                            getList();
                        }
                    })
                }else{
                    error(xhr)
                }
            },
            error: function(xhr){
                error(xhr)
            }
        })
    }

    // 获取后台数据
    function getList() {
        var taskId = $("#searchtaskId").val().trim();
        var status = $("#searchstatus").val();
        if($("#searchTime").val()){
            var time = $("#searchTime").val()?$("#searchTime").val().split("-"): '';
            var startTime = new Date(time[0]).getTime();
            var endTime = new Date(time[1]).getTime();
        }else {
            var startTime = '';
            var endTime = '';
        }
        $.ajax({
            url: URL+"/agent/uploadlog/list",
            type: "get",
            data: {
                taskId: taskId,
                status: status,
                startTime: startTime,
                endTime: endTime,
                start: (current-1)*size,
                size: size
            },
            dataType: "json",
            headers: {"Authorization": token},
            success: function(res) {
                success(res)
            },
            error: function(xhr){
                error(xhr)
            }
        })
    }


    function refish(){
        // 实现修改操作
        $('.modify').click(function(){
            doActive = 'modify';
            var tr = $(this).closest('tr');//找到tr元素
            var value = tr.find('td:eq(0)').html();
            getEchoData(value);
        });
        // 实现删除操作
        $('.delete').click(function(){
            var tr = $(this).closest('tr');//找到tr元素
            var key = tr.find('td:eq(0)').html();//找到td元素
            deleteData(key);
        });
        // 查看详情操作
        $('.detail').click(function(){
            doActive = 'detail';
            var tr = $(this).closest('tr');//找到tr元素
            var value = tr.find('td:eq(0)').html();
            getEchoData(value);
        });
    }

    // 调用删除接口

    // 调用删除接口
    function deleteData(key){
        $.ajax({
            url: URL+"/agent/parameter/delete",
            type: "get",
            data: {key: key},
            dataType: "json",
            headers: {"Authorization": token},
            success: function(res) {
                console.log(res.data);
                if(res.code=== 200){
                    getList();
                }
            }
        })
    }



