<template>
    <div>
        <div class="status-card-box">
            <v-row>
                <v-col>
                    <v-card class="mx-auto text-center"
                            color="green"
                            dark
                            width="100%"
                            height="auto">
                        <v-card-text>
                            <v-sheet color="rgba(0, 0, 0, .12)">
                                <v-sparkline
                                        :value="levelLowValue"
                                        color="rgba(255, 255, 255, .7)"
                                        padding="15"
                                        stroke-linecap="round"
                                        smooth
                                >
                                </v-sparkline>
                            </v-sheet>
                        </v-card-text>

                        <v-card-text>
                            <div class="text-h6 font-weight-thin">
                                低危警告
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="mx-auto text-center"
                            color="red"
                            dark
                            width="100%"
                            height="auto">
                        <v-card-text>
                            <v-sheet color="rgba(0, 0, 0, .12)">
                                <v-sparkline
                                        :value="levelHighValue"
                                        color="rgba(255, 255, 255, .7)"
                                        padding="15"
                                        stroke-linecap="round"
                                        smooth
                                >
                                </v-sparkline>
                            </v-sheet>
                        </v-card-text>

                        <v-card-text>
                            <div class="text-h6 font-weight-thin">
                                高危警告
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-card class="error-item-card-box">
                <!--显示error信息-->
                <div v-for="(item,index) in errorData" :key="'div'+index" class="error-row-box"
                     @click="updateImage(item)">
                    <v-row no-gutters>
                        <v-col cols="2" :key="'img'+index" class="image-error-col">
                            <v-img :src="item.errorImage"
                                   max-width="150px"
                                   contain
                            />
                        </v-col>
                        <v-col cols="10" :key="index">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{item.uid}}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    时间:{{new Date(item.errorTime).toString()}}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    描述:{{item.errorDepict}}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    错误等级：{{item.errorLevel}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                </div>
            </v-card>
        </div>
        <v-dialog
                v-model="dialogVisibility"
                max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">修改错误信息</span>
                    <span class="text--h6">{{selectErrorData.uid}}</span>
                </v-card-title>
                <v-container>
                    <v-file-input
                            v-model="files"
                            accept="image/*"
                            label="错误图片">
                    </v-file-input>
                </v-container>
                <v-card-actions>
                    <v-btn color="green" @click="uploadInfo">
                        上传
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    var axios = require('axios').default;

    export default {
        name: "warn-main",
        data: () => ({
            files: null,
            errorData: "",
            selectErrorData: "",
            levelHighValue: [],
            levelLowValue: [],
            dialogVisibility: false
        }),
        methods: {
            getErrorData: function () {
                var config = {
                    method: 'get',
                    url: '/work/covererror/list?limit=100&page=1',
                    headers: {}
                };
                axios(config)
                    .then((response) => {
                            this.errorData = response.data.page.records;
                            console.log(response.data)
                            for (let i = 0; i < response.data.page.records.length; i++) {
                                let record = response.data.page.records[i];
                                if (record.errorLevel >= 1 && record.errorLevel < 3) {
                                    this.levelLowValue.push(record.errorLevel)
                                } else {
                                    this.levelHighValue.push(record.errorLevel)
                                }
                            }
                            //计算高危险和低危
                        }
                    )
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            updateImage: function (item) {
                console.log(item)
                this.files = "";
                this.selectErrorData = item;
                this.dialogVisibility = true;
            },
            uploadInfo: function () {
                this.dialogVisibility = false;
                var FormData = require('form-data');
                var data = new FormData();
                data.append('file', this.files);
                var config = {
                    method: 'post',
                    url: '/work/covererror/postFile/' + this.selectErrorData.uid,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    data: data
                };

                axios(config)
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                        //刷新
                        this.getErrorData();
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            }
        },
        mounted() {
            this.getErrorData();
        },
        computed: {},
    }
</script>

<style>
    .status-card-box {
        margin: 20px !important;
    }

    .error-item-card-box {
        margin-top: 20px;
    }

    .error-row-box {
        margin: 10px;
    }

</style>
