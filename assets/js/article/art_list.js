$(function () {
    // 定义一个查询的参数对象，将来请求数据的时候，需要把请求对象提交到服务器
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })

    }

    initTable()


    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类可选项
                let htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    initCate()

    // 为筛选表单绑定submit时间
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //容器id
            count: total,  //总数据条数
            limit: q.pagesize,  //每页显示几条
            curr: q.pagenum, //默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 可以通过first的值来判断通过哪种方式触发的jump
            jump: function (obj, first) {
                q.pagenum = obj.curr //渲染出最新的页码值
                // 把最新的条目数复制到q的pagesize属性中
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理形式绑定删除
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        console.log(res, id)
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除成功')
                    // 判断当数据删除后当页是否还有剩余的数据
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })

    // 点击编辑按钮跳转到修改文章
    $('tbody').on('click', '.btn-edit', function () {
        let id = $(this).attr('data-id')
        localStorage.setItem('articleId', id)
        location.href = './art_edit.html'
    })
})