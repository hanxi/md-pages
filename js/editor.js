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
}

render = function(mdString)
{
    var html = marked(mdString);
    var preview = document.getElementById("preview");
    preview.innerHTML = html;
    updateTitle(mdString);
}

var heading= /((?:^|\n) *#{1}) +([^\n]+?) *#* *(?:\n+|$)/;
var lheading = /([^\n]+)\n *={2,} *(?:\n+|$)/;
updateTitle = function(mdString)
{
    var matchTitle = mdString.match(heading);
    var title = null;
    if (matchTitle) {
        title = matchTitle[2];
    } else {
        matchTitle = mdString.match(lheading);
        if (matchTitle) {
            title = matchTitle[1];
        }
    }

    if (title) {
        var fileNameView = document.getElementById("file-name");
        fileNameView.value = title;
    }
}

publish = function()
{
    var mdString = editor.getValue();
    var fileNameView = document.getElementById("file-name");
    var title = fileNameView.value;
    title = title.trim();
    fileNameView.value = title;
    mdString = mdString.replace(heading,"$1 "+title+"\n\n");
    editor.setValue(mdString);

    var name = loadPageVar("name");
    var url = config.file_server+"/upload?name=md/"+name+"."+title+".md";
    postBinary(mdString, url, function(ret){alert("发布结果:\n"+ret)});
    localStorage.newPage = null;
}
