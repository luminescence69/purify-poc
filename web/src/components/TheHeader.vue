<template>
  <v-app-bar
    app
    color="primary"
    dark
    dense
  >
    <v-container>
      <v-row justify="center" align="center">
        <router-link :to="{ name: 'Overview' }">
          <v-img
            class="mr-1"
            src="@/assets/logo_trans.png"
            max-width="30"
            max-height="30"
          />
        </router-link>
        <v-toolbar-title>
          <b>Purify</b>
        </v-toolbar-title>
        <v-divider
          class="ml-4 my-2 mr-1"
          vertical
        />
        <project-picker />
        <v-spacer />
        <v-menu
          offset-y
          nudge-bottom="5"
          nudge-width="80"
          transition="slide-y-reverse-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="text-none"
              v-bind="attrs"
              v-on="on"
            >
              Manage
              <v-icon small>
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item active-class="primary--text" :to="{ name: 'Templates' }">
              <v-list-item-action>
                <v-icon>mdi-file-document-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-title>Templates</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-permission="['owner', 'admin']"
              active-class="primary--text"
              :to="{ name: 'Users' }"
            >
              <v-list-item-action>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-action>
              <v-list-item-title>Users</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          v-model="menu"
          :close-on-content-click="true"
          :nudge-width="200"
          offset-x
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              id="btn-mini-profile"
              text
              class="text-none"
              v-on="on"
            >
              My profile
              <v-icon small>
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-card id="menu-mini-profile">
            <v-list dense max-width="330">
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="user.image" alt="ava">
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ user.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    id="btn-logout"
                    icon
                    @click.stop="killSession"
                  >
                    <v-icon>mdi-exit-run</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-divider />
            <v-list dense>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item :to="{ name: 'AccountSettings' }">
                  <v-list-item-icon>
                    <v-icon>mdi-tune</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>Account Settings</v-list-item-content>
                </v-list-item>
                <v-list-item :to="{ name: 'AccessTokens' }">
                  <v-list-item-icon>
                    <v-icon>mdi-key-chain</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>API Access Tokens</v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import store from '../store';
import { router } from '@/router';
import { LOGOUT } from '@/store/actions';
import ProjectPicker from '@/components/ProjectPicker.vue';

export default defineComponent({
  name: 'TheHeader',

  components: { ProjectPicker },

  setup() {
    const item = ref(null);
    const menu = ref(false);
    const drawer = ref(false);
    const user = computed(() => store.state.profile.user);

    function killSession() {
      store
        .dispatch(LOGOUT)
        .then(() => {
          router.replace({ name: 'Welcome' });
        })
        .catch(() => {});
    }

    return {
      item,
      menu,
      drawer,
      user,
      killSession,
    };
  },
});
</script>
