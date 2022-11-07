// 每次调用ajax函数的时候会先调用这个函数,在这个函数可以拿到我们给ajax提供配置的对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
})