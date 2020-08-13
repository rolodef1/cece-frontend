<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent scrollable max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Nueva promoción</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-file-input
                  v-model="form.image"
                  clearable
                  accept="image/*"
                  label="Imagen*"
                  hint="Imagen de la promoción 220x300 px"
                  persistent-hint
                  @change="imageChanged = true"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.url"
                  label="Url*"
                  required
                  hint="Url a donde redirecciona promoción"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.priority"
                  label="Prioridad*"
                  required
                  hint="Orden en que se muestra la promoción"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-container>
          <small>*Campos requeridos</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close()">
            Cerrar
          </v-btn>
          <v-btn color="blue darken-1" @click="save()">
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="text-center ma-2">
      <v-snackbar
        v-model="message.show"
        :color="message.color"
        :top="true"
        :right="true"
        :multi-line="true"
      >
        <div v-html="message.text" />
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
  </v-row>
</template>

<script>
export default {
  props: {
    brand: { type: Object, required: true },
    show: { type: Boolean, default: false },
    promotion: { type: Object, default: null },
    edit: { type: Boolean, default: false }
  },
  data: () => ({
    dialog: false,
    form: {},
    imageChanged: false,
    formValidation: {
      image: ['required', 'dimensions:220,300'],
      url: ['required'],
      priority: ['required']
    },
    message: {
      show: false,
      text: '',
      color: 'info'
    }
  }),
  watch: {
    show (val, oldVal) {
      if (val !== oldVal) {
        this.dialog = val
      }
    },
    promotion (val, oldVal) {
      if (val !== oldVal) {
        if (val == null) {
          this.form = {}
        } else {
          this.form = val
        }
        this.imageChanged = false
      }
    }
  },
  created () {
    this.dialog = this.show
    if (this.promotion !== null) {
      this.form = this.promotion
    }
  },
  methods: {
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
              if (this.edit && !this.imageChanged) {
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
    async save () {
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
          if (!this.edit) {
            await this.$strapi.create('promotions', formData)
          } else {
            await this.$strapi.update('promotions', this.promotion.id, formData)
          }
          this.$emit('saved')
        } catch (error) {
          console.log(error)
        } finally {
          this.close()
        }
      }
    },
    close () {
      this.$emit('closed')
    }
  }
}
</script>
