<template>
  <v-app id="inspire">
    <SideBarMenu/>
    <v-main>
      <h1>{{ room ? room.name : ""}}</h1>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <v-row>
        <!-- TODO : 日付を表示出来るようにする -->
         <!-- <v-col
            v-for="card in cards"
            :key="card"
            cols="12"
          > -->
          <v-col
            cols="12"
          >
            <v-card>
              <!-- TODO : 日付を表示出来るようにする -->
              <!-- <v-subheader>{{ card }}</v-subheader> -->

              <v-list two-line>
                <template v-for="(data, index) in messages">
                  <v-list-item
                    :key="index"
                  >
                    <v-list-item-avatar color="grey darken-1">
                      <v-img :src="data.photoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-subtitle class="message">
                        {{ data.message }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider
                    v-if="n !== 6"
                    :key="`divider-${index}`"
                    inset
                  ></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-textarea
          class="mx-2"
          label="メッセージを送信"
          rows="3"
          prepend-icon="mdi-comment"
          auto-grow
          v-model="body"
        ></v-textarea>
      <v-btn
        class="mr-4"
        type="submit"
        :disabled="invalid"
        @click="submit"
      >
        submit
      </v-btn>
      <v-btn @click="clear">
        clear
      </v-btn>
    </v-main>
  </v-app>
</template>

<script>
import firebase from '@/firebase/firebase'
import SideBarMenu from '@/components/layouts/SideBarMenu'
export default {
  components: {
    SideBarMenu
  },
  // virtualDOMが描画される前に動作する
  created: async function(){
    this.roomId = this.$route.query.room_id

    // room_idからチャットルームを取得する
    const roomRef = firebase.firestore().collection('rooms').doc(this.roomId)
    const roomDoc = await roomRef.get()

    // 対象のチャットルームが存在ない場合はトップ画面に遷移させる
    if(!roomDoc.exists){
      await this.$route.push('/')
    }

    // チャットルームの情報を取得
    this.room = roomDoc.data()

  },
  // Vueインスタンスがマウントされてから実行される(DOMが生成された直度)
  mounted: function() {
    // セッションよりログイン情報の取得
    this.auth = JSON.parse(sessionStorage.getItem('user'))

    // チャットルーム情報の取得
    const roomRef = firebase.firestore().collection('rooms').doc(this.roomId)
    // onSnapshot()でイベントを検知しdocChanges()で変更があった場合の新しい値を追加
    roomRef.collection('messages').orderBy('createdAt', 'asc')
    .onSnapshot(snapshot => {
      // ここのchangeは新しいメッセージが入る
      snapshot.docChanges().forEach(change => {
        this.messages.push(change.doc.data())
      })
    })
  },
  data: () => ({
    n : '',
    roomId: '',
    room: '',
    // cards: ['Today'], TODO : 日付を表示出来るようにする
    drawer: null,
    body: '',
    messages: [],
    auth: null,
  }),
  methods: {
    // クリアボタン押下時
    clear: function(){
      this.body = ''
    },
    // 送信ボタン
    submit: async function(){
      // firebaseにメッセージの登録
      const roomRef = firebase.firestore().collection('rooms').doc(this.roomId)
      await roomRef.collection('messages').add({
        message: this.body,
        name: this.auth.displayName,
        photoURL: this.auth.photoURL,
        createdAt: firebase.firestore.Timestamp.now()
      })
      .then(result => {
        console.log('sucees to submit message', result)
        this.body = ''
      })
      .catch(error => {
        console.log('fail', error)
        alert('メッセージの送信に失敗しました。')
      })
    }
  },
  // computed内で使用されているデータが変更されたら変更を検知して処理を再度実行
  computed: {
    invalid: function(){
      if (!this.body){
          return true;
      }
      return false;
    }
  },
}
</script>

<style scoped>
.message {
    text-align: left;
}
</style>