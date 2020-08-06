<template>
  <v-row justify="center">
    <v-card>
      <v-card-title>
        <span class="headline">Bienvenido {{ $strapi.user.username }}</span>
      </v-card-title>
    </v-card>
  </v-row>
</template>

<script>

export default {
  layout: 'dashboard',
  middleware: 'auth',
  data () {
    return {

    }
  }
}
</script>
