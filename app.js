var express = require("express");
var app = express();
var mysql = require('mysql');
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
users = {};
listmasv = [];
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(1996);
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demo_chat',
});
app.get("/",function(req,res){
	con.query("SELECT * FROM `mess`",function(err,results,fields){
		if(err) throw err;
		res.render("index111",{results});
		
	});
	
});
io.sockets.on('connection', function(socket){
	socket.on('new user', function(sv, data){
		mk = sv.pass
		
		sql="SELECT * FROM `user` WHERE masv ='"+sv.msv+"' AND `pass`='"+mk+"'";
		con.query(sql,function(err,rows){
			if(err) throw err;
			var dem= 0;
			rows.forEach(function(results){
				dem ++;
			});
			if(dem==0){
				data(false);
			}else{
				rows.forEach(function(results){
					data(true);
					socket.nickname = results.name;
					users[socket.nickname] = results.name;
					

					
					
					socket.emit('sucsest',{id:results.id, name:results.name, pass: results.pass});
					io.sockets.emit('sucsest all',results.name);
					
					updateNickNames();
				});
				
			}
		});
		

		

	});

	/// đăng ký
	socket.on('dang-ky-tai-khoan', function(sv, data){
		
		
		sql="SELECT * FROM `user` WHERE masv ='"+sv.msv+"' OR `name`='"+sv.name+"'";
		con.query(sql,function(err,rows){
			if(err) throw err;
			var dem= 0;
			rows.forEach(function(results){
				dem ++;
			});
			if(dem==0){
				
				sql="INSERT INTO `user`(`name`, `name_khong_dau`, `masv`, `pass`, `sex`) VALUES ('"+sv.name+"','"+sv.name_kd+"','"+sv.msv+"','"+sv.pass+"',"+sv.sex+")";
				con.query(sql,function(err,results,fields){
					if(err) throw err;
					console.log("Đăng ký thành công !!!");
					data(true);
					socket.emit('dang-ky-thanh-cong',{name:sv.msv,pass:sv.pass});
				});
					
				
			}else{
				data(false);
			}
		});
		
		
		

	});

	
	function updateNickNames(){
		
		io.sockets.emit('usernames', Object.keys(users));
		io.sockets.emit('list-user',Object.keys(users));
	}
	socket.on('lay_data',function(data){
		sql="SELECT * FROM `mess_client` WHERE `from` = '"+data.sendto+"' AND `to` ='"+data.todo+"' OR `from` ='"+data.todo+"' AND `to` = '"+data.sendto+"'";
		con.query(sql,function(err,results,fields){
			if(err) throw err;
			socket.emit('tra_tin_nhan',results);
			
		});
		
	});
	socket.on('lưu tin nhắn chat đơn',function(data){
		var data_query = {
			
			'from' 		: data.sendto,
			'content' 	: data.nd,
			'to'		:data.to,
			'time' 		: new Date()
			
			};
		con.query("INSERT INTO mess_client SET ?",data_query, function() {
			
			console.log('insert ok');
		});
	});
	socket.on('update_info',function(data){
		sql='UPDATE `user` SET `name`="'+data.name+'",`pass`='+data.pass+',`name_khong_dau`="'+data.name_kd+'" WHERE `id`='+data.id;
		con.query(sql,function(err,rows){
			if(err) throw err;
			socket.emit('update_ok',{name:data.name, pass:data.pass});
			
	});
			
		
		
		
	});
	
	socket.on('open-chatbox', function(data){
		users[data].emit('openbox', {nick: socket.nickname});
	});
	socket.on('client send message chat server',function(data){
		socket.emit('server send message to client', data );
		socket.broadcast.emit('server send all',{msg:data,nick:socket.nickname});
		var data_query = {
			
			'ten' 		: socket.nickname,
			'noidung' 	: data,
			'time' 		: new Date()
			
			};
		con.query("INSERT INTO mess SET ?",data_query, function() {
			
			console.log('insert ok');
		});
	});

	socket.on('send message',function(data, sendto){
		
		 socket.emit('tin-nhan-gui-ve-chinh-no',{msg:data,nick:socket.nickname,sendto:sendto});
		socket.broadcast.emit('tin-nhan-gui-cho-ng-nhan',{msg:data,nick:socket.nickname,sendto:sendto});
		
		
	});
	socket.on('disconnect', function(data){
		if (!socket.nickname) return;
		delete users[socket.nickname];
		
		updateNickNames();

	});
	socket.on('logout', function(data){
		if (!socket.nickname) return;
		delete users[socket.nickname];
		
		updateNickNames();

	});
	
});



