onload = function()
{
    hljs.initHighlightingOnLoad();
    marked.setOptions({
        highlight: function (code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(lang, code).value;
            }
            return hljs.highlightAuto(code).value;
        }
    });

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: 'gfm',
    });

    var name = loadPageVar("name");
    var type = loadPageVar("type");
    if (type=="modify") {
        var filename = loadPageVar("filename");
        if (filename) {
            getText(getMdUrl()+filename, function(data) {
                editor.setValue(data);
                var newUrl = window.location.href.replace(/&filename=.*$/,"");
                updateUrl(newUrl);

                var pagetitle = filename.replace(/^(\d+\.){7}/,"");
                pagetitle = pagetitle.replace(/\.md$/,"");
                var fileNameView = document.getElementById("file-name");
                fileNameView.value = decodeURI(pagetitle);

                update(editor);
            });
        } else {
            loadCache(editor, name)
            update(editor);
        }
    } else {
        loadCache(editor, name);
        update(editor);
    }
    editor.on('change', update);
    editor.on("scroll", scrollPreview);

    fileNameView = document.getElementById("file-name");
    fileNameView.onblur = updateTitle;

    editor.on("dragenter", function(editor, e){
        e.stopPropagation();
        e.preventDefault();
    }, false);
    editor.on('dragover', function(editor, e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);
    editor.on("drop", handleDrop);
}

function updateUrl(newUrl)
{
    var stateObject = {};
    var title = "";
    history.pushState(stateObject,title,newUrl);
}

function loadCache(editor, name)
{
    // load cache
    if (localStorage[name]) {
        editor.setValue(localStorage[name]);
    } else {
        editor.setValue(defaultmd);
    }

    if (localStorage[name+".title"]) {
        var fileNameView = document.getElementById("file-name");
        fileNameView.value = localStorage[name+".title"];
    }
}

scrollPreview = function(editor)
{
    var preview = document.getElementById("preview");
    var sinfo = editor.getScrollInfo();
    var code = document.getElementById("editor");
    var preview = document.getElementById("preview");
    var per = sinfo.top/(sinfo.height-sinfo.clientHeight);
    preview.scrollTop = (preview.scrollHeight-preview.clientHeight)*per;
}

update = function(editor)
{
    var mdString = editor.getValue();
    render(mdString);
    var name = loadPageVar("name");
    localStorage[name] = mdString;
    updateTitle();
}

updateTitle = function()
{
    var name = loadPageVar("name");
    var fileNameView = document.getElementById("file-name");
    var pagetitle = fileNameView.value;
    localStorage[name+".title"] = pagetitle;
}

render = function(mdString)
{
    var html = marked(mdString);
    var preview = document.getElementById("preview");
    preview.innerHTML = html;
}

publish = function()
{
    var name = loadPageVar("name");
    var mdString = localStorage[name];
    var pagetitle = localStorage[name+".title"];

    if (pagetitle && pagetitle.trim().length>0) {
        localStorage.newPage = undefined;
        var filename = name+"."+pagetitle+".md";
        var url = config.file_server+"/upload?name=md/"+filename;
        postBinary(mdString, url, function(ret) {
            alert("发布结果:\n"+ret);
            ret = JSON.parse(ret);
            if (ret.result==0) {
                window.location.href = encodeURI(encodeURI("/?p="+filename));
            }
        });
    } else {
        alert("请输入标题");
    }
}

handleDrop = function(editor, e)
{
    e.stopPropagation();
    e.preventDefault();
    var fileList  = e.dataTransfer.files;
    for (var i=0; i<fileList.length; i++) {
        var file = fileList[i];
        var reader = new FileReader();
        reader.name = file.name;
        reader.onload = function(e) {
            var imgname = getCurTimeStr()+"."+this.name;
            var url = config.file_server+"/upload?name=img/"+imgname;
            postBinary(this.result, url, function(ret) {
                ret = JSON.parse(ret);
                if (ret.result==0) {
                    var cur = editor.getCursor();
                    var imgurl = " ![]("+config.file_server+"/"+ret.filename+") ";
                    editor.replaceRange(imgurl,cur,cur);
                }
            });
    　　}
    　　reader.readAsArrayBuffer(file);
    }
}
