<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent scrollable max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="lime"
          rounded
          v-bind="attrs"
          x-large
          class="register-btn"
          v-on="on"
        >
          Regístrate y gana
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Regístrate</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-img src="https://s3.sa-east-1.amazonaws.com/media.cyberday.ec/promo_registrate_53557f3d62.png" class="my-0 mx-auto" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.first_name" label="Nombre*" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.last_name" label="Apellido*" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.cedula" label="Cédula*" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.mobile" label="Celular*" required />
              </v-col>
              <v-col cols="12" sm="6">
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
  </v-row>
</template>

<script>
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  data: () => ({
    form: {
      first_name: '',
      last_name: '',
      cedula: '',
      mobile: '',
      email: ''
    },
    formValidation: {
      first_name: ['required'],
      last_name: ['required'],
      cedula: ['required'],
      mobile: ['required'],
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
          await this.$strapi.create('contacts', this.form)
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

<style scoped>

.register-btn{
  animation: shake 3s cubic-bezier(.36,.07,.19,.97) both;
  animation-iteration-count: infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  5%,50%{
    transform: translate3d(-1px, 0, 0);
  }

  10%, 20%, 30%, 40%{
    transform: translate3d(2px, 0, 0);
  }

  15%, 25%, 35%, 45%{
    transform: translate3d(-2px, 0, 0);
  }
}
</style>
