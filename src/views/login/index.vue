<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getKaptcha } from "@/api/home/index.ts";
import { encryptSha256 } from "@/utils/encrypt.ts";
import { setToken } from '@/utils/auth.ts';
import { showLoading,closeLoading } from "@/utils/loading.ts";
import { loginWithVerifyCode } from "@/api/auth/index.ts";
import type { LoginVerifyCodeDTO, TokenPair } from "@/api/auth/type.ts";
const router = useRouter();

/**
 * 获取当前年份
 */
const nowYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  let now = '';
  if(year > 2021){
    now = `-${year}`;
  }
  return now;
};

/**
 * 获取验证码
 */
const dataKaptcha = ref({
  uuid: '',
  img: ''
});
const getKaptchaCode = async () => {
  showLoading();
  const res = await getKaptcha();
  if (res.code === 0) {
    dataKaptcha.value = res.result;
  }
  closeLoading();
};

/**
 * 登录
 */
const userName = ref('');
const password = ref('');
const captcha = ref('');
const login = async () => {
  if (userName.value === "" || password.value === "" || captcha.value === ""){
    ElMessage({
      type: 'warning',
      message: "输入不完整,登录失败!",
      duration: 2000
    });
  }else {
    const encryptPassword = encryptSha256(password.value);
    const data: LoginVerifyCodeDTO = {
      username: userName.value,
      password: encryptPassword,
      verifyCode: captcha.value,
      uuid: dataKaptcha.value.uuid
    };
    const { code, result } = await loginWithVerifyCode(data);
    if (code === 0 && result) {
      ElMessage({
        type: 'success',
        message: "登录成功~",
        duration: 2000
      });
      const tokenPair: TokenPair = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      };
      setToken(tokenPair);
      await router.push({ path: '/main' });
    }

  }
};

const goGithub = () => {
  window.open('https://github.com/yang-jiacheng', '_blank');
};

onMounted(async () => {
  await getKaptchaCode();
});
</script>

<template>
  <div class="container">
    <div class="login-container">
      <div class="login-title ">云自习后台</div>

      <div class="form-group">
        <img class="icon-img" style="height: 17px;" src="https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/static/images/user.png" />
        <input type="text" v-model="userName" autocomplete="off" class="form-control" placeholder="请输入帐号">
      </div>

      <div class="form-group">
        <img class="icon-img"  style="height: 20px;" src="https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/static/images/password.png" />
        <input type="password" v-model="password" autocomplete="off" class="form-control" placeholder="请输入密码">
      </div>

      <div class="form-group captcha-group">
        <img style="height: 17px;position: relative;top: 32px;left: 12px;" src="https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/static/images/captcha.png" />
        <div class="captcha-inline">
          <input type="text" v-model="captcha" autocomplete="off" class="form-control" placeholder="请输入验证码">
          <img id="captchaImg" :src="dataKaptcha.img  ? `data:image/jpg;base64,${dataKaptcha.img}` : ''" @click="getKaptchaCode()" class="captcha-image" />
        </div>
      </div>

      <button class="login-btn" id="submit" @click="login()">立即登录</button>

      <div class="footer">
        <div>© 2021<span >{{ nowYear() }}</span> By <span class="copyright " @click="goGithub">jiacheng yang.</span> All right reserved</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: PangMenZhengDao;
  src: url(@/assets/font/pangmen.ttf)
}
.container {
  width: 100%;
  height: 100vh;
  font-family:  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  background-image: url(https://selfstudy-server.oss-cn-hangzhou.aliyuncs.com/static/images/login-bg-4.jpg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  min-width: 450px;
  padding: 25px 50px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background-color: rgba(255,255,255,.075);
  backdrop-filter: blur(5px); /* 毛玻璃模糊效果 */
  /*border: 1px solid rgba(255, 255, 255, 0.1);*/
}

.login-title {
  font-family: PangMenZhengDao !important;
  text-align: center;
  font-size: 28px;
  margin-top: 5px;
  font-weight: bold;
  color: #eee6e6;
}

.form-group {
  /*margin-bottom: 15px;*/
}
.icon-img{
  position: relative;
  top: 32px;
  left: 10px;
}
.form-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #ffffff;
}

.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  height: 38px;
  padding: 0 10px;
  font-size: 14px;
  background-color: rgba(255,255,255,.075);
  border: 1px solid rgba(255,255,255,.075);
  border-radius: 4px;
  outline: none;
  /**color: #29323c;*/
  color: #1b2126;
}

input::placeholder {
  color: rgba(255, 255, 255, .85);
  /*opacity: 1;*/
}

/* 验证码图片示例，可以用真实的验证码接口替换 */
.captcha-image {
  width: 120px;
  max-height: 38px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 4px;
  background-color: #33cabb;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.2s linear;
}

.login-btn:active  {
  background-color: #2ba99d!important; /* 背景颜色变为更深的绿色，优先级最高 */
  -webkit-box-shadow: none;           /* 移除Webkit浏览器的阴影 */
  box-shadow: none;                   /* 移除阴影 */
}

.login-btn:hover {
  background-color: #52d3c7;
}
.footer {
  margin: 20px auto 15px auto;
  text-align: center;
  font-size: 13px;
  color: #ffffff;
}
.copyright {
  color: #ade0e3;
  transition: 0.2s linear;

}
.copyright:hover {
  color: #183332;
  cursor: pointer;
}
.form-control {
  transition: 0.2s linear;
  box-shadow: none;
  padding-left: 36px !important
}
.form-control:focus {
  border-color: #33cabb;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(51, 202, 187, .6);
}
.captcha-inline {
  display: flex;
  align-items: center;
}

.captcha-inline input[type="text"] {
  flex: 1;                 /* 输入框自适应宽度 */
  margin-right: 10px;      /* 右边留点间距给验证码图片 */
}

</style>
