var sourceId;
var tName;
var task;
var columnType;
var ruleId;
var dataType;
var ruleName;
var dateBaseType;
var columnName;
var status = true;
$(function(){
	    // 日期插件初始化
	var currentDate = formatTime(new Date()).toString().split(' ')[0];
    zaneDate({
        elem:'#ctime',
        begintime:'',
        format:'yyyy-MM-dd HH:mm:ss',
        showtime:true,
        max: currentDate
    });
    // 日期插件初始化
    zaneDate({
        elem:'#apictime',
        begintime:'',
        format:'yyyy-MM-dd HH:mm:ss',
        showtime:true,
        max: currentDate
    });
	// 数据库或者api选择
	$(".img-src").click(function(e){
		dateBaseType = $(this).attr("data");
		$(".dataBaseName").empty();

		if(dateBaseType =='api'){
			$(".step1").hide();
			$(".step3").show();
			// 获取规则数据
			dataApi();
		}else{
			$.ajax({
	            contentType: 'application/json',
	            url: URL+"/agent/datasource/listbytype",
	            type: "get",
	            data: {type: dateBaseType},
	            dataType: "json",
	            async:false,
	            headers: {"Authorization": token},
	            success: function(res) {
	                // success(res)
	                var html = '<option value="0" disabled selected>请选择</option>';
	                for(var i=0;i<res.data.length;i++){
	                	html += '<option value="'+res.data[i].sourceId+'">'+res.data[i].sourceId+'</option>'
	                }
	                $(".dataBaseName").append(html)
	            },
	            error: function(xhr){
	                error(xhr)
	            }
	        })
			$(".step1").hide();
			$(".step2").show();
			// 获取规则数据
			dataResouce();
		}
		$(".form-con.apiAddress textarea.url").val('');
		$(".form-con.apiInputType textarea.apiparam").val('');
		$(".classApi .form-con.apiInputType").hide();
		$(".form-con input[name=task]").val('');
		$(".form-con.wid100.labelblock .columnName").empty();
		$(".dataBaseListName").empty();
		$(".dataBaseListName").append('<option value="0" disabled selected>请选择</option>')
		e.stopPropagation();
	})
	// 数据库名下拉监听sourceId
	$(".dataBaseName").change(function(e){
		sourceId = this.options[this.options.selectedIndex].value;
		$(".dataBaseListName").empty();
		$(".form-con ul").empty();
		if(sourceId){
			$.ajax({
	            contentType: 'application/json',
	            url: URL+"/agent/taskconfig/table_list",
	            type: "get",
	            data: {
	            	sourceId: sourceId,
	            	tName: ''
	            },
	            dataType: "json",
	            headers: {"Authorization": token},
	            success: function(res) {
	            	// 表名内容填充
			       	var html = '';
	                for(var i=0;i<res.data.length;i++){
	                	html += '<li value="'+res.data[i]+'">'+res.data[i]+'</li>'
	                }
	                $(".form-con ul").append(html);

	                $("#tName").bind("input propertychange",function(event){
				       $(".form-con ul").empty();
				       var value = $("#tName").val();
				       var currentValue = [];

				       for(var i=0;i<res.data.length;i++){
							if(res.data[i].toLowerCase().includes(value.toLowerCase())){
								currentValue.push(res.data[i])
							};
				       }
				       console.log(currentValue);
				       if(currentValue.length>0){
					       	var html = '';
			                for(var i=0;i<currentValue.length;i++){
			                	html += '<li value="'+currentValue[i]+'">'+currentValue[i]+'</li>'
			                }
			                $(".form-con ul").append(html);
			                $(".form-con ul").show();
				       }else{
				       		$(".form-con ul").hide();
				       }
						showDom();
					});
					$("#tName").focus(function(){
						$(".form-con ul").show();
						showDom();
					});
					$("#tName").blur(function(){
						// setTimeout(function(){
				            $(".form-con ul").hide();
				        // }, 300);
					});

	            },
	            error: function(xhr){
	                error(xhr)
	            }
	        })
		};
		e.stopPropagation();
	})

	function showDom(){
        $(".form-con ul li").mousedown(function(){
	        	console.log($(this));
	        	var value = $(this).text();
	        	console.log(value);
				$("#tName").val(value);
				$(".form-con ul").hide();
				eventChange(value);
		})
	}


	// 表名下拉监听tableName
	function eventChange(val){
		tName = val;
		$(".form-con.wid100.labelblock .columnName").empty();
		$(".form-con input[name=task]").val(tName);
		if(tName){
			$.ajax({
	            contentType: 'application/json',
	            url: URL+"/agent/taskconfig/columns_list",
	            type: "get",
	            data: {
	            	sourceId: sourceId,
	            	tName: tName
	            },
	            dataType: "json",
	            headers: {"Authorization": token},
	            success: function(res) {
	                var html='';
	                for(var i=0;i<res.data.length;i++){
	                	html += '<label><input type="radio" value="'+res.data[i]+'" name="radio">'+res.data[i]+'</label>'
	                }
	                $(".form-con.wid100.labelblock .columnName").append(html)
	            },
	            error: function(xhr){
	                error(xhr)
	            }
	        })
		};
	}

	// 规则下拉框监听ruleId
	$(".dataResoucerule").change(function(e){
		ruleName = this.options[this.options.selectedIndex].value;
		var tips = $(this).find("option:selected").attr("data");
		$(".dataResouceTips").empty();
		$(".dataResouceTips").append(tips);
		ruleId = $(this).find("option:selected").attr("data-id");
		$(".form-con.wid100.addInput").hide();
		$(".form-con.wid100.labelblock").hide();
		$(".form-con.wid100.ctime").hide();
		$(".classApi .form-con.apiInputType").hide();
		$(".classApi .form-con.apiInputTime").hide();
		if(ruleId ==10||ruleId ==1){

		}else if(ruleId ==2){
			$(".classApi .form-con.apiInputType").show();
		}else if(ruleId ==3){
			$(".classApi .form-con.apiInputTime").show()
		}else{
			$(".form-con.wid100.ctime").show();
			$(".form-con.wid100.addInput").show();
			// 显示表
			$(".form-con.wid100.labelblock").show();
		}
		// 添加输入框
		e.stopPropagation();
	})

	// 字段类型下拉框监听columnType
	$(".dataResoucerule").change(function(e){
		columnType = this.options[this.options.selectedIndex].value;
		// 添加输入框
		e.stopPropagation();
	})

	$(".cancel").click(function(){
		if(dateBaseType =='api'){
			$(".step3").hide();
			$(".step1").show();
		}else{
			$(".step2").hide();
			$(".step1").show();
		}
	})

	$(".submit").click(function(){
		if(dateBaseType =='api'){
			jobName = $(".classApi .form-con input[name=task]").val();
			columnType = '';
			var columnName = '';
			var startTimeTemp = $(".classApi  input[name=startTime]").val();
			var startTime = formatTime(new Date(startTimeTemp));
			var day = $(".classApi input[name=day]").val();
			var cronUnit = $(".classApi select.day").val();
			var hour = $(".classApi select.hour").val();
			var minute = $(".classApi select.minute").val();
			var second = $(".classApi select.second").val();
			switch (cronUnit){
				case "day":

					break;
				case "hour":
					hour=day;
					day=0;
					break;
				case "minute":
					minute=day;
					day=0;
					break;
				case "second":
					second=day;
					day=0;
					break;
			}
			var url = $(".classApi textarea.url").val();
			var apiParam = $(".classApi textarea.apiparam").val();
		}else{
			jobName = $(".classData .form-con input[name=task]").val();
			columnType = $(".classData .form-con select.columnType").val();
			var columnName = $(".classData input[name=radio]").val();
			var startTimeTemp = $(".classData input[name=startTime]").val();
			var startTime = formatTime(new Date(startTimeTemp));
			var day = $(".classData input[name=day]").val();
			var cronUnit = $(".classData select.day").val();
			var hour = $(".classData select.hour").val();
			var minute = $(".classData select.minute").val();
			var second = $(".classData select.second").val();
			switch (cronUnit){
				case "day":

					break;
				case "hour":
					hour=day;
					day=0;
					break;
				case "minute":
					minute=day;
					day=0;
					break;
				case "second":
					second=day;
					day=0;
					break;
			}

			var url = '';
			var apiParam = '';
		}
		$.ajax({
            contentType: 'application/json',
            url: URL+"/agent/taskconfig/save",
            type: "GET",
            data: {
            	sourceId: sourceId,
            	jobName: jobName,
            	tableName: tName,
            	columnName: columnName,
            	columnType: columnType,
            	ruleId: ruleId,
            	startTime: startTime,
            	cronUnit: cronUnit,
            	day: day,
            	hour: hour,
            	minute: minute,
            	second: second,
            	url: url,
            	apiParam: apiParam
            },
            dataType: "json",
            async:false,
            headers: {"Authorization": token},
            success: function(res) {
                // success(res);
                $(".step2").hide();
                $(".step3").hide();
				$(".step1").show();
				$(".form-con.wid100.addInput").hide();
				$(".form-con.wid100.labelblock").hide();
				$(".form-con.wid100.ctime").hide();
				$(".classApi .form-con.apiInputType").hide();
				$(".classApi .form-con.apiInputTime").hide();
            },
            error: function(xhr){
                error(xhr)
            }
        })

	});

	// 时间选择框数据填充
	var hourhtml;
    for(var i=0;i<24;i++){
    	hourhtml += '<option value="'+i+'">'+i+'</option>'
    }
    $(".hour").empty();
    $(".hour").append(hourhtml);
    var mshtml;
    for(var i=0;i<=60;i++){
    	mshtml += '<option value="'+i+'">'+i+'</option>'
    }
    $(".minute").empty();
    $(".minute").append(mshtml);
    $(".second").empty();
    $(".second").append(mshtml);

    //时间周期下拉监听
	$("select.day").change(function(e){
		dataType = this.options[this.options.selectedIndex].value;
		var arr = ['day','hour','minute','second'];
		console.log(arr.indexOf(dataType));
		var t = arr.indexOf(dataType);
		if(dateBaseType =='api'){
			$(".classApi .form-con select.child").hide();
			$(".classApi .form-con.wid100 span.con").hide();
			$(".classApi .form-con select.child").val(0);
			for( var i=t ;i < $(".classApi .form-con.wid100 select.child").length;i++){
				$(".classApi .form-con select.child").eq(i).show();
				$(".classApi .form-con.wid100 span.con").eq(i).show();
			}
		}else{
			$(".classData .form-con select.child").hide();
			$(".classData .form-con.wid100 span.con").hide();
			$(".classData .form-con select.child").val(0);
			for( var i=t ;i < $(".classData .form-con.wid100 select.child").length;i++){
				$(".classData .form-con select.child").eq(i).show();
				$(".classData .form-con.wid100 span.con").eq(i).show();
			}
		}

		e.stopPropagation();
	})
})

    // 获取resouce规则后台数据
    function dataResouce() {
    	$(".dataResoucerule").empty('');
        $.ajax({
            contentType: 'application/json',
            url: URL+"/agent/taskconfig/dbrule",
            type: "get",
            dataType: "json",
            async:false,
            headers: {"Authorization": token},
            success: function(res) {
        		var html = '<option value="0" disabled selected data-id="0">请选择</option>';
                for(var i=0;i<res.data.length;i++){
                	html += '<option value="'+res.data[i].name+'" data="'+res.data[i].desc+'" data-id="'+res.data[i].id+'">'+res.data[i].name+'</option>'
                }
                $(".dataResoucerule").append(html);
                $(".dataResouceTips").empty();
                // $(".form-con.wid100.addInput").empty();
            },
            error: function(xhr){
                error(xhr)
            }
        })
    };
    // 获取dataApi规则后台数据
    function dataApi() {
    	$(".dataResoucerule").empty('');
        $.ajax({
            contentType: 'application/json',
            url: URL+"/agent/taskconfig/apirule",
            type: "get",
            dataType: "json",
            async:false,
            headers: {"Authorization": token},
            success: function(res) {
        		var html = '<option value="0" disabled selected data-id="0">请选择</option>';
                for(var i=0;i<res.data.length;i++){
                	html += '<option value="'+res.data[i].name+'" data="'+res.data[i].desc+'" data-id="'+res.data[i].id+'">'+res.data[i].name+'</option>'
                }
                $(".dataResoucerule").append(html);
                $(".dataResouceTips").empty();
                // $(".form-con.wid100.addInput").empty();
            },
            error: function(xhr){
                error(xhr)
            }
        })
    };
    function increase(obj){
    	var tmp = obj;
    	var day = parseInt($(tmp).siblings("input").val());
    	day += 1;
    	if(day<=0){
    		day=1;
    	}
    	$("input[name=day]").val(day)
    }
    function reduce(obj){
    	var tmp = obj;
    	var day = parseInt($(tmp).siblings("input").val());
    	day -= 1;
    	if(day<=0){
    		day=1;
    	}
    	$("input[name=day]").val(day);
    }