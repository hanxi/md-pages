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
    editor.setValue(defaultmd);
    editor.on('change', update);
    editor.on("scroll", scrollPreview);
    render(defaultmd);
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
        title = matchTitle[1];
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

    var fileName = loadPageVar("name");
    var url = "http://localhost:8000/upload?name=md/"+title+"."+fileName;
    postBinary(mdString, url, function(ret){alert("发布结果:\n"+ret)});
}
