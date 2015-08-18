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
}

function gotoHome()
{
    setTitle(config.blog_name);
    setBlogName();
    setFooter();
    var page = 1;
    var link = {};
    var postlist = document.getElementById("post_list");
    function loadPage(page) {
        getJSON(getMdUrl(), function(data) {
            removeChildById(document.getElementById("index"), "wait");
            var tmpdict = {}
            for (var i=0; i<data.length; i++) {
                var filename = data[i].filename;
                var mtime = data[i].mtime;
                var filenamepre = filename.match(/^(\d+\.){6}\d/);
                if (filenamepre) {
                    if (!tmpdict.hasOwnProperty(filenamepre) || tmpdict[filenamepre].mtime<mtime) {
                        tmpdict[filenamepre] = {"mtime":mtime,"filename":filename};
                    }
                }
            }
            var tmparray = [];
            for (filenamepre in tmpdict) {
                tmpdict[filenamepre].ctime = getTimeFromStr(filenamepre);
                tmparray.push(tmpdict[filenamepre]);
            }
            tmparray.sort(function(a,b){return a.ctime<b.ctime;});
            for (var i=0; i<tmparray.length; i++) {
                var filename = tmparray[i].filename;
                if (filename.charAt(filename.length-1)!="/") {
                    var editbtn = document.createElement("button");
                    editbtn.onclick = editMd;
                    editbtn.name = filename;
                    var span = document.createElement("span");
                    span.className = "octicon octicon-pencil";
                    editbtn.appendChild(span);
                    span.name = filename;

                    var posttitle = document.createElement("li");
                    posttitle.className = "pagelist";
                    postlist.appendChild(posttitle);
                    var href = document.createElement("a");
                    var pagetitle = filename.replace(/^(\d+\.){7}/,"");
                    pagetitle = pagetitle.replace(/\.md$/,"");
                    href.href = encodeURI(encodeURI("?p="+filename+"&t="+(new Date().getTime())));
                    var txt = document.createTextNode(pagetitle);
                    href.appendChild(txt);

                    posttitle.appendChild(editbtn);
                    posttitle.appendChild(href);
                }
            }
        });
    }
    loadPage(1);
}

function gotoPage(filename, pagetitle)
{
    setTitle(config.blog_name);
    setFooter();
    getText(getMdUrl()+filename, function(data) {
        setTitle(config.blog_name + " - " + pagetitle);
        var title = document.getElementById("title");
        var txt = document.createTextNode(pagetitle);
        title.appendChild(txt);
        var content = document.getElementById("content");
        render(data);
    });
}

setTitle = function(title)
{
    var titles = document.getElementsByTagName("title");
    titles[0].innerHTML = title;
}

setBlogName = function()
{
    var btitle = document.getElementById("blog_title");
    var txt = document.createTextNode(config.blog_name);
    btitle.appendChild(txt);
}

render = function(mdString) 
{
    var html = marked(mdString);
    var content = document.getElementById("content");
    content.innerHTML = html;
}

newPage = function()
{
    if (!localStorage.newPage || localStorage.newPage==="undefined") {
        localStorage.newPage = getCurTimeStr();
    }
    window.location.href = "/editor.html?name="+localStorage.newPage+"&type=new";
}

editMd = function(e)
{
    var filename = e.target.name;
    var filenamepre = filename.match(/^(\d+\.){6}\d/);
    filenamepre = filenamepre[0];
    
    window.location.href = encodeURI(encodeURI("/editor.html?name="+filenamepre+"&type=modify&filename="+filename));
}

