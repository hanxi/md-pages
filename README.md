# markdown 博客

为小团队内部分享技术文档而生的一个 markdown 博客

## 运行

* 启动 http 服务器
```bash
$ cd md-pages
$ python SimpleHTTPServer 8000
```

文件服务器的配置在 `config.js`
```js
config = {
    blog_name: "博客 ● 文档",
    file_server: "http://"+window.location.hostname+":8001",
};
```

* 启动 http file server
```bash
$ cd http-file-server
$ mkdir -p files/md
$ python file-server.py files 8001
```

* 使用浏览器访问 <http://localhost:8000>

## 文件服务器

默认使用 [http-file-server]

文件服务器的需求简单：读取文件夹和文件，上传文件。不喜欢 [http-file-server] 可以自己实现。

使用云存储也许也是可行的。

## 感谢

* [marked] => 解析 [GFM] 语法
* [codemirror] => [GFM] 编辑器

## TODO

- [x] markdown 编辑器编辑和实时预览
- [x] 编辑器保存文件到服务器
- [x] 编辑器拖拽上传图片
- [x] 编辑器缓存未发布的文件
- [x] 主页和文章页面
- [ ] 主页文档分页加载
- [ ] 预览滚动条带动编辑器滚动条

## MORE

<http://blog.hanxi.info/?p=10>

[marked]:https://github.com/chjj/marked
[codemirror]:https://codemirror.net/
[GFM]:https://help.github.com/articles/github-flavored-markdown/
[http-file-server]:https://github.com/hanxi/http-file-server
