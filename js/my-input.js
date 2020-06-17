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
        required: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    template: `
<div class="input-group">
  <label :for="title">{{ this.title }}
   <span v-if="required">*</span><br>
   </label>
  <input :type= "type" 
    :placeholder="placeholder" 
    :required="required"
    >
</div>
`
});


