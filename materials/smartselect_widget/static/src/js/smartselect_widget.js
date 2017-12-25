odoo.define('smartselect_widget.form_widgets', function (require) {
    "use strict";

    var Model = require('web.Model');
    var DataModel = require('web.DataModel');
    var core = require('web.core');
    var form_common = require('web.form_common');
    var FieldChar = core.form_widget_registry.get('char');

    var SmartSelectWidget = FieldSelection.extend({
        template: 'SmartSelectWidget',
        events: {
            "change": "value_changed",
        },
        initialize_content: function() {
          console.log("init_content");
          console.log(this);
        },
        query_values: function() {
            var self = this;
            var def;
            if (this.field.type === "many2one") {
                var model = new Model(this.field.relation);
                def = model.call("name_search", ['', this.get("domain")], {
                    "context": this.build_context()
                });
            } else {
                var values = _.reject(this.field.selection, function(v) {
                    return v[0] === false && v[1] === '';
                });
                def = $.when(values);
            }
            this.records_orderer.add(def).then(function(values) {
                if (!_.isEqual(values, self.get("values"))) {
                    self.set("values", values);
                }
            });
        },

        value_changed: function() {
console.log("value_changed")
          var val=this.$el.val();
          this.set('value',val);
          this.internal_set_value(val);
//          this.getParent().save();
        },


        render_value: function () {
console.log("render_value");
          var model=new DataModel(this.node.attrs.model);
          var self=this;
          var curVal=this.get('value');
console.log("Value:",curVal);
          model.query(['name','id'])
            .filter([['ptype','=','2']])
            .all()
            .then(function(list){
              var sel=self.$el.find('select');
              var note=self.$el.find('.note');
              if(!self.get('effective_readonly')){
                //edit mode
                if(!list.length){
                  sel.hide();
                  note.html("There are no items").show();
                } else {
                  sel.empty();
                  $.each(list, function(i,ele){
                    sel.append($('<option value="'+ele.id+'">'+ele.name+'</option>'))
                  })
                  sel.val(curVal).show();
                  note.html("").hide();
                };

              } else {
                //read mode
                var found='';
                for(var cnt=0,m=list.length;cnt<m;cnt++){
                  if(list[cnt].id==curVal){
                    found=list[cnt].name;
                    break;
                  }
                }
                if(!found) found="There are no items";
                note.html(found).show();
              }
            })
        }
    });
    core.form_widget_registry.add('SmartSelect', SmartSelectWidget);
});
