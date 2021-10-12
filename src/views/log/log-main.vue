<template>
    <div>
        <div class="left-calendar-box">
            <v-card>
                <v-sheet height="64">
                    <v-toolbar>
                        <v-btn
                                outlined
                                class="mr-4"
                                color="pink darken-1"
                                @click="setToday">
                            今天
                        </v-btn>
                        <v-btn
                                fab
                                text
                                small
                                color="grey darken-1"
                                @click="prev">
                            <v-icon small>
                                mdi-chevron-left
                            </v-icon>
                        </v-btn>
                        <v-btn
                                fab
                                text
                                small
                                color="grey darken-2"
                                @click="next">
                            <v-icon small>
                                mdi-chevron-right
                            </v-icon>
                        </v-btn>
                        <v-toolbar-title v-if="$refs.calendar">
                            {{ $refs.calendar.title }}
                        </v-toolbar-title>
                    </v-toolbar>
                </v-sheet>
                <v-sheet height="600">
                    <v-calendar
                            ref="calendar"
                            v-model="focus"
                            color="pink "
                            type="category"
                            :event-more="true"
                            category-show-all
                            :categories="categories"
                            :events="events"
                            :event-color="getEventColor"
                    ></v-calendar>
                </v-sheet>
            </v-card>
        </div>

        <!--显示log列表-->
        <div class="log-list-card">
            <v-card>
                <v-list dense three-line>
                    <v-list-item-group
                            color="pink" v-if="logPage">
                        <template v-for="(record, index) in logPage.page.records">
                            <v-list-item :key="record.coverUid+index">
                                <v-list-item-content>
                                    <v-list-item-title v-text="itemTitle(record)"/>
                                    <v-list-item-subtitle v-text="new Date(record.logTime).toString()"/>
                                    <v-list-item-subtitle v-text="itemSubTitle(record)"/>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider :key="index"></v-divider>
                        </template>
                    </v-list-item-group>

                </v-list>
                <!--            数据迭代器-->
                <v-card-text>
                    <v-pagination
                            v-if="logPage"
                            v-model="logPage.page.current"
                            color="pink"
                            :total-visible="7"
                            :length="logPage.page.pages"
                            @input="changePagination"
                    ></v-pagination>
                </v-card-text>

            </v-card>
        </div>

    </div>
</template>

<script>
    const axios = require('axios').default;

    export default {
        data: () => ({
            pagination: 0,
            focus: '',
            events: [],
            colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
            names: [],
            categories: ['井盖日志'],
            logPage: "",
        }),
        computed: {},
        mounted() {
            this.fetchEvents();
            this.$refs.calendar.checkChange();

        },
        methods: {
            changePagination: function (info) {
                console.log(info)
                this.getLogByService(7, info, null);
            },
            itemSubTitle: record => "LOG信息:" + record.log,
            itemTitle: record => "UUID:" + record.coverUid,
            getEventColor(event) {
                return event.color
            },
            setToday() {
                this.focus = ''
            },
            prev() {
                this.$refs.calendar.prev()
            },
            next() {
                this.$refs.calendar.next()
            },
            getLogByService: function (limit, page, success) {
                var config = {
                    method: 'get',
                    url: '/work/coverlog/list?page=' + page + '&limit=' + limit,
                    headers: {}
                };
                axios(config)
                    .then((response) => {
                        console.log("fetchEvents", response)
                        this.logPage = response.data;
                        if (success) {
                            success();
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }, fetchEvents: function () {
                const events = []
                let that = this;

                function success() {
                    if (that.logPage.msg === "success" && that.logPage.page.records.length > 0) {
                        that.records = that.logPage.page.records;
                        for (let i = 0; i < that.logPage.page.records.length; i++) {
                            addEvent(that.logPage.page.records[i]);
                        }
                    }
                }

                that.getLogByService(7, 1, success);

                //添加event的逻辑
                function addEvent(record) {
                    //添加事件
                    events.push({
                        name: record.coverUid,
                        start: record.logTime,
                        end: record.logTime + (1000 * 60 * 60),
                        color: that.colors[that.rnd(0, that.colors.length - 1)],
                        timed: true,
                        category: that.categories[0],
                    })
                }

                that.events = events
            },
            rnd: function (a, b) {
                return Math.floor((b - a + 1) * Math.random()) + a
            },
        },
    }
</script>

<style>
    /*将display设置为行内元素 ，并且float*/
    .log-list-card {
        width: 66%;
        margin: 10px;
        display: inline-block !important;
        float: right;
    }

    .left-calendar-box {
        margin: 10px;
        width: 30%;
        display: inline-block !important;
    }

</style>
