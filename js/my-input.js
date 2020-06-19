Vue.component('my-input', {
    props: {
        type: {
            type: String,
        },
        placeholder: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        required: {
            type: Boolean,
            required: false,
            default: false
        },
        pattern: {
            required: false,
        },
    },
    template: `
<div class="input-group">
  <label :for="title">{{ this.title }}
   <span v-if="required">*</span><br>
   </label>
  <input      
  @focus="changeInput"
  @blur="checkPattern"
    :type= "type" 
    :placeholder="placeholder" 
    :required="required"
    :name="name"
    :class="{'invalid': isInvalid, 'input-error': isInputError}"
    >
</div>
`,
    methods: {
        checkPattern: function (event) {
            if (!event.target.value) {
                this.isInputError = false; //placeholder text always is correct
            }

            else {
                if (this["name"] === "email") {
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    this.isInputError = !re.test(event.target.value);
                }

                if (this["name"] === "age") {
                    const age = event.target.value;
                    this.isInputError = !age.length || age < 0 || age > 130;
                }

                if (this["name"] === "name") {
                    const re = /^[A-Za-zА-Яа-яІіЄєЇїҐґ|\s]+$/;
                    this.isInputError = !re.test(event.target.value);
                }
            }

            this.isInvalid = (event.target.required && !event.target.value);
          },

        // reset all errors if input in focus
        changeInput: function (event) {
            this.isInvalid = false;
            this.isInputError = false;
        }
    },

    data() {
        return {
            answers: this.value,
            isInvalid: false,
            isInputError: false,
        }
    },
});


