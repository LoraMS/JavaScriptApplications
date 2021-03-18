SystemJS.config({
    'transpiler': 'plugin-babel',
    'map': {
        'plugin-babel': './node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': './node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',

        'jquery': './bower_components/jquery/dist/jquery.min.js',
        'bootstrap': './bower_components/bootstrap/dist/js/bootstrap.js',
        'handlebars': './bower_components/handlebars/handlebars.js',
        'toastr': './bower_components/toastr/toastr.js',
        'sammy': './bower_components/sammy/lib/sammy.js',

        'app': './scripts/app.js',
        'templates': './scripts/helpers/template.js',
        'userModel': './scripts/requests/authentication-request.js',
        'appModel': './scripts/requests/app-requests.js',
        'userController': './scripts/controllers/userController.js',
        'appController': './scripts/controllers/appController.js',
        
        'shoppingCartController': './scripts/controllers/shoppingCartController.js',
        'shoppingCartManager': './scripts/managers/shoppingCartManager.js',
    }
});

System.import('app');