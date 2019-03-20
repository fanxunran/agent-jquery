var doActive = null;
var status = {
    add:['增加','提交'],
    delete:['删除','删除'],
    modify:['修改','更新'],
    search:['查询','查询'],
    detail:['详情','详情']
};
var deleteScan = null;
// 分页参数
var start = 1;
var size = 20;
var current = 1;
var pageNumber;
var totalSize;
$(function(){

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
        $(".form-con input.addDisabled").attr('disabled',false);
        $(".form h3").text('增加');
        $(".form-con .submit").text('提交');
        $(".form-con.idShow").hide();
        $(".form-con select").val('');
        $(".form-con input").val('');
        $(".form-con textarea").val('');
        $(".form-con select.status").val(0);
        $(".form-con select.restart").val(0);
        $(".form-con select.concurrent").val(0);
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

    $(".cancel").click(function(){
        $(".el-dialog_delete").hide();
    });

    $(".sure").click(function(){
        deleteData(deleteScan);
        $(".el-dialog_delete").hide();
    });

    // 实现删除操作
    $('.delete').click(function(){
        var tr = $(this).closest('tr');//找到tr元素
        deleteScan = tr.find('td:eq(0)').html();//找到td元素
        $(".el-dialog_delete").show();
    });

    // 添加数据或更新数据
    $(".submit").click(function(){
        if(doActive === "modify"){
            var id= $(".form-con input[name=id]").val();
            var jobName= $(".form-con input[name=jobName]").val();
            var jobGroupName= $(".form-con input[name=jobGroupName]").val();
            var classPath= $(".form-con textarea.contentValue").val();
            var status= $(".form-con select.status").val();
            var cron= $(".form-con input[name=cron]").val();
            var restart= $(".form-con select.restart").val();
            var concurrent= $(".form-con select.concurrent").val();
            $.ajax({
                url: URL+"/agent/schedule/update",
                type: "get",
                data: {
                    id: id,
                    jobName: jobName,
                    jobGroupName: jobGroupName,
                    classPath: classPath,
                    status: status,
                    cron: cron,
                    restart: restart,
                    concurrent: concurrent
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
        }else if(doActive === "add"){
            var jobName= $(".form-con input[name=jobName]").val();
            var jobGroupName= $(".form-con input[name=jobGroupName]").val();
            var classPath= $(".form-con textarea.contentValue").val();
            var status= $(".form-con select.status").val();
            var cron= $(".form-con input[name=cron]").val();
            var restart= $(".form-con select.restart").val();
            var concurrent= $(".form-con select.concurrent").val();
            $.ajax({
                url: URL+"/agent/schedule/add",
                type: "get",
                data: {
                    jobName: jobName,
                    jobGroupName: jobGroupName,
                    classPath: classPath,
                    status: status,
                    cron: cron,
                    restart: restart,
                    concurrent: concurrent
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
    // 获取回显数据
    function getEchoData(value){
        $.ajax({
            url: URL+"/agent/schedule/detail",
            type: "get",
            data: {id: value},
            dataType: "json",
            headers: {"Authorization": token},
            success: function(res) {
                if(res.code=== 200){
                    // 弹出dialog回显数据
                    if(doActive === "detail"){
                        $(".dialog").show();
                        $(".form h3").text('详情');
                        $(".form-con .submit").hide();

                        $(".form-con input.addDisabled").attr('disabled',true);
                        $(".form-con.idShow").show();
                        $(".form-con input[name=id]").val(res.data.id);
                        $(".form-con input[name=jobName]").val(res.data.jobName);
                        $(".form-con input[name=jobGroupName]").val(res.data.jobGroupName);
                        $(".form-con textarea.contentValue").val(res.data.classPath);
                        $(".form-con select.status").val(res.data.status);
                        $(".form-con input[name=cron]").val(res.data.cron);
                        $(".form-con select.restart").val(res.data.restart);
                        $(".form-con select.concurrent").val(res.data.concurrent);
                        $("input").addClass("scan");
                        $("select").addClass("scan");
                        $("textarea").addClass("scan");
                        $('input').attr('disabled',true);
                        $("select").attr('disabled',true);
                        $("textarea").attr('disabled',true);
                    }else if(doActive === "modify"){
                        $(".dialog").show();

                        $(".form h3").text('修改');
                        $(".form-con .submit").text('更新');
                        $(".form-con input.addDisabled").attr('disabled',true);
                        $(".form-con.idShow").show();
                        $(".form-con input[name=id]").val(res.data.id);
                        $(".form-con input[name=jobName]").val(res.data.jobName);
                        $(".form-con input[name=jobGroupName]").val(res.data.jobGroupName);
                        $(".form-con textarea.contentValue").val(res.data.classPath);
                        $(".form-con select.status").val(res.data.status);
                        $(".form-con input[name=cron]").val(res.data.cron);
                        $(".form-con select.restart").val(res.data.restart);
                        $(".form-con select.concurrent").val(res.data.concurrent);
                    }

                }
            }
        })
    }
    // 列表数据渲染
    function renderList(data){
        $('table>tbody').empty();
        for(var i=0;i<data.length;i++){
            switch(data[i].status){
                case 0:
                    data[i].status = '初始化历史数据';
                    break;
                case 1:
                    data[i].status = '正常';
                    break;
                case 2:
                    data[i].status = '下架';
                    break;
                default:
                    data[i].status = data[i].status;
            }

            data[i].restart = data[i].restart == 0 ? '不重启':'等待重启';
            data[i].concurrent = data[i].concurrent == 0 ? '串行':'并行';
            var html =
                '<tr><td>'+data[i].id
                +'</td><td>'+data[i].jobName
                +'</td><td>'+data[i].jobGroupName
                +'</td><td>'+data[i].classPath
                +'</td><td>'+data[i].cron
                +'</td><td>'+data[i].restart
                +'</td><td>'+data[i].concurrent
                +'</td><td>'+data[i].status
                +'</td><td>';
            var button = '<a href="javascript:void(0);" class="button button6 detail">详情</a><a href="javascript:void(0);" class="button button3 modify">修改</a><a href="javascript:void(0);" class="button button2 delete">删除</a></td></tr>';
            $('table>tbody').append(html+button)
        }
        addTitle();
    }

    function getCount(){
        var jobName = $("#searchjobName").val();
        var classPath = $("#searchclassPath").val();
        var status = $("#searchstatus").val();
        $.ajax({
            url: URL+"/agent/schedule/count",
            type: "get",
            data: {
                jobName: jobName,
                classPath: classPath,
                status: status
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
                        totalSize: totalSize,
                        callback: function(curNum) {
                            current = curNum;
                            getList();
                        }
                    })
                }
            },
            error: function(xhr){
                error(xhr)
            }
        })
    }

    // 获取后台数据
    function getList() {
        var jobName = $("#searchjobName").val().trim();
        var classPath = $("#searchclassPath").val();
        var status = $("#searchstatus").val();
        $.ajax({
            url: URL+"/agent/schedule/list",
            type: "get",
            data: {
                jobName: jobName,
                classPath: classPath,
                status: status,
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
            deleteScan = tr.find('td:eq(0)').html();//找到td元素
            $(".el-dialog_delete").show();
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
            url: URL+"/agent/schedule/delete",
            type: "get",
            data: {id: key},
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



