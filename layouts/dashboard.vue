<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-list v-if="$strapi.user">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          router
          exact
          @click="logout()"
        >
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Cerrar sesión
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Bienvenido',
          to: '/dashboard'
        },
        {
          icon: 'mdi-account',
          title: 'Mi perfil',
          to: '/dashboard/me'
        },
        {
          icon: 'mdi-sale',
          title: 'Mis promociones',
          to: '/dashboard/promotions'
        }
      ],
      right: true,
      rightDrawer: false,
      title: 'Cyberday.ec'
    }
  },
  methods: {
    async logout () {
      await this.$strapi.logout()
      this.$strapi.clearToken()
      this.$router.go({ path: '/login' })
    }
  }
}
</script>
