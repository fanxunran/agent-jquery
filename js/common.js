    // var URL = 'http://agent.wakedata.com:9101';
    var URL = 'http://10.19.24.196:9101';
    var errorStatus = false;
    var t;
    // 错误提示
    var errorHtmlFirst = '<div class="dss-common-msg dss-common-msg--error" style="z-index: 5002;">'+
                    '<i class="el-message__icon el-icon-error"></i>'+
                        '<p class="dss-common-msg__content">'+
                            '<span>';
    var errorHtmlEnd = '!</span>'+
                        '</p>'+
                '</div>';
    // 日期格式化方法;转为日期格式new Date()可接受毫秒和日期;转化为毫秒必须调用getTime();
    function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss'){
	    let o = {
	      'M+': date.getMonth() + 1, //month
	      'D+': date.getDate(), //day
	      'H+': date.getHours(), //hour
	      'm+': date.getMinutes(), //minute
	      's+': date.getSeconds(), //second
	      'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
	      S: date.getMilliseconds(), //millisecond
	      w: '日一二三四五六'.charAt(date.getDay())
	    };

	    format = format.replace(/Y{4}/, date.getFullYear()).replace(
	      /Y{2}/,
	      date
	        .getFullYear()
	        .toString()
	        .substring(2)
	    );

	    let k, reg;
	    for (k in o) {
	      reg = new RegExp(k);

	      /* eslint no-use-before-define:0 */
	      format = format.replace(reg, match);
	    }

	    function match(m) {
	      return m.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length);
	    }

	    return format;
  }

     // 给td添加title属性
    function addTitle() {
        $("table tr td").each(function () {
        	if($(this).text() == ""||$(this).text() == "null"){
        		$(this).text("--")
        	}
            $(this).attr("title", $(this).text());
            $(this).css("cursor", 'pointer');
        });
    }
    // 获取select选择框数据
    function getSelectList() {
        $.ajax({
            url: URL+"/agent/sql/sourcelist",
            type: "get",
            data: {},
            dataType: "json",
            headers: {"Authorization": token},
            success: function(res) {
                if(res.code=== 200){
                    for(var i=0;i<res.data.length;i++){
                        $("select.common").append("<option value='"+res.data[i]+"'>"+res.data[i]+"</option>");
                    }
                }
            },
            error: function(xhr){
                error(xhr)
            }
        })
    }
    $(function(){
        token = localStorage.getItem("TOKEN")?localStorage.getItem("TOKEN"):'';
        $(window).keydown(function (event) {
            if (event.keyCode == 27) {
                if(errorStatus){
                    $("#container .dss-common-msg").remove();
                    window.clearTimeout(t);
                    errorStatus = false;
                }else{
                    $(".dialog").hide();
                    $("input").removeClass("scan");
                    $("select").removeClass("scan");
                    $("textarea").removeClass("scan");
                    $(".form-con .submit").show();
                    $('input').attr('disabled',false);
                    $("select").attr('disabled',false);
                    $("textarea").attr('disabled',false);
                    $(".el-dialog_delete").hide();
                }
            }
        });
    })
    //错误方法
    function error(xhr){
        if(xhr.status === 500){
            $("#container").append(errorHtmlFirst+JSON.parse(xhr.responseText).msg+errorHtmlEnd);
            errorStatus=true;
            // 关闭错误弹窗
            $(".sure.close").click(function(){
                $("#container .dss-common-msg").remove();
                window.clearTimeout(t);
                errorStatus = false;
            });
            t = setTimeout(function(){
                $("#container .dss-common-msg").remove();
                errorStatus = false;
            },3000)
        }else if(xhr.status===401){
            window.location.href="/agent"
        }
    }

    //成功方法
    function success(res){
        if(res.code=== 200){
            renderList(res.data);
            refish()
        }else{
            window.location.href="/agent"
        }
    }


