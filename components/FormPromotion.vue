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
                <v-file-input v-model="form.image" clearable accept="image/*" label="Imagen*" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="form.url" label="Url*" required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="form.priority" label="Prioridad*" required />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="form.detail" label="Detalle*" required />
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
    brand: { type: Object, required: true },
    show: { type: Boolean, default: false },
    promotion: { type: Object, default: null },
    edit: { type: Boolean, default: false }
  },
  data: () => ({
    dialog: false,
    form: {}
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
    async save () {
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
    },
    close () {
      this.$emit('closed')
    }
  }
}
</script>
