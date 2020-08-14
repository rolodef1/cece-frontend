<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        rounded
        x-small
        v-bind="attrs"
        v-on="on"
      >
        Suscríbete
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Suscríbete</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.email" label="Email*" required />
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
        <v-btn color="blue darken-1" text @click="save()">
          Enviar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    form: {
      email: ''
    },
    formValidation: {
      email: ['required']
    }
  }),
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
        this.$store.commit('setMessage', { show: true, text: messageAlert, color: 'error' })
      }
      const validFormArr = Object.values(validForm)
      return !validFormArr.some(item => item === false)
    },
    async save () {
      const validForm = await this.validForm()
      if (validForm) {
        try {
          await this.$strapi.create('subscribers', this.form)
          this.$emit('saved')
        } catch (error) {
          console.log(error)
        } finally {
          this.close()
        }
      }
    },
    close () {
      this.dialog = false
      this.$emit('closed')
    }
  }
}
</script>
