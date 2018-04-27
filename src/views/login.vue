<!--
/**
 * =============================================================================
 *  Login 登录
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-24
 *
 */
-->

<template>
  <section class="page">

    <div class="box">

      <h2>办公管理系统</h2>

      <el-form ref="form" label-width="50px"
        :model="form" :rules="rules" @submit.native.prevent="submitForm">
        <el-form-item label="账号" prop="userID">
          <el-input v-model="form.userID"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input type="password" v-model="form.userPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.autologin" label="自动登录"></el-checkbox>
          <button type="submit" class="el-button pull-right el-button--primary">　登录　</button>
        </el-form-item>
      </el-form>

    </div>

  </section>
</template>


<script>
  import { login as SERVICE_login } from "service";
  export default {
    data: () => ({
      form: {
        userID: "",
        userPassword: "",
        autologin: true,
      },
      rules: {
        userID: [{ required: true, message: "请输入账号" }],
        userPassword: [{ required: true, message: "请输入密码" }],
      },
    }),
    methods: {
      submitForm () {
        this.$refs["form"].validate(valid => {
          if (!valid) { return false; }
          SERVICE_login(this.form.userID, this.form.userPassword, this.form.autologin ? "ON" : "", json => {
            if (/history\.go\(-1\)/m.test(json)) {
              this.$message.error("登录失败");
            } else {
              this.$router.replace("/");
            }
          });
        });
      },
    },
  };
</script>


<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .box {
    display: block;
  }
    h1 {
      margin-top: -1em;
    }
</style>
