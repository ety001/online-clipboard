var App = {
    ws_url : 'wss://oc-server.to0l.cn/',
    cb_name : null,
    cb_pass : null,
    ws : null,
    has_login : false,

    init : function(cb_name, cb_pass){
        App.cb_name    = cb_name;
        App.cb_pass    = cb_pass;
        App.ws             = new WebSocket(App.ws_url + cb_name + '/' + cb_pass);
        App.ws.onopen      = App.onopen;
        App.ws.onmessage   = App.onmessage;
        App.ws.onclose     = App.onclose;
        App.ws.onerror     = App.onerror;
    },

    onopen : function(evt){
        $('#screen').html('');
        //console.log('onopen', evt);
    },

    onmessage : function(evt){
        var d = evt.data;
        var m = JSON.parse(d);
        switch(m.type){
            case 'all':
                if(m.data==true)return;
                var html_tmp = '';
                for(var i in m.data){
                    html_tmp += '<pre>' + m.data[i] + '</pre>';
                }
                $('#screen').html( $(html_tmp) );
                break;
            case 'single':
                $('#screen').append( $('<pre>' + m.data + '</pre>') );
                break;
        }
        $('html, body').animate({scrollTop: $(document).height()}, 'fast');
        $('#clip_content').val(null);
    },

    onclose : function(evt){
        $('#login_face').show();
        $('.list').hide();
        $('nav').hide();
        $('#screen').html('');
        App.has_login   = false;
    },
    
    onerror : function(evt){
        $('#login_face').show();
        $('.list').hide();
        $('nav').hide();
        $('#screen').html('');
        App.has_login   = false;
        console.log('onerror',evt);
    },

    sendmsg : function(msg){
        if(!App.ws)return;
        App.ws.send(msg);
    },

    send : function(){
        var msg     = $('#clip_content').val();
        if(msg==='')return;
        App.sendmsg( JSON.stringify( {type: "message",msg: msg} ) );
    }
}

$(function(){
    var cb_name, cb_pass, ctrl_key=false;
    
    if(!window.WebSocket){
        alert('Sorry, your browser does not support WebSocket.');
    }

    if(App.has_login==true){
        $('#clip_content').focus();
    } else {
        $('#cb_name').focus();
    }

    var login_func  = function(){
        cb_name     = $('#cb_name').val()?$('#cb_name').val():null;
        cb_pass     = $('#cb_pass').val()?$('#cb_pass').val():null;
        if(!cb_name || !cb_pass){
            $('#err').html('Please input clipboard name or clipboard password.').show();
            return;
        }
        
        App.init(cb_name, cb_pass);
        App.has_login   = true;
        $('#login_face').hide();
        $('.list').show();
        $('nav').show();
        $('#clip_content').focus();
    }

    $('#login').click(login_func);

    $('#btn-submit').click(App.send);
    $('#cb_name,#cb_pass').keydown(function(e){
        if(e.keyCode==13){
            login_func();
        }
    });
    $('#clip_content').keyup(function(e){
        if(e.keyCode==17){
            ctrl_key    = false;
        }
    });
    $('#clip_content').keydown(function(e){
        if(e.keyCode==17){
            ctrl_key    = true;
        }
        if(ctrl_key && e.keyCode==13){
            App.send();
        }
    });
});
