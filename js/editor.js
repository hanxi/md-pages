var editor

onload = function()
{
    hljs.initHighlightingOnLoad();
    marked.setOptions({
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });

    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
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
                fileNameView.value = pagetitle;

                update();
            });
        } else {
            loadCache(name)
            update();
        }
    } else {
        loadCache(name);
        update();
    }
    editor.on('change', update);
    editor.on("scroll", scrollPreview);

    fileNameView = document.getElementById("file-name");
    fileNameView.onblur = updateTitle;
}

function updateUrl(newUrl)
{
    var stateObject = {};
    var title = "";
    history.pushState(stateObject,title,newUrl);
}

function loadCache(name)
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

scrollPreview = function()
{
    var preview = document.getElementById("preview");
    var sinfo = editor.getScrollInfo();
    var code = document.getElementById("editor");
    var preview = document.getElementById("preview");
    var per = sinfo.top/(sinfo.height-sinfo.clientHeight);
    preview.scrollTop = (preview.scrollHeight-preview.clientHeight)*per;
}

update = function()
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
    var mdString = editor.getValue();
    var name = loadPageVar("name");
    var pagetitle = localStorage[name+".title"]; 

    var url = config.file_server+"/upload?name=md/"+name+"."+pagetitle+".md";
    postBinary(mdString, url, function(ret){alert("发布结果:\n"+ret)});
    localStorage.newPage = undefined;
}
