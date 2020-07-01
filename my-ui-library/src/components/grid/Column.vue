<template>
    <div :class="'grid-col'+cols">
        <slot></slot>
    </div>
</template>

<script lang="ts">

    export default {
        name: 'Column',
        props: {
            cols: {
                type: Number,
                default: 12,
            },
        },
    };
</script>

<style lang="less">
    @columns: 12;

    .generate_cols(@i: 1) when (@i <= @columns) {
        .grid-col@{i} {
            grid-column-end: span @i;
        }
        .generate_cols(@i + 1);
    }

    .generate_cols();
</style>
