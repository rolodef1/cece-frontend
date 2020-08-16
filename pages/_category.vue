<template>
  <v-layout class="overflow-hidden">
    <v-flex xs12>
      <v-container grid-list-md class="brands-category">
        <v-layout row wrap>
          <v-flex
            v-for="brand in brands"
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
                    :src="brand.logo.url | changeMediaUrl"
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
    </v-flex>
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
          :src="promotion.image.url | changeMediaUrl"
          :href="promotion.url"
          target="_blank"
          reverse-transition="fade-transition"
          transition="fade-transition"
        />
      </v-carousel>
    </v-dialog>
  </v-layout>
</template>

<script>

export default {
  async fetch () {
    this.brands = await fetch(this.apiUrl + '/brands?categories=' + this.$route.params.category + '&_sort=priority:ASC').then(res =>
      res.json()
    )
  },
  data () {
    return {
      brands: [],
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
.brands-category{
  margin-top: 100px;
}
</style>
