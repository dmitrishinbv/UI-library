<template>
    <div class="home">
        <h1>My UI library</h1>
        <h2>Buttons examples</h2>
        <div v-for="bsize in btnsizes">
            <h4>{{bsize}} series buttons</h4>
            <MyButton
                    @click='showEvent' v-for="bcolor in btncolors" :color=bcolor :size=bsize :btntext="bcolor+' '+bsize"
            />
        </div>
        <h4 class="underline">Default size and color with border-round btns</h4>
        <MyButton @click="showEvent" border="border-round-5" btntext="border-round-5 btn"/>
        <MyButton @click="showEvent" border="border-round-10" btntext="border-round-10 btn"/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import MyButton from '@/components/MyButton.vue'

    export default {
        name: 'Home',
        components: {
            HelloWorld,
            MyButton
        },
        methods: {
            showEvent(e) {
                alert(e);
            },
        },
        data() {
            return {
                btncolors: ['dark', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'link'],
                btnsizes: ['extrasmall', 'small', 'standard', 'medium', 'large', 'extralarge'],
            }
        }
    }
</script>
<style lang="less">
    #app {
        background: url('https://i1.wp.com/singsmart.com/wp-content/uploads/2017/12/snow08.jpg?resize=300%2C300&ssl=1')
        repeat;
    }

    div, button {
        margin-bottom: 5px;
    }

    .underline {
        text-decoration: underline;
    }
</style>
