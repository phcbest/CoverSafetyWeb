<template>
    <div>
        <div id="container"></div>
    </div>
</template>

<script>
    import {mapValue} from '@/tools/AMapValue'

    import AMapLoader from "@amap/amap-jsapi-loader";

    export default {
        data: () => ({
            loading: false,
            selection: 1,
            map: null
        }),
        methods: {
            showMap: function () {
                AMapLoader.load(mapValue).then((AMap) => {
                    this.map = new AMap.Map('container', {
                        zoom: 14,//级别
                        center: [114.995512, 27.858499],//中心点坐标
                        viewMode: '3D'//使用3D视图
                    });
                    var styleName = "amap://styles/macaron";
                    this.map.setMapStyle(styleName);
                }).catch(e => {
                    console.log(e);
                })
            }
        },
        mounted: function () {
            //设置图像高度
            let leftLayoutView = document.getElementsByClassName("v-navigation-drawer__content");
            let innerHeight = leftLayoutView[0].offsetHeight;
            console.log(innerHeight)
            document.getElementById("container").style.height = innerHeight + "px";
            this.showMap();
            //todo 网络请求否添加对应的marker
            //https://lbs.amap.com/demo/jsapi-v2/example/map-componets/map-overlays
            // this.map.add(marker);
            // this.map.setFitView();

        }
    }
</script>

<style scoped>
    #container {
        width: 100%;
        height: 400px;
    }


</style>
