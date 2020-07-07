<template>
    <div class="users-table">
        <div v-if="search">
            <input type="text" placeholder="search" @input="searchData($event.target.value)">
        </div>
        <table>
            <thead>
            <tr>
                <th v-for="column in columns">
                    {{column.title}}
                    <i v-if="column.sortable===true && column.type !== 'number'"
                       :class="sortButtonsIcons[currentSortStates[column.title]]"
                       @click="sortColumn(column)">
                    </i>
                    <i v-else-if="column.sortable===true && column.type === 'number'"
                       :class="sortButtonsIconsNumeric[currentSortStates[column.title]]"
                       @click="sortColumn(column)">
                    </i>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(entry, index) in sortData">
                <td v-for="column in columns" v-if="column.value==='_index'">{{++index}}</td>
                <td v-else> {{entry[column.value]}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import MyButton from '@/components/MyButton.vue';

    export default Vue.extend({
        name: 'DataTable',
        components: {
            MyButton,
        },

        props: {
            items: {
                type: Array,
                required: true,
            },
            columns: {
                type: Array,
            },
            search: {
                type: Object,
                default: null,
            },
            sortButtonsIcons: {
                type: Array,
            },
            sortButtonsIconsNumeric: {
                type: Array,
            },
        },

        methods: {
            sortColumn: function (column: any) {
                const title: string = column.title;
                let currentState: number = this.currentSortStates[column.title as keyof object];
                let coef: number = 0;

                switch (currentState) {
                    case 0:
                        currentState = 1;
                        coef = 1;
                        break;
                    case 1:
                        currentState = 2;
                        coef = -1;
                        break;
                    default :
                        currentState = 0;
                }

                // change icons and column sort states
                this.columns.forEach((column: any) => {
                    column.title !== title ? this.$set(this.currentSortStates, column.title, 0)
                        : this.$set(this.currentSortStates, column.title, currentState);

                });

                // sort data
                if (column.type === 'number') {
                    this.sortData.sort(function (a: any, b: any) {
                        return coef * (a[column.value] - b[column.value]);
                    });


                } else {
                    this.sortData.sort(function (a: any, b: any) {
                        return coef * a[column.value].localeCompare(b[column.value]);
                    });
                }
            },


            searchData: function (query: string) {
                this.initSearch = (query.trim() !== '') ? 1 : 0;
                let searchResults: any = [];

                if (this.initSearch) {
                    const searchFields = (this.search.fields && this.search.fields.length) ? this.search.fields
                        : this.columns.map((item: any) => {
                            return item.value;
                        });


                    const inputFilters = (this.search && this.search.filters) ? this.search.filters : [function (v: any) {
                        return v;
                    }];

                    searchResults = this.items.filter((row: any) => {
                        let find: boolean = false;
                        searchFields.filter((field: any) => {
                            inputFilters.filter((filter: any) => {
                                if (!find && filter(row[field]).indexOf(filter(query)) !== -1) {
                                    find = true;
                                }
                            }).length;
                        }).length;
                        return find;
                    });
                    this.sortData = searchResults;

                } else {
                    this.sortData = this.items;
                }
            },


            initState: function () {
                this.columns.forEach((column: any) => {
                    this.$set(this.currentSortStates, column.title, 0);
                });
            },

        },

        created() {
            this.initState()
        },


        data() {
            return {
                initSearch: 0,
                currentSortStates: Object,
                findData: Array.from(this.items),
                sortData: Array.from(this.items),
            };
        },

    });

</script>

<style scoped lang="less">
    .users-table * {
        border-collapse: collapse;
        width: 60vw;
        color: black;
        margin: 1vh auto;
        padding: 0.5vh 0.5vw;
    }

    .users-table th, td {
        border: 1px solid #ddd;
    }

    .users-table th {
        background-color: #525c6a;
        color: white;
        vertical-align: middle;
        white-space: nowrap
    }

    .users-table tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    .users-table .align-right {
        text-align: right;
    }

    .users-table .align-center {
        text-align: center;
    }

    th .fas {
        margin: 0 0 0 1vw;
        padding: 0;
        color: white;
        width: auto;
        cursor: pointer;

        &:active,
        &:hover {
            color: #75ff56;
        }
    }

    .avatar-img {
        max-width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
        border: 0
    }

    [class ^= "mybtn"] {
        width: auto;
        margin: 0;
    }

    .add-btn {
        color: white;
        display: block;
        margin-left: 10vw;
        padding: 0.5vh 1.5vw;
    }

    .add-user-btns {
        display: flex;
        justify-content: center;
    }

    .row {
        margin-bottom: 2vh;
    }

</style>
