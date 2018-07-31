<!--
/**
 * @author dondevi
 * @create 2018-06-21
 */
-->

<template>
  <section class="row window-height items-center justify-center">
    <main class="shadow-3">
      <h2>订餐系统</h2>
      <form @submit.prevent="login">
        <q-field label="账号" :error="$v.form.username.$error">
          <q-input v-model="form.username" /> </q-field>
        <q-field label="密码" :error="$v.form.password.$error">
          <q-input v-model="form.password" type="password" /> </q-field>
        <q-field label=" ">
          <q-btn type="submit" color="primary">登录</q-btn>
        </q-field>
      </form>
    </main>
  </section>
</template>


<script>
  import { required } from "vuelidate/lib/validators";
  export default {
    data: () => ({
      form: {
        username: "",
        password: "",
      },
    }),
    validations: {
      form: {
        username: { required },
        password: { required },
      },
    },
    methods: {
      login () {
        this.$v.form.$touch();
        if (this.$v.form.$error) { return; }
        this.$service.auth.login(this.form).then(data => {
          this.$session.user = data;
          this.$q.notify({ type: "positive", message: "登录成功" });
          this.$router.replace("/");
        });
      },
    },
  };
</script>


<style scoped>
  section {
    background: url(~assets/cool-background.png) no-repeat;
    background-size: cover;
  }
  main {
    max-width: 80%;
    padding: 25px 50px;
    background-color: rgba(255,255,255,0.93);
  }
  h2 {
    margin: 10px 0 40px;
    font-size: 30px;
    text-align: center;
  }
</style>
