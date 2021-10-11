<template>
    <div>
        <div id="container"></div>
        <template>
            <v-card
                    v-show="coverInfoCardVisibility"
                    class="cover-info-box mx-auto my-12"
                    max-width="300">

                <v-card-title>井盖信息</v-card-title>

                <v-card-text>
                    <div>
                        <b>井盖UUID:</b><br>{{coverInfo.uid}}<br>
                        <b>经纬度:</b><br>{{coverInfo.coverLongLat}}<br>
                        <b>气体状态:</b>
                        <v-chip
                                v-if="coverInfo.coverGasStatus===0"
                                class="ma-2"
                                small
                                color="green"
                                label
                                text-color="white">
                            正常
                        </v-chip>
                        <v-chip
                                v-else
                                class="ma-2"
                                color="red"
                                small
                                label
                                text-color="white">
                            异常
                        </v-chip>
                        <br>
                        <b>倾斜状态:</b>
                        <v-chip
                                v-if="coverInfo.coverSensorStatus===0"
                                class="ma-2"
                                color="green"
                                label
                                small
                                text-color="white">
                            正常
                        </v-chip>
                        <v-chip
                                v-else
                                class="ma-2"
                                color="red"
                                label
                                small
                                text-color="white">
                            异常
                        </v-chip>
                    </div>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-text>
                    <v-text-field
                            text="coverInfo.coverRoad"
                            label="井盖道路信息"
                            color="pink"
                            v-model="coverInfo.coverRoad"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn
                            color="pink lighten-2"
                            text
                            @click="dialogVisibility = true">
                        修改
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
        <template>
            <v-dialog
                    v-model="dialogVisibility"
                    width="500">
                <v-card>
                    <v-card-title class="text-h5 pink lighten-2">
                        警告
                    </v-card-title>
                    <br>
                    <v-card-text>
                        确定修改uuid为
                        <b>{{coverInfo.uid}}</b>井盖的街道信息为
                        <b>{{coverInfo.coverRoad}}</b>吗
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="pink"
                                text
                                @click="updateRoadInfo">
                            确定
                        </v-btn>
                        <v-btn
                                color="primary"
                                text
                                @click="dialogVisibility = false">
                            取消
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
        <template>
            <v-dialog
                    v-model="progressVisibility"
                    hide-overlay
                    persistent
                    width="300">
                <v-card
                        color="#e91e63"
                        dark>
                    <v-card-text>
                        稍等一会…………
                        <v-progress-linear
                                indeterminate
                                color="white"
                                class="mb-0"
                        ></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </template>
    </div>
</template>

<script>
    import {mapValue} from '@/tools/AMapValue'
    import AMapLoader from "@amap/amap-jsapi-loader";

    const axios = require('axios').default;

    export default {
        data: () => ({
            selection: 1,
            AMap: null,
            coverInfoCardVisibility: false,
            dialogVisibility: false,
            progressVisibility: false,
            userMarkers: [],
            coverInfo: {
                uid: "d04b71cb-b313-4610-8a41-90cfe4e4d1fa",
                coverRoad: "新余学院主教A",
                coverSensorStatus: 0,
                coverLoastime: 1629333999312,
                coverLongLat: "114.999447-27.852305",
                coverGasStatus: 0
            }
        }),
        methods: {
            showMap: function () {
                AMapLoader.load(mapValue).then((AMap) => {
                    this.AMap = AMap;
                    this.map = new AMap.Map('container', {
                        zoom: 14,//级别
                        center: [114.995512, 27.858499],//中心点坐标
                        viewMode: '3D'//使用3D视图
                    });
                    var styleName = "amap://styles/macaron";
                    this.map.setMapStyle(styleName);
                    this.showAllMarker();
                }).catch(e => {
                    console.log(e);
                })
            },
            showAllMarker: function () {
                //将this全局变量本地化方便回调调用，回调中的this是axios
                const that = this;
                //要先删除之前的标点
                that.map.remove(that.userMarkers);
                that.userMarkers = [];
                //网络请求获得井盖
                var config = {
                    method: 'get',
                    url: '/work/coverinfo/list?limit=10&page=1',
                    headers: {}
                };

                axios(config)
                    .then(function (response) {
                        if (response.data.msg === 'success' || response.data.page.list.length > 0) {
                            for (let i = 0; i < response.data.page.list.length; i++) {
                                that.addMarker(response.data.page.list[i]);
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            addMarker: function (info) {
                var marker = new this.AMap.Marker({
                    icon: "cover.svg",
                    position: info.coverLongLat.split("-"),
                    anchor: 'bottom-center'
                });
                this.map.add(marker);
                this.userMarkers.push(marker);
                var that = this;
                marker.on('click', () => {
                    console.log(info);
                    //修改井盖详细界面
                    that.coverInfoCardVisibility = true;
                    that.coverInfo = info;
                });
            },
            updateRoadInfo: function () {
                console.log(this.coverInfo);
                this.dialogVisibility = false;
                //网络请求，修改井盖数据
                this.progressVisibility = true;

                var config = {
                    method: 'post',
                    url: '/work/coverinfo/update',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        coverRoad: this.coverInfo.coverRoad,
                        uid: this.coverInfo.uid
                    }
                };
                let that = this;
                axios(config)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        that.progressVisibility = false;
                        //刷新显示
                        that.showAllMarker();
                    })
                    .catch(function (error) {
                        console.log(error);
                        that.progressVisibility = false;
                    });
            }
        },
        mounted: function () {
            //设置图像高度
            let leftLayoutView = document.getElementsByClassName("v-navigation-drawer__content");
            let innerHeight = leftLayoutView[0].offsetHeight;
            // console.log(innerHeight)
            document.getElementById("container").style.height = innerHeight + "px";
            this.showMap();
            //设置定时器用于刷新井盖定位
            // self.setInterval(this.showAllMarker, 10000);
        }
    }
</script>

<style scoped>
    #container {
        width: 100%;
        height: 400px;
    }

    /*用于设置绝对定位浮动*/
    .cover-info-box {
        position: absolute;
        right: 30px;
        top: 1px;
    }

    .v-dialog .v-card__title {
        color: floralwhite;
    }


</style>
