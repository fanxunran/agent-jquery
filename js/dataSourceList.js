    var doActive = null;
    var status = {
        add:['增加','提交'],
        delete:['删除','删除'],
        modify:['修改','更新'],
        search:['查询','查询'],
        detail:['详情','详情']
    };
    var deleteScan = null;
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

        $(".form h3").text('增加');
        $(".form-con .submit").text('提交');

        $(".form-con input.addDisabled").attr('disabled',false);

        $(".form-con input[name=sourceId]").val('');
        $(".form-con select.type").val('');
        $(".form-con textarea").val('');
        $(".form-con input[name=userName]").val('');
        $(".form-con input[name=password]").val('');
    });

    // 实现搜索操作
    // $('.search').click(function(){
    //     current = 1;
    //     getList();
    // });

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
            var sourceId = $(".form-con input[name=sourceId]").val();
            var type = $(".form-con select.type").val();
            var url = $(".form-con textarea").val();
            var userName = $(".form-con input[name=userName]").val();
            var password = $(".form-con input[name=password]").val();
            $.ajax({
                url: URL+"/agent/datasource/update",
                type: "get",
                data: {
                    sourceId: sourceId,
                    type: type,
                    url: url,
                    userName: userName,
                    password: password
                },
                dataType: "json",
                headers: {"Authorization": token},
                success: function(res) {
                    console.log(res.data);
                    if(res.code=== 200){
                            getList();
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
            var sourceId = $(".form-con input[name=sourceId]").val();
            var type = $(".form-con select.type").val();
            var url = $(".form-con textarea").val();
            var userName = $(".form-con input[name=userName]").val();
            var password = $(".form-con input[name=password]").val();
            $.ajax({
                url: URL+"/agent/datasource/add",
                type: "get",
                data: {
                    sourceId: sourceId,
                    type: type,
                    url: url,
                    userName: userName,
                    password: password
                },
                dataType: "json",
                headers: {"Authorization": token},
                success: function(res) {
                    console.log(res.data);
                    if(res.code=== 200){
                            getList();
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

    // 获取列表数据
    getList();
    getSelectList();
});
    // 获取回显数据
    function getEchoData(value){
        $.ajax({
            url: URL+"/agent/datasource/detail",
            type: "get",
            data: {sourceId: value},
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

                        $(".form-con input[name=sourceId]").val(res.data.sourceId);
                        $(".form-con select.type").val(res.data.type);
                        $(".form-con textarea").val(res.data.url);
                        $(".form-con input[name=userName]").val(res.data.userName);
                        $(".form-con input[name=password]").val(res.data.password);
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

                        $(".form-con input[name=sourceId]").val(res.data.sourceId);
                        $(".form-con select.type").val(res.data.type);
                        $(".form-con textarea").val(res.data.url);
                        $(".form-con input[name=userName]").val(res.data.userName);
                        $(".form-con input[name=password]").val(res.data.password);
                    }

                }
            }
        })
    }
    // 列表数据渲染
    function renderList(data){
        $('table>tbody').empty();
        for(var i=0;i<data.length;i++){
            var html = '<tr><td>'+data[i].sourceId+'</td><td>'+data[i].type+'</td><td>'+data[i].url+'</td><td>'+data[i].userName+'</td><td>'+data[i].password+'</td><td>';
            var button = '<a href="javascript:void(0);" class="button button6 detail">详情</a><a href="javascript:void(0);" class="button button3 modify">修改</a><a href="javascript:void(0);" class="button button2 delete">删除</a></td></tr>';
            $('table>tbody').append(html+button);
        }
        addTitle();
    }
    // 获取后台数据
    function getList() {
        $.ajax({
            url: URL+"/agent/datasource/list",
            type: "get",
            data: {},
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
    // 获取select选择框数据
    function getSelectList() {
        $.ajax({
            url: URL+"/agent/datasource/typelist",
            type: "get",
            data: {},
            dataType: "json",
            headers: {"Authorization": token},
            success: function(res) {
                console.log(res.data);
                if(res.code=== 200){
                    for(var i=0;i<res.data.length;i++){
                        $("select.type").append("<option value='"+res.data[i]+"'>"+res.data[i]+"</option>");
                    }
                }
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
            url: URL+"/agent/datasource/delete",
            type: "get",
            data: {sourceId: key},
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



