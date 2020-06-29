const ERROR_MSG_TEXT = "Field has incorrect value or illegal symbols";
const DEFAULT_ERROR = "This field is required";

Vue.component('my-input', {
    props: {
        validation: {
            type: Boolean,
        },
        title: {
            type: String,
            required: true,
        },
        id: {
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
        type: {
            type: String,
            required: false,
        },
        required: {
            type: Boolean,
            required: false,
            default: false
        },
        pattern: {
            type: RegExp,
            required: false,
        },
        value: {
            type: String
        },
        error: {
            type: String,
            default: ERROR_MSG_TEXT,
            required: false
        },
        defaultError: {
            type: String,
            default: DEFAULT_ERROR
        },
    },

    template: `
<div class="input-group">
  <label :for="title">{{ title }}
   <span v-if="required">*</span><br>
   </label>
  <input      

  @blur="checkPattern($event.target.value)"
  @input="updateValue($event.target.value)"
    :placeholder="placeholder" 
    :required="required"
    :name="name"
    :pattern="pattern"
    :type="type"
    :defaultError="defaultError"
    :validation="validation"
    :id="id"
    :class="{'invalid': isInvalid, 'input-error': isInputError}"
    >
    <span v-if="isInputError" class="error-msg">{{error}}</span>  
    <span v-if="isInvalid" class="error-msg">{{defaultError}}</span>   
</div>
`,

    methods: {
        checkPattern: function (value) {
            this.isInputError = (!value) ? false : !value.match(this.pattern) || !this.validation;
            this.isInvalid = (this.required && !value);
        },

        updateValue: function (value) {
            this.isInvalid = this.isInputError = false;    // discards all errors when user typing
            this.$emit('input', value);
        },
    },

    data() {
        return {
            isInvalid: false, //true if required but empty field
            isInputError: false, //true if field has incorrect value or illegal symbols
        }
    },
});
