<template>
  <v-app ligth>
    <v-main v-if="!!configuration">
      <v-container fluid :style="headerStyles" class="header pa-0 pb-4">
        <v-alert
          v-model="showSuscriberMsg"
          dismissible
          close-icon="mdi-close"
          color="lime"
          icon="mdi-mail"
          border="bottom"
          elevation="2"
          dense
          type="info"
          align="center"
        >
          <span class="black--text">Recibe las mejores ofertas para ti!.</span>
          <Newsletter :dialog="showNewsletterDialog" @saved="subscribed()" @closed="showNewsletterDialog = false"/>
        </v-alert>
        <v-row>
          <v-col xs="12" sm="6">
            <v-img :src="apiUrl+configuration.logo.url" class="logo my-0 mx-auto" />
          </v-col>
          <v-col xs="12" sm="6">
            <div v-if="promoIsActive">
              <v-alert
                dense
                color="primary"
                dark
                icon="mdi-clock"
                border="left"
                class="alert-msg-countdown my-0 mx-auto"
                align="center"
              >
                <span>Promociones exclusivas por tiempo limitado</span>
              </v-alert>
              <client-only>
                <flip-countdown :deadline="deadline" :labels="{days:'Dias',hours:'Horas',minutes:'Minutos',seconds:'Segundos'}" class="my-0 mx-auto white--text" />
              </client-only>
            </div>
            <div v-else>
              <v-img :src="apiUrl+comunicationsFiles.fecha_texto" class="fecha my-0 mx-auto" />
            </div>
          </v-col>
        </v-row>
        <Register v-if="showRegisterBtn" :dialog="showRegisterDialog" @saved="registered()" @closed="showRegisterDialog = false"/>
      </v-container>
      <v-card class="overflow-hidden">
        <v-app-bar
          absolute
          elevate-on-scroll
          scroll-target="#scrolling"
        >
          <v-tabs
            height="70px"
            fixed-tabs
            background-color="white"
            centered
            center-active
            show-arrows
            icons-and-text
          >
            <v-tabs-slider color="lime" />
            <v-tab
              v-for="category in categories"
              :key="category.id"
              nuxt
              :to="category.id==0?'/':`/${category.id}`"
              class="tab"
            >
              <span class="purple--text">{{ category.Name }}</span>
              <v-icon color="purple">{{ category.Icon }}</v-icon>
            </v-tab>
          </v-tabs>
        </v-app-bar>
        <v-sheet
          id="scrolling"
          class="overflow-y-auto sheet"
        >
          <v-container fluid class="pa-0">
            <nuxt />
          </v-container>
          <v-footer
            padless
            color="white"
          >
            <v-container grid-list-md>
              <v-card
                flat
                tile
                class="white white--text text-center"
              >
                <v-card-text class="black--text">
                  <h1>Co-organiza</h1>
                </v-card-text>
                <v-divider />
                <v-card-text class="white--text">
                  <v-layout row wrap>
                    <v-flex
                      v-for="(coorganizador, id) in configuration.coorganizadores"
                      :key="id"
                      xs6
                      md3
                    >
                      <v-img
                        :src="apiUrl + coorganizador.src"
                      />
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-divider />
                <v-card-text class="black--text">
                  {{ new Date().getFullYear() }} — <strong>CECE</strong>
                  <v-btn
                    class="mx-4 black--text"
                    icon
                    href="https://www.facebook.com/CybermondayEc/"
                    target="_blank"
                  >
                    <v-icon size="24px">
                      mdi-facebook
                    </v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-container>
          </v-footer>
        </v-sheet>
      </v-card>
      <div class="text-center ma-2">
        <v-snackbar
          v-model="message.show"
          :color="message.color"
          top="true"
          right="true"
          multi-line="true"
        >
          {{ message.text }}
          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="message.show = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-main>
  </v-app>
</template>

<script>

import FlipCountdown from 'vue2-flip-countdown'
import Register from '~/components/Register.vue'
import Newsletter from '~/components/Newsletter.vue'

export default {
  loading: false,
  components: {
    FlipCountdown,
    Register,
    Newsletter
  },
  async fetch () {
    this.categories = await fetch(this.apiUrl + '/categories?_sort=priority:ASC').then(res =>
      res.json()
    )
    this.categories.unshift({ id: 0, Name: 'Todas', Icon: 'mdi-sale' })
    this.configuration = await fetch(this.apiUrl + '/configuration').then(res =>
      res.json()
    )
  },
  data () {
    return {
      showSuscriberMsg: true,
      showRegisterDialog: false,
      showRegisterBtn: true,
      showNewsletterDialog: false,
      categories: [],
      configuration: null,
      apiUrl: '',
      message: {
        show: false,
        text: '',
        color: 'info'
      }
    }
  },
  computed: {
    comunicationsFiles () {
      const comunications = {}
      this.configuration.comunications.forEach((file) => {
        comunications[file.name] = file.url
      })
      return comunications
    },
    promoIsActive () {
      return Date.now() >= new Date(this.configuration.start_date).getTime()
    },
    deadline () {
      let deadline = this.configuration.ending_date.replace('T', ' ')
      deadline = deadline.replace('.000Z', '')
      return deadline
    },
    backgroundsFiles () {
      const backgrounds = {}
      this.configuration.backgrounds.forEach((file) => {
        backgrounds[file.name] = file.url
      })
      return backgrounds
    },
    headerStyles () {
      return {
        '--header-background': `url(${this.apiUrl + this.backgroundsFiles.fondo})`,
        '--header-background-responsive': `url(${this.apiUrl + this.backgroundsFiles.fondo_responsive})`
      }
    }
  },
  created () {
    this.apiUrl = process.env.apiUrl
  },
  methods: {
    registered () {
      this.$set(this, 'message', { show: true, text: 'Registro exitoso', color: 'success' })
      this.showRegisterBtn = false
    },
    subscribed () {
      this.$set(this, 'message', { show: true, text: 'Subscrito de forma exitosa', color: 'success' })
      this.showSuscriberMsg = false
    }
  }
}
</script>

<style scoped>
  .header{
    background: var(--header-background);
  }
  .logo{
    width:80%;
  }
  .fecha{
    width:60%;
  }
  .register{
    width:30%;
  }
  .alert-msg-countdown{
    width:60%;
  }
  .sheet{
    max-height: 780px;
  }

  @media (max-width: 600px) {
    .header{
      background: var(--header-background-responsive);
    }
    .logo{
      width:90%;
    }
    .fecha{
      width:90%;
    }
    .register{
      width:90%;
    }
    .alert-msg-countdown{
      width:85%;
    }
    .sheet{
      max-height: 680px;
    }
  }
</style>
