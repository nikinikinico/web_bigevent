$(function () {
    let layer = layui.layer
    let form = layui.form
    //加载文章分类
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用
                form.render()
            }
        })
    }

    initCate()
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        let newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })

    // 定义文章的发布状态
    let art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // submit提交
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于from表单快速创建FormData对象
        let fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 将封面裁剪过后的图片输出为对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发起ajax
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            // 注意：如果向服务器提交的是formdata格式的数据，必须添加以下两个配置项
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败！')
                }
                layer.msg('发布文章成功')
                location.href = '../article/art_list.html'
            }

        })
    }
})