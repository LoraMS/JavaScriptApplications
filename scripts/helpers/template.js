import Handlebars from 'handlebars';
import handlebars  from 'handlebars';

class HandlebarsTemplates {
    constructor(){
        this.cache = {};
    }

    getTemplate(name){
        let cache = this.cache;
        let _this = this;
        return new Promise(function(resolve, reject){
            if(cache[name]){
                resolve(cache[name]);
            } else {
                $.get(`../../templates/${name}.handlebars`, function(templateHtml){
                    let template = handlebars.compile(templateHtml);
                    cache[name] = template;
                    resolve(template);
                });
                _this.cache = cache;
            }
        });
        
    }
}

let templates = new HandlebarsTemplates();

export { templates as templates };