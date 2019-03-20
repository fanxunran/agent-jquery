$(function(){
    getSelectList();

    // 查询sql
    $(".search").click(function(){
        var sourceId = $("select.input-search").val();
        var sql = $("textarea.sql").val();
        $.ajax({
            url: URL+"/agent/sql/excute",
            type: "get",
            data: {
                sourceId: sourceId,
                sql: sql
            },
            dataType: "json",
            headers: {"Authorization": token},
            success: function(res) {
                if(res.code=== 200){
                    $(".dataSize").text("dataSize:"+res.data.dataSize);
                    $(".updateSize").text("updateSize:"+res.data.updateSize);
                    $("textarea.json").val(res.data.jsonData);
                }else{
                    error(xhr)
                }
            },
            error: function(xhr){
                error(xhr)
            }
        })
    })
    // 清空内容
    $(".clean").click(function(){
        $("select.input-search").val('');
        $("textarea.sql").val('');
        $(".dataSize").text('dataSize:--');
        $(".updateSize").text('updateSize:--');
        $("textarea.json").val('');
    })
});
