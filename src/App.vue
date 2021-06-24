<template>
  <v-app>
    <v-content>
      <v-container @keyup.enter="login" grid-list-xs text-xs-center fill-height v-if="hasLogin === false">
        <v-layout row wrap>
          <v-flex xs12 class="mt-5">
            <div class="title">网络剪切板</div>
            <div class="sub-title">多终端同步文字信息, 最多50条</div>
            <div class="sub-title">输入剪切板名称: public，密码: public，可以进行留言</div>
            <div class="sub-title">可以进行留言</div>
            <div class="sub-title">
              <a href="http://fir.akawa.ink/onlinecb" target="_blank">Android客户端</a>&nbsp;&nbsp;
              <a href="https://apps.apple.com/us/app/%E7%BD%91%E7%BB%9C%E5%89%AA%E5%88%87%E6%9D%BF/id1485974770" target="_blank">iOS客户端</a>&nbsp;&nbsp;
              <a href="https://github.com/ety001/online-clipboard/blob/master/README.md#cli%E7%AB%AF" target="_blank">Cli端</a>&nbsp;&nbsp;
            </div>
          </v-flex>
          <v-flex xs12 md4 sm4 offset-sm4 offset-md4 class="mt-2">
            <v-text-field
              autofocus
              label="剪切板名字"
              v-model="cbName"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md4 sm4 offset-sm4 offset-md4>
            <v-text-field
              label="剪切板密码"
              type="password"
              v-model="cbPass"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 offset-xs3 md2 sm2 offset-sm5 offset-md5>
            <v-btn
              block
              color="info"
              @click="login"
              :disabled="loginBtnDisable"
            >登录</v-btn>
          </v-flex>
          <v-flex xs6 offset-xs3 md2 offset-md5 class="mt-2" v-if="isLogining === true">
            <v-progress-circular
              :size="20"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-flex>
          <v-flex xs12 class="caption mt-5">
            <a href="https://akawa.ink" target="_block">我的博客</a> | 
            <a href="https://akawa.ink/donate/" target="_block">捐助</a> |
            <a href="https://github.com/ety001/online-clipboard" target="_block">源码</a>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container grid-list-xs fill-height v-if="hasLogin === true" class="clip-page">
        <v-layout row class="">
          <v-flex xs12>
            <div id="board" class="board pa-3" v-chat-scroll="{always: false, smooth: true}">
              <div class="mt-3" v-for="(m,i) in msg" v-bind:key="i">
                <code
                  class="code"
                  v-html="m"
                  @click="doCopy(m)"
                ></code>
              </div>
            </div>
            <div class="mt-4">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-textarea
                    solo
                    v-model="inputMsg"
                    @keyup.ctrl.enter="send"
                    placeholder="输入内容, 按 Ctrl + Enter 或者 Command + Return 发送, 最多支持50条记录."
                    autofocus
                    no-resize
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-btn block color="info" @click="send">
                    发送
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-snackbar
      v-model="snackbarSuccess"
      :top="true"
      :vertical="false"
      :multi-line="false"
      :color="'success'"
      :timeout="2000"
    >
      复制成功
    </v-snackbar>
    <v-snackbar
      v-model="snackbarFail"
      :top="true"
      :vertical="false"
      :multi-line="false"
      :color="'danger'"
      :timeout="2000"
    >
      复制失败
    </v-snackbar>
  </v-app>
</template>

<script>
const decode = require('unescape');
const hostname = window.location.host;
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      hasLogin: false,
      loginBtnDisable: false,
      wsUrl : `${protocol}://${hostname}/ws`,
      cbName: null, // clipboard name
      cbPass: null, // clipboard pass
      ws: null,
      msg: [],
      inputMsg: null,
      isLogining: false,
      interval: null,
      thingsToCopy: null,
      snackbarSuccess: false,
      snackbarFail: false,
    }
  },
  created(){
    this.doLogin();
    let that = this;
    window.onhashchange = function(event){
      window.location.href = event.newURL;
      that.doLogin();
    }
  },
  methods: {
    login() {
      if (this.cbName === null || this.cbPass === null) return;
      if(this.ws) this.ws.close();
      this.ws = new window.WebSocket(`${this.wsUrl}/${this.cbName}/${this.cbPass}`);
      this.ws.onopen = this.onopen;
      this.ws.onmessage = this.onmessage;
      this.ws.onclose = this.onclose;
      this.ws.onerror = this.onerror;
      this.isLogining = true;
      this.loginBtnDisable = true;
      document.location.hash = "/" + this.cbName + "/" + this.cbPass;
    },
    doLogin() {
      if(document.location.hash !== "" || document.location.hash !== "#/"){
        var arr = document.location.hash.split("/");
        this.cbName = arr[1];
        this.cbPass = arr[2];
        if(this.cbName !== undefined && this.cbPass !== undefined) {
          this.login();
        }
      }
    },
    onopen() {
      this.msg = [];
      this.isLogining = false;
      this.hasLogin = true;
      this.loginBtnDisable = false;
      this.interval = setInterval(() => {
        this.ws.send(JSON.stringify({type:'ping',msg:'ping'}));
      }, 10000);
    },
    onmessage(evt) {
      const m = JSON.parse(evt.data);
      switch(m.type) {
        case 'all':
          if(m.data === true)return;
          this.msg = m.data;
          break;
        case 'single':
          this.msg.push(m.data);
          break;
      }
    },
    onclose(evt) {
      this.hasLogin = false;
      this.msg = [];
      clearInterval(this.interval);
      this.interval = null;
      // eslint-disable-next-line
      console.log('onclose', evt);
    },
    onerror(evt) {
      this.hasLogin = false;
      this.msg = [];
      clearInterval(this.interval);
      this.interval = null;
      // eslint-disable-next-line
      console.log('onclose', evt);
    },
    send() {
      if(this.inputMsg) {
        this.ws.send( JSON.stringify( {type: "message",msg: this.inputMsg} ) );
        this.inputMsg = null;
      }
    },
    doCopy(m) {
      this.$copyText(decode(m)).then((e) => {
        this.snackbarSuccess = true;
      }, (e) => {
        this.snackbarFail = true;
      });
    },
  },
}
</script>

<style>
  .clip-page {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .clip-box {
    overflow: hidden;
  }
  .board {
    background-color: #fff;
    overflow: scroll;
    height: calc(100% - 210px);
  }
  .sub-title {
    margin-top: 20px;
    color: #666;
  }
</style>

