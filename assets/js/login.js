$(function () {
    // 点击 去注册账号的连接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击 去登陆的连接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义校验规则
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()
        let data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }
        $.post('http://www.liulongbin.top:3007/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录')
            $('#link_login').click()
        })
    })

    // 监听登陆表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: 'http://www.liulongbin.top:3007/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功!')
                // 将得到的token保存在localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到主页

                location.href = '/index.html'
            }
        })
    })
})