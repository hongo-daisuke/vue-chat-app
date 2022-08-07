<template>
  <v-navigation-drawer
      v-model="drawer"
      app
  >
    <v-sheet
        color="grey lighten-4"
        class="pa-4"
    >
      <v-avatar color="indigo">

        <input type="file"
               ref="fileInput"
               accept="image/*"
               style="display:none"
               @change="updateIcon">

        <v-icon dark
                @click="changeIcon"
                v-if="!photoUrl"
                >
          mdi-account-circle
        </v-icon>

        <img :src="photoUrl"
              alt=""
              @click="changeIcon"
              v-if="photoUrl"
              >

      </v-avatar>

      <div class="username">{{ auth && auth.displayName }}</div>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item
        v-for="[icon, text, to] in links"
        :key="icon"
        :to="to"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item-content>

      </v-list-item>

      <v-list-item @click="logout">

        <v-list-item-icon>
          <v-icon color="blue">mdi-logout</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>

      </v-list-item>

<CreateRoom/>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
import firebase from '@/firebase/firebase'
import CreateRoom from '@/components/modal/CreateRoom'
export default {
  components: {
    CreateRoom
  },
  // Vueインスタンスがマウントされてから実行される(DOMが生成された直度)
  mounted: function() {
    // セッションよりログイン情報の取得
    this.auth = JSON.parse(sessionStorage.getItem('user'))
    // セッションの画像URLをセット
    this.photoUrl = this.auth.photoURL
  },
  data: () => ({
    drawer: null,
    // TODO : サイドメニューに機能を持たせる
    links: [
      ['mdi-inbox-arrow-down', 'Inbox', '/'],
      ['mdi-send', 'Send', '/about'],
      ['mdi-delete', 'Trash', '/about'],
      ['mdi-alert-octagon', 'Spam', '/about'],
    ],
    auth:'',
    photoUrl:'',
  }),
  methods: {
    logout: function () {
      firebase.auth()
        .signOut()
      .then((result) => {
        console.log('success', result)
        localStorage.message = 'ログアウトしました。'

        // ログアウト後はログイン画面に遷移させる
        this.$router.push('/login')
      })
      .catch((error) => {
        console.log('error', error)
      })
    },
    changeIcon: function(){
      // changeIconメソッドが走ると$refsを指定しているタグを取得しクリックメソッドを実行
      this.$refs.fileInput.click()
    },
    updateIcon: function(){
      // firebaseに登録されているユーザー情報を取得
      const user = this.getAuth()
      if(!user){
        sessionStorage.removeItem('user')
        this.$router.push('/login')
      }

      // ファイル名とfirebase内のアップロードパスを設定
      const file = this.$refs.fileInput.files[0]
      const filePath = `/user/${file.name}`

      // firebaseにアップロード
      firebase.storage().ref().child(filePath).put(file)
        .then( async snapshot => {

          // アップロードした画像のURLを取得
          const photoUrl = await snapshot.ref.getDownloadURL()

          // プロフィール画像を更新する
          firebase.auth().onAuthStateChanged((user)=>{
            if(user){
              user.updateProfile({
                photoURL: photoUrl
              })
              // セッションの更新
              this.auth.photoURL = photoUrl
              sessionStorage.setItem('user', JSON.stringify(this.auth))

              // 表示情報の更新
              this.photoUrl = photoUrl
            }
          })


        });
    },
    getAuth: function(){
      return firebase.auth().onAuthStateChanged((user)=>{
        return user
      })
    }
  }
}
</script>