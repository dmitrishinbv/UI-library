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
        <h2>Grid examples</h2>
        <Row>
            <Column class="grid-item" v-for="i in 12" :cols='1'>Col1</Column>
        </Row>
        <Row>
            <Column class="grid-item" v-for="i in 6" :cols='2'>Col2</Column>
        </Row>
        <Row>
            <Column class="grid-item" v-for="i in 4" :cols='3'>Col3</Column>
        </Row>
        <Row>
            <Column class="grid-item" v-for="i in 3" :cols='4'>Col4</Column>
        </Row>
        <Row>
            <Column class="grid-item" v-for="i in 2" :cols='6'>Col6</Column>
        </Row>
        <Row>
            <Column class="grid-item" :cols='7'>Col7</Column>
            <Column class="grid-item" :cols='2'>Col2</Column>
            <Column class="grid-item" :cols='1'>Col1</Column>
        </Row>
        <Row>
            <Column class="grid-item" :cols='12'>Col12</Column>
        </Row>
        <Row>
            <Column class="grid-item" :cols='10'>
                <Row>
                <Column class="grid-item" :cols='6'>6 in cols10</Column>
                <Column class="grid-item" :cols='6'>6 in cols10</Column>
                </Row>
            </Column>
        </Row>
        <Row>
            <Column class="grid-item" :cols='8'>
                <Row>
                    <Column class="grid-item" :cols='4'>4 in cols8</Column>
                    <Column class="grid-item" :cols='2'>2 in cols8</Column>
                    <Column class="grid-item" :cols='5'>5 in cols8</Column>
                </Row>
            </Column>
        </Row>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import MyButton from '@/components/MyButton.vue'
    import Row from '@/components/grid/Row.vue'
    import Column from '@/components/grid/Column.vue'

    export default {
        name: 'Home',
        components: {
            HelloWorld,
            MyButton,
            Row,
            Column
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

    .grid-item {
        padding: 5px;
        background: #000;
        color: #fff;
        border-radius: 5px;
        border: 1px solid red;
        text-align: center;
    }
</style>
