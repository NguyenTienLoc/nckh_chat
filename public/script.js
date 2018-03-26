$(document).ready(function(){
	var socket = io.connect();
	
	$('#layout_chat').hide();
	$('#box_chat_room').hide();
	$('#chat_don').hide();
	$('#register_layout').hide();
	$('#btn-login').click(function(){
        if($('#txt_email').val()==''){
			alert('vui lòng nhập tên tài khoản !!!');
		}else if( $('#txt_pass').val()==''){
			alert('vui lòng nhập mật khẩu !!!');
		}else{
			socket.emit('new user', {msv: $('#txt_email').val(),pass: $('#txt_pass').val()}, function(data){
				if (data){
					$('#layout_login').hide(1000);
					$('#layout_chat').show(1500);
					
	
				}else{
					alert('Sai thông tin tài khoản, Vui lòng kiểm tra lại');
	
					$('#txt_email').val('');
				}
			});
			$('#txt_email').val('');
			$('#txt_pass').val('');
		}
        
	});
	$('#dang_ky').click(function(){
		$('#register_layout').show();
		$('#layout_login').hide();
	});
	$('#btn_register').click(function(){
		var msv = $('#txt_msv_register').val();
		var name = $('#txt_name_register').val();
		var name_kd =change_alias( $('#txt_name_register').val());
		var sex = $('[name="gender"]:radio:checked').val();
		var pass = $('#txt_pass_register').val();
		
		socket.emit('dang-ky-tai-khoan',{msv:msv,name:name,name_kd:name_kd,sex:sex,pass:pass},function(data){
			if(data){
				var resuft =confirm("Đăng ký thành công..Vui lòng đăng nhập lại !!!");
				if(resuft==true){
					$('#register_layout').hide();
					$('#layout_login').show();
					socket.on('dang-ky-thanh-cong',function(data){
						var name = data.name;
						var pass = data.pass;
						$('#txt_email').val(name);
						$('#txt_pass').val(pass);
					});
				}else{
					$('#register_layout').show();
					$('#layout_login').hide();
				}
			}else{
				alert('Tài khoản trên đã được sử dụng, vui lòng nhập tài khoản khác ');
			}
		});
	});
	socket.on('tra_tin_nhan',function(data){
		var html ='';
		var ng_gui =change_alias($('#username_title').text());
		data.forEach(function(row){
			if(row.from==ng_gui){
				html+='<div class="mes_me_box"><div class="mes_me_ctn fix4"><span class="txt_mes_me">'+row.content+'</span></div></div>';
				// html += row.content+"<br>";
			}else{
				html +='<div class="mes_client_box"><div class="name_client"></div><div class="mes_ctn"><div class="avt_client_box"><img src="img/user.jpg" class="avt_client"></div><div class="mes_ctn_txt fix3"><span class="txt_mes_ctn">'+row.content+'</span></div></div></div>';
			}
			
			var name='#mes_space_'+row.to;
			var name2='#mes_space_'+row.from;
			$(name).html(html);
			$(name2).html(html);
		});
	});
	$(document).on("click","#us_ol",function(){
		var ng_gui =change_alias($('#username_title').text());
		 
		var ng_nhan= $(this).attr("name");
		var name = $(this).attr("name");
		var st= '#chat_don_'+name;
		$('#chat_server').hide();
		$('#chat_don_box').show();
		$(st).css('display','block');
		socket.emit('lay_data',{sendto:ng_gui,todo:ng_nhan});
		
	});
	$(document).on("click","#close_chat_box",function(){
		var name = $(this).attr("name");
		var st= '#chat_don_'+name;
		$(st).css('display','none');
	});
	$('#back_chat_server').click(function(){
		$('#chat_server').show();
		$('#chat_don_box').hide();
	});
	function change_alias(alias) {
		var str = alias;
		str = str.toLowerCase();
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
		str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
		str = str.replace(/đ/g,"d");
		str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,"-");
		str = str.replace(/ /g,"_");
		str = str.trim(); 
		return str;
	}

	var cout =0;
	socket.on('usernames', function(data){
			console.log(data);
			var html = '';
			var html2='';
				for (i=0; i<data.length; i++){
					var srt=change_alias(data[i]);
					if($('#username_title').text()==data[i]){
						html+='<div class="user_ol" style="display: none;"><div class="item_user" name="'+ srt+'" id="us_ol" ><div id ="tb_mes_'+srt+'"><img src="img/user.jpg" style="width:50px;height:50px;border-radius: 50%"></div><div class="info_user" >'+ data[i]+'</div><div class="time_ol"><i class="fa fa-circle" style="line-height:20px;font-size:10px;color:#62CB00; float:right"></i></div></div></div>'
					}else{
						html+='<div class="user_ol"><div class="item_user" name="'+ srt+'" id="us_ol" ><div id ="tb_mes_'+srt+'"><img src="img/user.jpg" style="width:50px;height:50px;border-radius: 50%"></div><div class="info_user" >'+ data[i]+'</div><div class="time_ol"><i class="fa fa-circle" style="line-height:20px;font-size:10px;color:#62CB00; float:right"></i></div></div></div>'
					}
				
				html2+='<div class="right_ctn chat_box" id="chat_don_'+srt+'"  style=" display: none;"><div class="chat_head fix1"><div class="info_chater fix_head"><div class="mes_header_center" style="width:330px;margin-top:-10px;height:40px"><div class="info"><div class="user_name fix2" id="box_name_'+srt+'">'+data[i]+'</div><div></div></div><div class="icon_exit"><a  href="javascript:void(0)"><i class="fa fa-times" id ="close_chat_box" name="'+ srt+'" ></i></a></div></div></div></div><div class="mes_space2" id="mes_space_'+srt+'"></div><div class="chat_input fix5"><div class="chat_input_ctn"><div class="chat_input_form"><textarea  id="input_text_don" style="padding-top:3px" name="'+srt+'" placeholder="Nhập tin nhắn" class="txt_ip"></textarea></div></div></div></div>';
				$('#cout_user').html(data.length);
				cout= data.length;
				}
				console.log(html);
				$('#list_user').html(html);
				$('#chat_don_box').html(html2);
				
	});
	socket.on('sucsest',function(data){
		var name ='<b>'+data.name+'</b>'
		$('#username_title').html(name);
		$('#mes_space_server').scrollTop($('#mes_space_server')[0].scrollHeight);
		$('#title_box').html(data.name);
		$('#info_name_title').html(data.name);
		$('#info_txt_name').val(data.name);
		$('#info_name_id').html(data.id);
		$('#info_txt_pass_old_none').val(data.pass);
	})
	// socket.on('sucsest all', function(data){
	// 	// var html='<div class="right_ctn chat_box" id="chat_don_'+data+'" style="margin-right:0px; "><div class="chat_head fix1"><div class="info_chater fix_head"><div class="mes_header_center" style="width:330px;margin-top:-10px;height:40px"><div class="info"><div class="user_name fix2">'+data+'</div></div><div class="icon_exit"><a href="#"><i class="fa fa-times"></i></a></div></div></div></div><div class="mes_space"></div><div class="chat_input fix5"><div class="chat_input_ctn"><div class="chat_input_form"><textarea style="padding-top:3px" name="mes" placeholder="Nhập tin nhắn" class="txt_ip fix6"></textarea></div></div></div></div>';
	// 	// $('#chat_don_box').append(html);
	// });
	socket.on('openbox', function(data){
		$('.msg_box').show();
		$('#box_name').html(data.nick);




	});
	
	$(document).on("keypress","#input_text_don",function(e){
		if (e.keyCode == 13) {
			var ng_gui =change_alias($('#username_title').text());
			var msg = $(this).val();
			var name = $(this).attr("name");
			var srt= '#box_name_'+name;
			
			socket.emit('send message', msg, $(srt).text());
			socket.emit('lưu tin nhắn chat đơn',{sendto:ng_gui,nd:msg,to:name});
			$(this).val('');
			
		}
	});
	$(document).on("click","#input_text_don",function(e){
		
			var name = $(this).attr("name");
			
			var str3='#tb_mes_'+name;
			html ='<img src="img/user.jpg" style="width:50px;height:50px;border-radius: 50%">';
			$(str3).html(html);
			var title =$('#username_title').text();
			$('#title_box').html(title);
	});
	$('#input_text_server').keypress(function(e){
    	// e.preventDefault();

			if (e.keyCode == 13) {
				var msg = $(this).val();
				$(this).val(null);
				socket.emit('client send message chat server', msg);
				
			}
	});
	// bấm vào nút cài đặt
	$('#btn_setting').click(function(){
		$('.list_ol').toggleClass('setting');
		$('.setting_box').toggleClass('them_setting_box');
	});

	$('#close_form_info').click(function(){
		$('.list_ol').toggleClass('setting');
		$('#box_chat_room').toggleClass('setting');
		$('.setting_box').toggleClass('them_setting_box');
	});
	// bấm vào thay đổi thông tin
	$('#btn_setting_info').click(function(){
		var pass_old_none = $('#info_txt_pass_old_none').val();// lấy giá trị của mk cũ 
		var name = $('#info_txt_name').val();
		var name_kd =change_alias(name);
		var pass_old = $('#info_txt_pass_old').val();
		var pass_new = $('#info_txt_pass_new').val();
		var id = $('#info_name_id').text();
		var count= pass_new.length;
		
		if(pass_old_none!=pass_old){
			alert('Mật khẩu cũ chưa chính xác..vui lòng kiểm tra lại !!!');
			$('#info_txt_pass_old').val('');
		}else {
			if(pass_new==pass_old){
				alert('Mật khẩu mới trùng với mật khẩu cũ !!!');
				socket.emit("update_info",{id:id ,name:name,name_kd:name_kd,pass:pass_new});
			}else if(count<=4){
				alert('Mật khẩu mới bắt buộc nhiều hơn 4 kí tự !!!');
			}
			else{
				
					socket.emit("update_info",{id:id ,name:name,name_kd:name_kd,pass:pass_new});
			}
		}
	});
	$('#btn_chat_room').click(function(){
		$('#box_chat_room').show();
		$('#box_list_ol').hide();
	});
	$('#btn_chat_don').click(function(){
		$('#box_chat_room').hide();
		$('#box_list_ol').show();
	});
	// $('.chat_ro').click(function(){
	// 	var name = $(this).attr("name");
	// 	var st= '#chat_don_'+name;
	// 	$('#chat_server').hide();
	// 	$('#chat_don_box').show();
	// 	$(st).css('display','block');
		
	// });
	socket.on('update_ok',function(data){
		

		var resuft =confirm("Cập nhật thành công..Vui lòng đăng nhập lại !!!");
		if(resuft==true){
			$('#info_name_title').html(data.name);
			$('.list_ol').toggleClass('setting');
			$('.setting_box').toggleClass('them_setting_box');

			var name ='<b>'+data.name+'</b>'
			$('#username_title').html(name);
			
			$('#title_box').html('Humg chatbox - Kết nối sinh viên trường Đại Học Mỏ Địa Chất Hà Nội');

			$('#info_txt_pass_old_none').val(data.pass);
			socket.emit('logout');
			$('#layout_login').show(1000);
			$('#layout_chat').hide(1500);
		}else{
			$('#info_name_title').html(data.name);
			$('.list_ol').toggleClass('setting');
			$('.setting_box').toggleClass('them_setting_box');

			var name ='<b>'+data.name+'</b>'
			$('#username_title').html(name);
			
			$('#title_box').html(data.name);

			$('#info_txt_pass_old_none').val(data.pass);
			socket.emit('logout');
			$('#layout_login').show(1000);
			$('#layout_chat').hide(1500);
		}
	});
	socket.on('server send message to client',function(data){
		html='<div class="mes_me_box"><div class="mes_me_ctn"><span class="txt_mes_me">'+data+' </span></div></div>';
		$('#mes_space_server').append(html);
		$('#mes_space_server').scrollTop($('#mes_space_server')[0].scrollHeight);

	});

	socket.on('server send all',function(data){
		html='<div class="mes_client_box"><div class="name_client"><span class="txt_mes_client">'+data.nick+'</span></div><div class="mes_ctn"><div class="avt_client_box"><img src="img/user.jpg" class="avt_client"></div><div class="mes_ctn_txt"><span class="txt_mes_ctn">'+data.msg+'.</span></div></div></div>';
		$('#mes_space_server').append(html);
		$('#mes_space_server').scrollTop($('#mes_space_server')[0].scrollHeight);
	});

	socket.on('tin-nhan-gui-ve-chinh-no', function(data){
		
			var str = change_alias(data.sendto);
			var str2= '#mes_space_'+str;
			var html='<div class="mes_me_box"><div class="mes_me_ctn fix4"><span class="txt_mes_me">'+data.msg+'</span></div></div>';
			$(str2).append(html);
			$(str2).scrollTop($(str2)[0].scrollHeight);
	});
	socket.on('tin-nhan-gui-cho-ng-nhan', function(data){
		
		var str = change_alias(data.nick);
		var str2= '#mes_space_'+str;
		var str3='#tb_mes_'+str;
		html='<div class="mes_client_box"><div class="name_client"><span class="txt_mes_client">'+data.nick+'</span></div><div class="mes_ctn"><div class="avt_client_box"><img src="img/user.jpg" class="avt_client"></div><div class="mes_ctn_txt fix3"><span class="txt_mes_ctn">'+data.msg+'</span></div></div></div>';
		
		
		tb='<img src="img/user.jpg" style="width:50px;height:50px;border-radius: 50%"><div class="mes_num"><a href="#"><span class="badge mes_num_style">1</span></a></div>';
		if($('#username_title').text()==data.sendto){
			$(str3).html(tb);
			$(str2).append(html);
			$('#title_box').html(data.nick+" vừa nhắn tin cho bạn !!!");
		}
		
		$(str2).scrollTop($(str2)[0].scrollHeight);
});
	
});


