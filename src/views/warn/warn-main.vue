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
        </div>

    </div>
</template>

<script>
    var axios = require('axios').default;

    export default {
        name: "warn-main",
        data: () => ({
            errorData: "",
            levelHighValue: [],
            levelLowValue: [],
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
                            this.errorData = response.data;
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
            }
        },
        mounted() {
            this.getErrorData();
        }
    }
</script>

<style>
    .status-card-box {
        margin: 20px !important;
    }
</style>
