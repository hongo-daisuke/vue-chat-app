<template>
  <v-app id="inspire">
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-title">Login</v-card-title>
        <v-card-subtitle>ユーザー情報を入力してください。</v-card-subtitle>
        <v-btn text color="light-blue" to="signup">新規登録はこちら</v-btn>
        <v-alert
          dense
          text
          type="success"
          class="success-message"
          v-if="message"
        >
          {{ message }}
        </v-alert>

        <v-alert
          dense
          outlined
          type="error"
          class="error-message"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </v-alert>

        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
          ></v-text-field>

          <v-text-field
          v-model="password"
          type="password"
          label="password"
          required
          ></v-text-field>

          <v-btn
          color="success"
          class="login-btn"
          @click="submit"
          :disabled="isValid">
            LOGIN
          </v-btn>

          <v-btn
          @click="clear">
            CLEAR
          </v-btn>

        </v-form>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import firebase from '@/firebase/firebase'
export default {
  data: () => ({
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください。',
      v => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません。',
    ],
    password: '',
    message: '',
    errorMessage: ''
  }),
  methods: {
    submit: function(){
      firebase.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {

          // ユーザー情報をセッションで保存
          const auth = {
            displayName: result.user.displayName,
            email: result.user.email,
            userId: result.user.uid,
            refreshToken: result.user.refreshToken,
            photoURL: result.user.photoURL
          }

          sessionStorage.setItem('user', JSON.stringify(auth))


          // ユーザー登録に成功した場合はTOPページにリダイレクト
          this.$router.push('/')
        })
        .catch((error) => {
          console.log('error', error)
          this.errorMessage = 'ログインに失敗しました。'
        })
    },
    // クリアボタン押下時
    clear: function(){
      this.email = ''
      this.password = ''
      this.$refs.form.reset()
    },
  },
  // computed内で使用されているデータが変更されたら変更を検知して処理を再度実行
  computed: {
    isValid: function(){
      return !this.valid;
    }
  },
  // Vueインスタンスがマウントされてから実行される(DOMが生成された直度)
  mounted: function() {
    // ログインメッセージの表示
    if(localStorage.message){
      this.message = localStorage.message
      localStorage.message = ''
    }
  },
}
</script>

<style scoped>
.login-form {
    margin: 150px;
    padding: 30px;
}

.login-box {
    width: 50%;
    margin: 0px auto;
    padding: 30px;
}

.login-title {
    display: inline-block;
}

.login-btn {
    margin: 20px;
}

.success-message{
  margin-bottom: 20px;
}

.error-message{
  margin-top: 20px;
}
</style>