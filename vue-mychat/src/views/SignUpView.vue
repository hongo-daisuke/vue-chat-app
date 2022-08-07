<template>
  <v-app id="inspire">
    <div class="login-box">
      <v-card class="login-form">
        <v-card-title class="login-title">SiguUp</v-card-title>
        <v-card-subtitle>ユーザー情報を入力してください。</v-card-subtitle>
        <v-btn text color="light-blue" to="login">ログインはこちら</v-btn>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >

          <v-text-field
          v-model="name"
          :rules="nameRules"
          label="userName"
          required
          ></v-text-field>

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
          ></v-text-field>

          <v-btn
          color="success"
          class="login-btn"
          @click="submit"
          :disabled="isValid">
            SIGN UP
          </v-btn>

          <v-btn
          @click="clear">
            CLEAR
          </v-btn>
          <v-alert
            dense
            outlined
            type="error"
            class="error-message"
            v-if="errorMessage"
          >
            {{ errorMessage }}
          </v-alert>
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
    name: '',
    nameRules: [
      v => !!v || '名前を入力してください。',
      v => (v && v.length <= 15) || '名前は15文字以内で入力してください。',
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください。',
      v => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません。',
    ],
    password: '',
    errorMessage: ''
  }),
  methods: {
    submit: function () {
      // ログイン処理
      firebase.auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then( async (result) => {
        console.log('success', result)
        await result.user.updateProfile(
          {displayName: this.name}
        );

        // ユーザー情報をセッションで保存
        const auth = {
          displayName: result.user.displayName,
          email: result.user.email,
          userId: result.user.uid,
          refreshToken: result.user.refreshToken,
          photoURL: result.user.photoURL
        }

        sessionStorage.setItem('user', JSON.stringify(auth))

        // ユーザー登録に成功した場合はログインページにリダイレクト
        // TODO : ログイン成功後はルーム一覧に飛ばすようにする
        this.$router.push('/')

      })
      .catch((error) => {
        console.log('error', error)
        // エラーメッセージを表示
        this.errorMessage = 'ユーザーの新規作成に失敗しました。'

      })
    },
    // クリアボタン押下時
    clear: function(){
      this.name = ''
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

.error-message{
  margin-top: 20px;
}
</style>
