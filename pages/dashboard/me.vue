<template>
  <v-layout>
    <v-flex xs12>
      <v-card>
        <v-form v-if="!!brand" ref="meForm">
          <v-card-title>
            <span class="headline">Mi perfil</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-layout row wrap px-4>
                <v-flex xs12 md3>
                  <v-layout row wrap>
                    <v-flex xs12 class="text-center">
                      <v-avatar tile width="80%" height="100%">
                        <v-img
                          v-if="!!brand.logo"
                          :src="brand.logo.url"
                        />
                        <v-icon v-else size="64">mdi-account-circle</v-icon>
                      </v-avatar>
                    </v-flex>
                    <v-flex xs12 class="text-center">
                      <a v-show="!showFileInput" @click="showFileInput = true">Modificar logo</a>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 md9>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-text-field v-model="form.Name" label="Nombre*" required />
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field v-model="form.url" label="Url*" required />
                    </v-flex>
                    <v-flex v-show="showFileInput" xs12>
                      <v-file-input v-model="form.logo" clearable accept="image/*" label="Logo*" />
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*Campos requeridos</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="updateBrand">
              Actualizar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
      <div class="text-center ma-2">
        <v-snackbar
          v-model="message.show"
          :color="message.color"
          :top="true"
          :right="true"
          :multi-line="true"
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
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  layout: 'dashboard',
  middleware: 'auth',
  async fetch () {
    const brands = await fetch(this.apiUrl + '/brands?user=' + this.$strapi.user.id).then(res =>
      res.json()
    )
    this.$set(this, 'brand', brands[0])
    this.initForm()
  },
  data () {
    return {
      brand: null,
      form: {},
      apiUrl: '',
      showFileInput: false,
      message: {
        show: false,
        text: '',
        color: 'info'
      }
    }
  },
  created () {
    this.apiUrl = process.env.apiUrl
  },
  methods: {
    initForm () {
      const form = { Name: this.brand.Name, url: this.brand.url }
      this.$set(this, 'form', form)
    },
    async updateBrand () {
      const data = {}
      const formData = new FormData()
      for (const field in this.form) {
        if (!(this.form[field] instanceof File)) {
          data[field] = this.form[field]
        } else {
          const file = this.form[field]
          formData.append('files.' + field, file, file.name)
        }
      }
      formData.append('data', JSON.stringify(data))
      try {
        const result = await this.$strapi.update('brands', this.brand.id, formData)
        this.$set(this, 'brand', result)
        this.$set(this, 'message', { show: true, text: 'La información fue actualizada de forma exitosa', color: 'success' })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
