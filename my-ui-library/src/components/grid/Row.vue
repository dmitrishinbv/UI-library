<template>
    <div class="row">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    export  default Vue.extend ({
        name: "Row"
    })
</script>

<style lang="less">
    .row {
        display: grid;
        grid-template-columns: repeat(12, calc(100% / 12 - 1vw));
        grid-gap: 1vw;
        margin-left: 5px;
    }
</style>
