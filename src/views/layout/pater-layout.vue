<template>
    <v-app id="pater-layout">
        <leftLayout></leftLayout>
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
    export default {
        data: () => ({}),
    }
</script>


<style scoped>

</style>
