<template>
    <div>
        <MyButton class="modal-trigger" @click="open" :btntext="this.openBtnText">
            <slot name="trigger"></slot>
        </MyButton>
        <div class="modal" :class="{active:isActive}">
            <div class="modal-header">
                <slot name="header"></slot>
                <button class="top-close-btn" @click="close">X</button>
            </div>
            <div class="modal-content">
                <slot></slot>
            </div>
            <div class="modal-footer">
                <MyButton color="danger" size="standard" border="border-round-5"
                          @click="close" :btntext="this.footerCloseBtnText"/>
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import MyButton from '@/components/MyButton.vue';

    export default Vue.extend({
        name: 'Modal',
        components: {
            MyButton,
        },

        props: {
            openBtnText: {
                type: String,
                default: 'Открыть',
            },
            footerCloseBtnText: {
                type: String,
                default: 'Отменить',
            },
        },

        methods: {
            close(): void {
                this.isActive = false;
                this.$emit('close');
            },
            open(): void {
                this.isActive = true;
                this.$emit('open');
            },
        },

        data() {
            return {
                isActive: false,
            };
        },
    });
</script>


<style lang="less">
    /* The Modal (background) */
    .modal {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        padding-top: 10vh;
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        background-color: rgb(0, 0, 0); /* Fallback color */
        background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
    }

    .modal-header {
        background-color: #c8f6a8;
        height: 5vh;
        color: #ff5c4d;
        .modal-main;

        button {
            cursor: pointer;
        }
    }

    .modal-content {
        color: black;
        max-height: 70vh;
        overflow: auto;
        background-color: #fefefe;
        .modal-main;
    }

    .modal-footer {
        position: relative;
        background-color: #c8f6a8;
        height: auto;
        .modal-main;
    }

    .modal-main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid #888;
        margin: auto;
        padding: 10px;
        width: 80%;
    }

    .centered {
        position: relative;
        display: flex;
        padding-top: 2vw;
        justify-content: space-around;
        align-items: center;
    }

    .bottom-close-btn {
        position: absolute;
        left: 30%;
        margin-top: 0;
        max-width: 25%;
    }

    .bottom-close-btn-last {
        position: absolute;
        left: 45%;
        margin-top: 0;
        max-width: 25%;
    }

    .show-another-btn {
        position: absolute;
        left: 50%;
        margin-top: 0;
    }

    .active {
        display: block;
    }

    .mt-40 {
        padding-top: 40px;
        margin-top: 40px;
    }

    .top-close-btn {
        position: absolute;
        left: 88%;
        top: 10%;
        color: black;
        border: none;
        background: transparent;
        font-size: large;

        &:active,
        &:hover,
        &:focus {
            outline: none;
            color: black;
            background: transparent;
        }

    }

    @media only screen and (max-width: 600px) {
        h2 {
            font-size: smaller;
        }

        .large {
            font-size: 100%;
        }

        .bottom-close-btn {
            left: 5%;
        }

        .top-close-btn {
            left: 86%;
        }

        .show-another-btn {
            left: 35%;
        }

        .mt-40 {
            margin-top: 40px;
            padding-top: 80px;
        }
    }

    .modal-header a {
        color: #17a2b8;
    }
</style>
