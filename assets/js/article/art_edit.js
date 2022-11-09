$(function () {
    let form = layui.form
    let layer = layui.layer
    let id = localStorage.getItem('articleId')

    //初始化富文本
    initEditor()

    // 初始化图片裁剪器
    var $image = $('#image')

    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $image.cropper(options)

    //初始化文章类别
    initFilesCate()
    function initFilesCate() {
        // 获取所有分类
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
            }
        })

    }
    // 初始化文章内容id,标题和内容
    initFiles()
    function initFiles() {
        $.ajax({
            method: 'get',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章内容失败')
                }
                form.val('form-pub', res.data)
                // 初始化文章图片
                $image
                    .cropper('destroy')
                    .attr('src', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
                    .cropper(options)
                form.render()
            }
        })
    }

    // 选择封面功能
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
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


    // 更新文章内容功能
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
            url: '/my/article/edit',
            // 注意：如果向服务器提交的是formData格式的数据，必须添加以下两个配置项
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功')
                location.href = '../article/art_list.html'
            }

        })
    }
})