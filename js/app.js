var App = function(){
    this.cb_name    = null;
    this.cb_pass    = null;
    this.init = function(cb_name, cb_pass){
        this.cb_name    = cb_name;
        this.cb_pass    = cb_pass;
    }
}

$(function(){
    var app         = new App();
    var cb_name     = $('#cb_name')?$('#cb_name'):null;
    var cb_pass     = $('#cb_pass')?$('#cb_pass'):null;
    if(!cb_name || !cb_pass){
        $('#err').html('Please input clipboard name or clipboard password.').show();
        return;
    }
    app.init(cb_name, cb_pass);
});