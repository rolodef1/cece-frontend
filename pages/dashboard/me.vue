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
                      <v-text-field
                        v-model="form.Name"
                        label="Nombre*"
                        required
                        hint="Nombre de la marca"
                        persistent-hint
                      />
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        v-model="form.url"
                        label="Url*"
                        required
                        hint="Url principal a sitio web"
                        persistent-hint
                      />
                    </v-flex>
                    <v-flex v-show="showFileInput" xs12>
                      <v-file-input
                        v-model="form.logo"
                        clearable
                        accept="image/*"
                        label="Logo*"
                        hint="Logo de la marca 500x500 px"
                        persistent-hint
                        @change="imageChanged = true"
                      />
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
          <div v-html="message.text"></div>
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
      imageChanged: false,
      formValidation: {
        logo: ['required', 'dimensions:500,500'],
        Name: ['required'],
        url: ['required']
      },
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
    async validForm () {
      const validForm = {}
      const messages = []
      for (const fieldValidation in this.formValidation) {
        const validations = this.formValidation[fieldValidation]
        for (const validation of validations) {
          const validationParts = validation.split(':')
          const criterio = validationParts[0]
          const data = validationParts[1]
          switch (criterio) {
            case 'required':
              if ([undefined, null, ''].includes(this.form[fieldValidation])) {
                validForm[fieldValidation] = false
                messages.push('El campo ' + fieldValidation + ' es requerido')
              } else {
                validForm[fieldValidation] = true
              }
              break
            case 'dimensions':
              if (!this.imageChanged) {
                validForm[fieldValidation] = true
              } else if (await this.imageValid(this.form[fieldValidation], data)) {
                validForm[fieldValidation] = true
              } else {
                validForm[fieldValidation] = false
                messages.push('El campo ' + fieldValidation + ' debe medir ' + data.split(',').join('x') + ' px')
              }
              break
          }
        }
      }
      if (messages.length) {
        let messageAlert = '<p>Por favor resolver los siguientes problemas</p>'
        messageAlert = messageAlert + '<ul>'
        for (const message of messages) {
          messageAlert = messageAlert + '<li>' + message + '</li>'
        }
        messageAlert = messageAlert + '</ul>'
        this.$set(this, 'message', { show: true, text: messageAlert, color: 'error' })
      }
      const validFormArr = Object.values(validForm)
      return !validFormArr.some(item => item === false)
    },
    async imageValid (file, data) {
      let isValid = false
      if (file instanceof Blob) {
        isValid = await this.readFile(file, data)
      }
      return isValid
    },
    readFile (file, data) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          resolve(this.validImage(e.target.result, data))
        }
        reader.onerror = reject
      })
    },
    validImage (imgData, data) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = imgData
        image.onload = (e) => {
          let result = false
          const dataArr = data.split(',')
          if (e.target.width !== Number(dataArr[0]) || e.target.height !== Number(dataArr[1])) {
            result = false
          } else {
            result = true
          }
          resolve(result)
        }
        image.onerror = reject
      })
    },
    async updateBrand () {
      const validForm = await this.validForm()
      if (validForm) {
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
}
</script>
