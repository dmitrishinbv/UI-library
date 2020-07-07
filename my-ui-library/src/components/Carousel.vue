<template>
    <div>
        <div class="carousel-control">
            <label class="label-carousel-control">Показывать картинок в окне карусели:</label>
            <MyButton @click="changeCarouselWidth(1)" btntext="1" size="standard" border="border-round-5"/>
            <MyButton @click="changeCarouselWidth(2)" btntext="2" size="standard" border="border-round-5"/>
            <MyButton @click="changeCarouselWidth(3)" btntext="3" size="standard" border="border-round-5"/>
        </div>
        <div :style="{width:calcCarouselWidth+'px', height:carouselHeight+'px'}" class="carousel">
            <ul class="images-list" :style="{marginLeft:position+'px'}">
                <li v-for="(img, i) in images"><img :src="img" alt="UI-library carousel element"></li>
            </ul>
            <i class="fas fa-chevron-left carousel-btn-prev" @click="prevImg" :class="{hide:position===0}"></i>
            <i class="fas fa-chevron-right carousel-btn-next" @click="nextImg"
               :class="{hide:position===-carouselWidth*(images.length-displayElementsInFrame)}"></i>
        </div>
    </div>
</template>


<script lang="ts">
    import Vue from 'vue';
    import MyButton from '@/components/MyButton.vue';

    export default Vue.extend({
        name: 'Carousel',
        components: {
            MyButton,
        },
        props: {
            images: {
                type: Array,
                required: true,
            },
            carouselWidth: {
                type: Number,
                required: true,
            },
            carouselHeight: {
                type: Number,
                required: true,
            },
        },

        methods: {
            prevImg(): void {
                this.position += this.carouselWidth * this.displayElementsInFrame;
                this.position = Math.min(this.position, 0);
            },
            nextImg(): void {
                this.position -= this.carouselWidth * this.displayElementsInFrame;
                this.position = Math.max(this.position,
                    -this.carouselWidth * (this.images.length - this.displayElementsInFrame));
            },
            changeCarouselWidth(id: number): void {
                this.newCarouselWidth = this.carouselWidth * id;
                this.displayElementsInFrame = id;
            },
        },

        computed: {
            calcCarouselWidth(): number {

                return this.newCarouselWidth === 0 ? this.carouselWidth : this.newCarouselWidth;
            },
        },

        data() {
            return {
                position: 0,
                displayElementsInFrame: 1,
                newCarouselWidth: 0,
            };
        },
    });
</script>


<style scoped lang="less">
    .carousel {
        position: relative;
        border: 1px solid #CCC;
        overflow: hidden;
        margin: 0 auto;
    }

    .carousel img {
        display: block;
    }

    .images-list {
        padding: 0;
        list-style: none;
        transition: transform 300ms ease-in;
        font-size: 0;
    }

    li {
        display: inline-block;
    }

    .carousel-btn-prev {
        left: 2px;
        .btn;
    }

    .carousel-btn-next {
        right: 2px;
        .btn;
    }


    .btn {
        top: 45%;
        position: absolute;
        border: solid 1px grey;
        background: aliceblue;
        color: black;
        opacity: 0.5;
        font-size: large;
        cursor: pointer;

        &:hover {
            box-shadow: 0 0 1vh white;
        }

        &:active {
            opacity: 1;
        }
    }

    .hide {
        display: none;
    }

    .carousel-control {
        display: flex;
        justify-content: center;
        margin-bottom: 2vh;
        color: black;
    }

    .label-carousel-control {
        margin-top: 1vh;
        font-size: 120%;
        font-weight: bold;
        color: darkblue;
    }

    @media only screen and (max-width: 600px) {
        body {
            margin: 0;
        }

        .carousel-control * {
            font-size: 70%;
        }

        .carousel {
            left: 0;
            max-width: 95vw;
        }
    }
</style>
