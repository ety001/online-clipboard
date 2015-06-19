var App = {
    cb_name : null,
    cb_pass : null,
    ws : null,

    init : function(cb_name, cb_pass, ws_url){
        App.cb_name    = cb_name;
        App.cb_pass    = cb_pass;
        App.ws             = new WebSocket(ws_url + cb_name + '/' + cb_pass);
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
        console.log(evt, d, m);
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
    },

    onclose : function(evt){
        $('#login_face').show();
        $('.list').hide();
        $('nav').hide();
        $('#screen').html('');
    },
    
    onerror : function(evt){
        $('#login_face').show();
        $('.list').hide();
        $('nav').hide();
        $('#screen').html('');
        console.log('onerror',evt);
    },

    sendmsg : function(msg){
        if(!App.ws)return;
        App.ws.send(msg);
    },

    send : function(){
        var msg     = $('#clip_content').val();
        App.sendmsg( JSON.stringify( {type: "message",msg: msg} ) );
        $('#clip_content').val('');
    }
}

$(function(){
    var cb_name, cb_pass;
    $('#login').click(function(){
        cb_name     = $('#cb_name').val()?$('#cb_name').val():null;
        cb_pass     = $('#cb_pass').val()?$('#cb_pass').val():null;
        if(!cb_name || !cb_pass){
            $('#err').html('Please input clipboard name or clipboard password.').show();
            return;
        }
        var ws_url      = 'ws://localhost:8080/';
        App.init(cb_name, cb_pass, ws_url);
        $('#login_face').hide();
        $('.list').show();
        $('nav').show();
    });

    $('#btn-submit').click(App.send);
    $('#clip_content').keydown(function(e){
        if(e.keyCode==13){
            App.send();
        }
    });
});