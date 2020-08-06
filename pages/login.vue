<template>
  <v-row justify="center">
    <v-card>
      <v-form>
        <v-card-title>
          <span class="headline">Inicio de sesión</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="login.identifier" label="Usuario*" required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="login.password" label="Apellido*" type="password" required />
              </v-col>
            </v-row>
          </v-container>
          <small>*Campos requeridos</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="userLogin">
            Enviar
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-row>
</template>

<script>

export default {
  layout: 'dashboard',
  middleware: 'guest',
  data () {
    return {
      login: {
        identifier: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin () {
      try {
        const response = await this.$strapi.login(this.login)
        this.$strapi.setToken(response.jwt)
        this.$strapi.setUser(response.user)
        this.$router.go({ path: '/dashboard' })
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted () {
    console.log(this.$strapi.user)
  }
}
</script>
