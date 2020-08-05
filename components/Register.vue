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
              <v-col cols="12" sm="6">
                <v-text-field label="Nombre*" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Apellido*" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Cédula*" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Celular*" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Email*" required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Ciudad*" required />
              </v-col>
            </v-row>
          </v-container>
          <small>*Campos requeridos</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cerrar
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">
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

  })
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
