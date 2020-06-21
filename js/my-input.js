const MIN_AGE = 0;
const MAX_AGE = 130;
const ERROR_MSG_TEXT = "Field has incorrect value or illegal symbols";

Vue.component('my-input', {
    props: {
        title: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            required: false,
        },
        required: {
            type: Boolean,
            required: false,
            default: false
        },
        pattern: {
            type: String,
            required: false,
        },
        value: {
            type: String
        },
        error: {
            type: String,
            default: ERROR_MSG_TEXT,
            required: false
        }
    },

    template: `
<div class="input-group">
  <label :for="title">{{ title }}
   <span v-if="required">*</span><br>
   </label>
  <input      
  @focus="discardErrors"
  @blur="checkPattern($event.target.value, $event.target.required, $event.target.pattern)"
  @input="updateValue($event.target.value)"
    :placeholder="placeholder" 
    :required="required"
    :name="name"
    :pattern="pattern"
    :class="{'invalid': isInvalid, 'input-error': isInputError}"
    >
    <span v-if="isInputError" class="error-msg">{{error}}</span>   
</div>
`,

    methods: {
        checkPattern: function (value, required, pattern) {
            console.log(pattern);
            if (!value) {
                this.isInputError = false; //placeholder text is always correct

            } else {
                pattern = new RegExp(pattern);
                     this.isInputError = (this["name"] === "age")
                    ? !pattern.test(value) || value < MIN_AGE || value > MAX_AGE
                    : !pattern.test(value);
            }

            this.isInvalid = (required && !value);
        },

        updateValue: function (value) {
            this.$emit('input', value);
        },

        // discards all errors when input filed in focus
        discardErrors: function () {
            this.isInvalid = this.isInputError = false;
        }
    },
    data() {
        return {
            inputValues: this.value,
            isInvalid: false, //true if required but empty field
            isInputError: false, //true if field has incorrect value or illegal symbols
        }
    },
});