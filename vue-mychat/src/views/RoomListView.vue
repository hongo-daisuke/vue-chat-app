<template>
  <v-app id="inspire">
    <SideBarMenu/>
    <v-app-bar
      app
      shrink-on-scroll
    >

      <v-toolbar-title>ルーム一覧</v-toolbar-title>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col
            v-for="room in rooms"
            :key="room.id"
            cols="4"
          >
            <router-link :to="{path: '/chat', query: { room_id: room.id }}">
              <v-avatar color="grey lighten-2" size="128">
                <img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                  v-if="!room.thumbnailUrl"
                >
                <img
                  :src="room.thumbnailUrl"
                  alt="John"
                  v-if="room.thumbnailUrl"
                >
              </v-avatar>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
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
  data: () => ({
    rooms : []
  }),
  mounted: function() {
    this.getRooms()
  },
  methods: {
    getRooms: async function(){
      this.rooms = []
      // ルーム一覧を取得
      const roomRef = firebase.firestore().collection('rooms')
      const snapshot = await roomRef.get()
      snapshot.forEach(doc => {
      
        // IDとデータを変数に代入する
        const data = {...doc.data()}
        data.id = doc.id
        this.rooms.push(data)
      });
    }
  }
}
</script>