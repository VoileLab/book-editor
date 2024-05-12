<template>
  <v-navigation-drawer>
    <v-card class="mx-auto" color="grey-lighten-3">
      <v-card-text>
        <v-text-field label="尋找文字" variant="outlined" append-inner-icon="mdi-magnify" density="compact"
          @click:append-inner="console.log(1)" />
        <v-text-field label="取代文字" variant="outlined" append-inner-icon="mdi-find-replace" density="compact"
          @click:append-inner="console.log(1)" />
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'find-drawer',
}
</script>
