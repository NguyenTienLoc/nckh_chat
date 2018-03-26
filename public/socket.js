$(document).ready(function(){
    var socket = io.connect();
    $('#layout_chat').hide();
    $('#btn-login').click(function(){
        
        socket.emit('new user', $('#txt_email').val(), function(data){
            if (data){
                $('#layout_login').hide(1000);
                $('#layout_chat').show(1500);

            }else{
                alert('Tài khoản trên đã được sử dụng');

                $('#txt_email').val('');
            }
        });
        $('#txt_email').val('');

    });
    socket.on('usernames', function(data){
        console.log(data);
        var html = '';
            for (i=0; i<data.length; i++){
            html +='<div class="user" name="'+ data[i]+'">'+ data[i]+'</div>';
            }

            console.log(html);
            $('.chat_body').html(html);
            usernameClick();
    });
});