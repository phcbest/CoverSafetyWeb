<template>
    <v-navigation-drawer permanent>
        <v-sheet
                color="pink lighten-4"
                class="pa-4 sheet-box">
            <v-avatar
                    class="mb-4"
                    size="80">
                <img :src="image">
            </v-avatar>

            <v-chip color="pink lighten-3"
                    filter>dev@coversafety.com
            </v-chip>
        </v-sheet>

        <!--            一个简单的横隔板-->
        <v-divider></v-divider>
        <!--循环路由表-->
        <v-list nav dense>
            <v-list-item-group
                    v-model="selectedItem"
                    color="pink">
                <v-list-item v-for="(item,index) in routerList" :key="index">
                    <v-list-item-content>
                        <router-link class="router-link-a" :to="item.path">
                            <v-list-item-title v-text="item.name"></v-list-item-title>
                        </router-link>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    import {routes} from "@/router/index"

    export default {
        data: () => ({
            image: "https://z3.ax1x.com/2020/12/18/rY93p6.png",
            routerList: "",
            selectedItem: 0
        }),
        //挂载操作
        mounted() {
            this.routerList = routes[0].children;
            console.log(this.routerList)
        }
    }
</script>

<style>
    .router-link-a {
        text-decoration: none;
        color: black !important;
        text-align: center;
    }

    .sheet-box {
        text-align: center;
    }
</style>
