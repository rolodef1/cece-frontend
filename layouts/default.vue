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
          <Newsletter :dialog="showNewsletter" />
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
        <Register :dialog="showRegister" />
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
            <v-tabs-slider color="info" />
            <v-tab
              v-for="category in categories"
              :key="category.id"
              nuxt
              :to="category.id==0?'/':`/${category.id}`"
              class="tab"
            >
              {{ category.Name }}
              <v-icon>{{ category.Icon }}</v-icon>
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
                      v-for="coorganizador in coorganizadores"
                      :key="coorganizador.id"
                      xs6
                      md3
                      lg2
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
    this.categories.unshift({ id: 0, Name: 'Todas', Icon: 'mdi-tag' })
    this.configuration = await fetch(this.apiUrl + '/configuration').then(res =>
      res.json()
    )
  },
  data () {
    return {
      showSuscriberMsg: true,
      showRegister: false,
      showNewsletter: false,
      categories: [],
      configuration: null,
      apiUrl: '',
      coorganizadores: [
        { id: 1, src: '/uploads/logo_cece_82d62f49e6.jpeg' },
        { id: 2, src: '/uploads/logo_ccq_acfd5da570.jpeg' },
        { id: 3, src: '/uploads/logo_cig_c3e9086024.jpeg' },
        { id: 4, src: '/uploads/logo_uees_a57591d582.jpeg' },
        { id: 5, src: '/uploads/logo_cisneros_36f793843d.jpeg' },
        { id: 6, src: '/uploads/logo_cece_82d62f49e6.jpeg' }
      ]
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
    max-height: 790px;
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
      max-height: 820px;
    }
  }
</style>
