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
    }
  }),
  methods: {
    async save () {
      try {
        await this.$strapi.create('subscribers', this.form)
        this.$emit('saved')
      } catch (error) {
        console.log(error)
      } finally {
        this.close()
      }
    },
    close () {
      this.dialog = false
      this.$emit('closed')
    }
  }
}
</script>
