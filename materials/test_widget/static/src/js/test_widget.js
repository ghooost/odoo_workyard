odoo.define('test_widget.form_widgets', function (require) {
    "use strict";

    var core = require('web.core');
    var form_common = require('web.form_common');
    var FieldInteger = core.form_widget_registry.get('integer');

    var DiscountWidget = FieldInteger.extend({
        template: 'DiscountWidget',
        events: {
            "change input": "value_changed",
        },
        value_changed: function() {
          var val=this.$el.find('input').val();
          this.set('value',val);
          this.getParent().save();
        },
        render_value: function () {
            var show_value = this.format_value(this.get('value'), '');
            this.$el.find('input').val(show_value);
            if(this.$input){
              this.$input=this.$el.find('input');
            };
        }
    });
    core.form_widget_registry.add('Discount', DiscountWidget);
});
