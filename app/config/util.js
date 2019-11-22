module.exports.register = function (Handlebars) {
    Handlebars.registerHelper('ternary', function(test, yes, no) {
        if(typeof test != 'undefined'){
          return yes
        }else{
          return no
        }
      
    });
};