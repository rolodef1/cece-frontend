<template>
  <v-layout v-if="plans.length" class="overflow-hidden">
    <v-flex xs12>
      <div
        v-for="(plan, key) in plans"
        :key="plan.id"
        :style="plansStyles[plan.id]"
        :class="['text-center', key==0?'mt-16':'']"
      >
        <v-sheet :color="plan.styles.Name.backgroundColor" elevation="10" height="70px">
          <h1 :class="['text-md-h3', 'pt-3', plan.styles.Name.textColor]">
            {{ plan.Name }}
          </h1>
        </v-sheet>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12>
              <a :href="plan.ad_url" target="_blank">
                <v-img
                  class="d-none d-md-block"
                  :src="plansAdsFiles[plan.id].ad"
                />
                <v-img
                  class="d-flex d-md-none"
                  :src="plansAdsFiles[plan.id].ad_responsive"
                />
              </a>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex
              v-for="brand in brands[plan.id]"
              :key="brand.id"
              xs6
              md3
              lg2
            >
              <v-hover>
                <template v-slot:default="{ hover }">
                  <v-card
                    rounded
                    nuxt
                    :class="`elevation-${hover ? 24 : 6}`"
                    class="transition-swing"
                  >
                    <v-img
                      :src="brand.logo.url"
                      class="white--text align-end"
                    />
                    <v-fade-transition v-if="promoIsActive">
                      <v-overlay
                        v-if="hover"
                        absolute
                        color="black"
                      >
                        <v-btn x-small rounded :href="brand.url" target="_blank">
                          Ir a sitio
                        </v-btn>
                        <v-btn x-small rounded @click="showPromotions(brand)">
                          Ver promos
                        </v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </template>
              </v-hover>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
      <v-dialog v-model="dialogPromotions" width="400px">
        <v-carousel
          cycle
          widht="400px"
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item
            v-for="promotion in promotions"
            :key="promotion.id"
            :src="promotion.image.url"
            :href="promotion.url"
            target="_blank"
            reverse-transition="fade-transition"
            transition="fade-transition"
          />
        </v-carousel>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  async fetch () {
    this.plans = await fetch(this.apiUrl + '/plans?_sort=priority:ASC').then(res =>
      res.json()
    )
    this.plans.forEach(async (plan) => {
      const brands = await fetch(this.apiUrl + '/brands?plan=' + plan.id + '&_sort=priority:ASC').then(res =>
        res.json()
      )
      this.$set(this.brands, plan.id, brands)
    })
  },
  data () {
    return {
      brands: {},
      plans: [],
      promotions: [],
      dialogPromotions: false,
      apiUrl: ''
    }
  },
  computed: {
    configuration () {
      return this.$store.state.configuration
    },
    promoIsActive () {
      return Date.now() >= new Date(this.configuration.start_date).getTime()
    },
    plansAdsFiles () {
      const plansAds = {}
      this.plans.forEach((plan) => {
        const ads = {}
        plan.ad.forEach((file) => {
          ads[file.name] = file.url
        })
        plansAds[plan.id] = ads
      })
      return plansAds
    },
    plansBackgroundsFiles () {
      const plansBackgrounds = {}
      this.plans.forEach((plan) => {
        const backgrounds = {}
        plan.backgrounds.forEach((file) => {
          backgrounds[file.name] = file.url
        })
        plansBackgrounds[plan.id] = backgrounds
      })
      return plansBackgrounds
    },
    plansStyles () {
      const plansStyles = {}
      this.plans.forEach((plan) => {
        plansStyles[plan.id] = {
          'background-repeat': 'repeat',
          background: `url(${this.plansBackgroundsFiles[plan.id].fondo})`
        }
      })
      return plansStyles
    }
  },
  created () {
    this.apiUrl = process.env.apiUrl
  },
  methods: {
    async showPromotions (brand) {
      this.promotions = []
      this.promotions = await fetch(this.apiUrl + '/promotions?brand=' + brand.id + '&_sort=priority:ASC').then(res =>
        res.json()
      )
      if (this.promotions.length) {
        this.dialogPromotions = true
      } else {
        this.$store.commit('setMessage', { show: true, text: 'No se encontraron promociones', color: 'info' })
      }
    }
  }
}
</script>

<style scoped>

</style>
