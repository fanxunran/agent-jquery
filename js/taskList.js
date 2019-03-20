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
    getSelectList();
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

        $(".form h3").text('增加');
        $(".form-con .submit").text('提交');
        $(".form-con input.addDisabled").attr('disabled',false);
        $(".form-con.idShow").hide();
        $(".form-con select").val('');
        $(".form-con input").val('');
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
            var jobId= $(".form-con input[name=jobId]").val();
            var context= $(".form-con textarea.contentValue").val();
            var context2= $(".form-con textarea.content2Value").val();
            var context3= $(".form-con textarea.content3Value").val();
            var source= $(".form-con select.source").val();
            var dataIdentify= $(".form-con input[name=dataIdentify]").val();
            var type= $(".form-con select.type").val();
            var endValue= $("#endValue").val();
            var startValue= $("#startValue").val();
            var gapValue= $(".form-con input[name=gapValue]").val();
            var columnName= $(".form-con input[name=columnName]").val();
            var description= $(".form-con input[name=description]").val();
            var totalCount= $(".form-con input[name=totalCount]").val();

            $.ajax({
                url: URL+"/agent/task/update",
                type: "get",
                data: {
                    id: id,
                    jobId: jobId,
                    context: context,
                    context2: context2,
                    context3: context3,
                    source: source,
                    dataIdentify: dataIdentify,
                    type: type,
                    startValue: startValue,
                    endValue: endValue,
                    gapValue: gapValue,
                    columnName: columnName,
                    description: description,
                    totalCount: totalCount
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
            var jobId= $(".form-con input[name=jobId]").val();
            var context= $(".form-con textarea.contentValue").val();
            var context2= $(".form-con textarea.content2Value").val();
            var context3= $(".form-con textarea.content3Value").val();
            var source= $(".form-con select.source").val();
            var dataIdentify= $(".form-con input[name=dataIdentify]").val();
            var type= $(".form-con select.type").val();
            var endValue= $("#endValue").val();
            var startValue= $("#startValue").val();
            var gapValue= $(".form-con input[name=gapValue]").val();
            var columnName= $(".form-con input[name=columnName]").val();
            var description= $(".form-con input[name=description]").val();
            $.ajax({
                url: URL+"/agent/task/add",
                type: "get",
                data: {
                    jobId: jobId,
                    context: context,
                    context2: context2,
                    context3: context3,
                    source: source,
                    dataIdentify: dataIdentify,
                    type: type,
                    startValue: startValue,
                    endValue: endValue,
                    gapValue: gapValue,
                    columnName: columnName,
                    description: description,
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
        $('.main table>tbody').empty();
        for(var i=0;i<data.length;i++){
            data[i].type = data[i].type == 0 ? '增量':'全量';
            var html =
                '<tr><td>'+data[i].id
                +'</td><td>'+data[i].jobId
                +'</td><td>'+data[i].source
                +'</td><td>'+data[i].dataIdentify
                +'</td><td>'+data[i].columnName
                +'</td><td>'+data[i].type
                +'</td><td>'+data[i].startValue
                +'</td><td>'+data[i].endValue
                +'</td><td>'+data[i].gapValue
                +'</td><td>'+data[i].totalCount
                +'</td><td>'+data[i].description
                +'</td><td>';
            var button = '<a href="javascript:void(0);" class="button button6 detail">详情</a><a href="javascript:void(0);" class="button button3 modify">修改</a><a href="javascript:void(0);" class="button button2 delete">删除</a></td></tr>';
            $('.main table>tbody').append(html+button);
        }
        addTitle();
    }

    // 获取回显数据
    function getEchoData(value){
        $.ajax({
            url: URL+"/agent/task/detail",
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
                        $(".form-con.idShow").show();
                        $(".form-con input.addDisabled").attr('disabled',true);
                        $(".form-con input[name=id]").val(res.data.id);
                        $(".form-con input[name=jobId]").val(res.data.jobId);
                        $(".form-con textarea.contentValue").val(res.data.context);
                        $(".form-con textarea.content2Value").val(res.data.context2);
                        $(".form-con textarea.content3Value").val(res.data.context3);
                        $(".form-con select.source").val(res.data.source);
                        $(".form-con input[name=dataIdentify]").val(res.data.dataIdentify);
                        $(".form-con select.type").val(res.data.type);
                        $("#startValue").val(res.data.startValue);
                        $("#endValue").val(res.data.endValue);
                        $(".form-con input[name=gapValue]").val(res.data.gapValue);
                        $(".form-con input[name=columnName]").val(res.data.columnName);
                        $(".form-con input[name=description]").val(res.data.description);
                        $(".form-con input[name=totalCount]").val(res.data.totalCount);
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
                        $(".form-con.idShow").show();
                        $(".form-con input.addDisabled").attr('disabled',true);
                        $(".form-con input[name=id]").val(res.data.id);
                        $(".form-con input[name=jobId]").val(res.data.jobId);
                        $(".form-con textarea.contentValue").val(res.data.context);
                        $(".form-con textarea.content2Value").val(res.data.context2);
                        $(".form-con textarea.content3Value").val(res.data.context3);
                        $(".form-con select.source").val(res.data.source);
                        $(".form-con input[name=dataIdentify]").val(res.data.dataIdentify);
                        $(".form-con select.type").val(res.data.type);
                        $("#startValue").val(res.data.startValue);
                        $("#endValue").val(res.data.endValue);
                        $(".form-con input[name=gapValue]").val(res.data.gapValue);
                        $(".form-con input[name=columnName]").val(res.data.columnName);
                        $(".form-con input[name=description]").val(res.data.description);
                        $(".form-con input[name=totalCount]").val(res.data.totalCount);
                    }

                }
            }
        })
    }

    function getCount(){
        var jobId = $("#searchjobId").val().trim();
        var dataIdentify = $("#searchdataIdentify").val().trim();
        var source = $("#searchsource").val().trim();
        var type = $("#searchtype").val();
        $.ajax({
            url: URL+"/agent/task/count",
            type: "get",
            data: {
                jobId: jobId,
                dataIdentify: dataIdentify,
                source: source,
                type: type
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
    function getList(num) {
        var jobId = $("#searchjobId").val().trim();
        var dataIdentify = $("#searchdataIdentify").val().trim();
        var source = $("#searchsource").val().trim();
        var type = $("#searchtype").val();
        $.ajax({
            url: URL+"/agent/task/list",
            type: "get",
            data: {
                jobId: jobId,
                dataIdentify: dataIdentify,
                source: source,
                type: type,
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
            url: URL+"/agent/task/delete",
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



