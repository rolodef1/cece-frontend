<template>
  <v-layout>
    <v-flex xs12>
      <v-container grid-list-md>
        <v-layout>
          <v-flex xs12 class="text-center">
            <v-btn
              color="info"
              rounded
              @click="createPromotion()"
            >
              Crear promoción
            </v-btn>
            <FormPromotion :brand="brand" @saved="refreshPromotions()" />
          </v-flex>
        </v-layout>
        <v-layout v-if="promotions.length" row wrap>
          <v-flex
            v-for="promotion in promotions"
            :key="promotion.id"
            xs6
            md3
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
                    :src="promotion.image.url"
                  />
                  <v-fade-transition>
                    <v-overlay
                      v-if="hover"
                      absolute
                      color="black"
                    >
                      <v-btn x-small rounded  @click="editPromotion(promotion)">
                        Editar
                      </v-btn>
                      <v-btn x-small rounded @click="eliminarPromotion(promotion)">
                        Eliminar
                      </v-btn>
                    </v-overlay>
                  </v-fade-transition>
                </v-card>
              </template>
            </v-hover>
          </v-flex>
        </v-layout>
        <v-layout v-else>
          <v-flex xs12 class="text-center">
            <h3>No hay registros a mostrar</h3>
          </v-flex>
        </v-layout>
        <FormPromotion v-bind="bindForm" @saved="refreshPromotions()" @closed="showForm = false"/>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>

import FormPromotion from '~/components/FormPromotion.vue'

export default {
  layout: 'dashboard',
  middleware: 'auth',
  components: {
    FormPromotion
  },
  async fetch () {
    const brands = await fetch(this.apiUrl + '/brands?user=' + this.$strapi.user.id).then(res =>
      res.json()
    )
    this.$set(this, 'brand', brands[0])
    this.promotions = await fetch(this.apiUrl + '/promotions?brand=' + this.brand.id).then(res =>
      res.json()
    )
  },
  data () {
    return {
      brand: null,
      promotions: [],
      apiUrl: '',
      promotionToEdit: null,
      editForm: false,
      showForm: false
    }
  },
  computed: {
    bindForm () {
      const bind = {
        brand: this.brand,
        promotion: this.promotionToEdit,
        show: this.showForm,
        edit: this.editForm
      }
      console.log(bind)
      return bind
    }
  },
  created () {
    this.apiUrl = process.env.apiUrl
  },
  methods: {
    async refreshPromotions () {
      this.promotions = await fetch(this.apiUrl + '/promotions?brand=' + this.brand.id).then(res =>
        res.json()
      )
    },
    createPromotion () {
      this.$set(this, 'promotionToEdit', null)
      this.$set(this, 'showForm', true)
      this.$set(this, 'editForm', false)
    },
    editPromotion (promotion) {
      this.$set(this, 'promotionToEdit', promotion)
      this.$set(this, 'showForm', true)
      this.$set(this, 'editForm', true)
    },
    async eliminarPromotion (promotion) {
      if (confirm('Está seguro de eliminar la promoción')) {
        await this.$strapi.delete('promotions', promotion.id)
        this.refreshPromotions()
      }
    }
  }
}
</script>
