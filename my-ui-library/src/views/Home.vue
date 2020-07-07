<template>
    <div class='home'>
        <h1>My UI library</h1>
        <h2>Buttons examples</h2>
        <div v-for="bsize in btnsizes">
            <h4>{{bsize}} series buttons</h4>
            <MyButton
                    @click='showEvent' v-for="bcolor in btncolors" :color=bcolor :size=bsize :btntext="bcolor+' '+bsize"
            />
        </div>
        <h4 class='underline'>Default size and color with border-round btns</h4>
        <MyButton @click='showEvent' border='border-round-5' btntext='border-round-5 btn'/>
        <MyButton @click='showEvent' border='border-round-10' btntext='border-round-10 btn'/>
        <h2>Grid examples</h2>
        <Row>
            <Column class='grid-item' v-for='i in 12' :cols='1'>Col1</Column>
        </Row>
        <Row>
            <Column class='grid-item' v-for='i in 6' :cols='2'>Col2</Column>
        </Row>
        <Row>
            <Column class='grid-item' v-for='i in 4' :cols='3'>Col3</Column>
        </Row>
        <Row>
            <Column class='grid-item' v-for='i in 3' :cols='4'>Col4</Column>
        </Row>
        <Row>
            <Column class='grid-item' v-for='i in 2' :cols='6'>Col6</Column>
        </Row>
        <Row>
            <Column class='grid-item' :cols='7'>Col7</Column>
            <Column class='grid-item' :cols='2'>Col2</Column>
            <Column class='grid-item' :cols='1'>Col1</Column>
        </Row>
        <Row>
            <Column class='grid-item' :cols='12'>Col12</Column>
        </Row>
        <Row>
            <Column class='grid-item' :cols='10'>
                <Row>
                    <Column class='grid-item' :cols='6'>6 in cols10</Column>
                    <Column class='grid-item' :cols='6'>6 in cols10</Column>
                </Row>
            </Column>
        </Row>
        <Row>
            <Column class='grid-item' :cols='8'>
                <Row>
                    <Column class='grid-item' :cols='4'>4 in cols8</Column>
                    <Column class='grid-item' :cols='2'>2 in cols8</Column>
                    <Column class='grid-item' :cols='5'>5 in cols8</Column>
                </Row>
            </Column>
        </Row>
        <h2>Modal window example</h2>
        <Modal>
            <template v-slot:trigger></template>
            <template v-slot:header>Modal header</template>
            Modal content<br>
            Modal content<br>
            Modal content<br>
            Modal content<br>
            Modal content
            <template v-slot:footer>
                <MyButton @click='showEvent' color='success' border='border-round-5'
                          size='standard' btntext='Отправить'/>
            </template>
        </Modal>
        <h2>Carousel</h2>
        <Carousel :images=images :carouselWidth=carouselWidth :carouselHeight=carouselHeight></Carousel>
        <br>
        <h2>DataTable</h2>
        <DataTable :items=users :columns=columns :search=search
                   :sortButtonsIcons=sortButtonsIcons :sortButtonsIconsNumeric=sortButtonsIconsNumeric>
        </DataTable>
        <br>
    </div>
</template>

<script lang="js">
    // @ is an alias to /src
    // import 'kit.fontawesome.com/a92211bf3b.js';
    import HelloWorld from '@/components/HelloWorld.vue';
    import MyButton from '@/components/MyButton.vue';
    import Modal from '@/components/Modal.vue';
    import Carousel from '@/components/Carousel.vue';
    import Row from '@/components/grid/Row.vue';
    import Column from '@/components/grid/Column.vue';
    import DataTable from '@/components/DataTable.vue';

    export default {
        name: 'Home',
        components: {
            HelloWorld,
            MyButton,
            Row,
            Column,
            Modal,
            Carousel,
            DataTable,
        },
        methods: {
            showEvent(e) {
                alert('You pressed button ' + e);
            },
            toKeyboardLayout(str) {
                const associativeArray = {
                    'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г',
                    'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы',
                    'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
                    ';': 'ж', "'": 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и',
                    'n': 'т', 'm': 'ь', ',': 'б', '.': 'ю', '/': '.',
                };
                return str.replace(/[A-z/,.;\]\[]/g, function(x) {
                    return x === x.toLowerCase() ? associativeArray[x] : associativeArray[x.toLowerCase()].toUpperCase();
                });
            },
        },
        data() {
            return {
                btncolors: ['dark', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'link'],
                btnsizes: ['extrasmall', 'small', 'standard', 'medium', 'large', 'extralarge'],
                images: ['https://loremflickr.com/320/240?random=1',
                    'https://loremflickr.com/320/240?random=2',
                    'https://loremflickr.com/320/240?random=3',
                    'https://loremflickr.com/320/240?random=4',
                    'https://loremflickr.com/320/240?random=5',
                    'https://loremflickr.com/320/240?random=6',
                    'https://loremflickr.com/320/240?random=7',
                    'https://loremflickr.com/320/240?random=8',
                    'https://loremflickr.com/320/240?random=9',
                    'https://loremflickr.com/320/240?random=10',
                ],
                carouselWidth: 320,
                carouselHeight: 240,
                columns: [
                    {title: '№', value: '_index'},
                    {title: 'Имя', value: 'name', sortable: true},
                    {title: 'Фамилия', value: 'surname'},
                    {title: 'Возраст', value: 'age', type: 'number', sortable: true},
                ],
                users: [
                    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
                    {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
                    {id: 30052, name: 'Коля', surname: 'Мастер', age: 23},
                    {id: 30053, name: 'Вадик', surname: 'Боцман', age: 11},
                ],
                search: {
                    fields: ['name', 'surname'],
                    filters: [
                        (v) => v.toLowerCase(), // для сравнения без учета регистра
                        (v) => this.toKeyboardLayout(v.toLowerCase()),
                    ],

                    // fields: true,
                    // filters: [
                    //    (v) => v.toLowerCase(),
                    //    (v) => this.toKeyboardLayout(v.toLowerCase()),
                    // ],
                },
                sortButtonsIcons: ['fas fa-sort', 'fas fa-sort-alpha-up', 'fas fa-sort-alpha-down'],
                sortButtonsIconsNumeric: ['fas fa-sort', 'fas fa-sort-numeric-up-alt', 'fas fa-sort-numeric-down-alt'],
            };
        },
    };

</script>
<style lang='less'>
    #app {
        background: url('https://i1.wp.com/singsmart.com/wp-content/uploads/2017/12/snow08.jpg?resize=300%2C300&ssl=1') repeat;
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

    i {
        color: red;
    }
</style>
