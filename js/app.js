onload = function()
{
    hljs.initHighlightingOnLoad();
    marked.setOptions({
        highlight: function (code) {
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
        var more = document.getElementById("more");
        if (more) {
            removeChildById(postlist, "more");
            var newMore = document.createElement("img");
            newMore.id = "more";
            newMore.src = "littlewait.gif";
            postlist.appendChild(newMore);
        }
        getJSON(config.md_url, function(data) {
            removeChildById(document.getElementById("index"), "wait");
            removeChildById(postlist, "more");
            for (var i=0; i<data.length; i++) {
                var posttitle = document.createElement("li");
                posttitle.className = "pagelist";
                postlist.appendChild(posttitle);
                var href = document.createElement("a");
                var pagetitle = data[i].replace(/\.\w+\d+\.md/,"");
                href.href = "?p="+data[i]+"&t="+(new Date().getTime());
                var txt = document.createTextNode(pagetitle);
                href.appendChild(txt);
                posttitle.appendChild(href);
            }
        });
    }
    loadPage(1);
}

function gotoPage(filename, pagetitle)
{
    setTitle(config.blog_name);
    setFooter();
    getText(config.md_url+"/"+filename, function(data) {
        setTitle(config.blog_name + " - " + title);
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

