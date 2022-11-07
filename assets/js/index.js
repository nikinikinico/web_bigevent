$(function () {
    getUserInfo()

    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        let layer = layui.layer
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清空本地存储的token,重新跳转到登陆页
            localStorage.removeItem('token')
            location.href = './login.html'

            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        //headers就是请求头配置对象
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用渲染用户的头像
            renderAvatar(res.data)
        },
        // 不论成功还是失败都会调用此函数
        complete: function (res) {
            // console.log('执行了 complete 回调：')
            // console.log(res)
            // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1. 强制清空 token
                localStorage.removeItem('token')
                // 2. 强制跳转到登录页面
                location.href = './login.html'
            }
        }

    })
}

// 渲染用户的头像
function renderAvatar(user) {
    let name = user.nickname || user.username
    $('#welcome').html(`欢迎 ` + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}