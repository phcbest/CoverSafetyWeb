<template>
    <!--    要使用app 属性，不然会让布局按流式布局排列 permanent设置是用于设置左侧栏永不消失-->
    <v-navigation-drawer permanent app>
        <v-sheet
                color="pink lighten-4"
                class="pa-4 sheet-box">
            <v-avatar
                    class="mb-4"
                    size="80">
                <v-img :src="image"></v-img>
            </v-avatar>

            <v-chip color="pink lighten-1"
                    text-color="#fff"
                    filter>dev@coversafety.com
            </v-chip>
        </v-sheet>

        <!--            一个简单的横隔板-->
        <v-divider></v-divider>
        <!--循环路由表-->
        <v-list nav dense>
            <!--mandatory用于设置必须选择一个-->
            <v-list-item-group
                    mandatory
                    v-model="selectedItem"
                    color="pink">
                <v-list-item v-for="(item,index) in routerList" :key="index">
                    <v-list-item-icon>
                        <v-icon color="pink darken-2">
                            {{item.icon}}
                        </v-icon>
                    </v-list-item-icon>
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
            image: "https://z3.ax1x.com/2021/10/10/5A120x.png",
            routerList: "",
            selectedItem: 0
        }),
        methods: {
            //需要制作一个
        },
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
        /*text-align: center;*/
        padding-left: 10px;
    }

    .v-list-item__title {
        padding: 10px;
    }
    .v-list-item__icon{
        padding: 20px;
    }

    .sheet-box {
        text-align: center;
    }
</style>
