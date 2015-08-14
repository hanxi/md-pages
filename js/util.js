createHTTPRequestObject = function() {
    // although IE supports the XMLHttpRequest object, but it does not work on local files.
    var forceActiveX = (window.ActiveXObject && location.protocol === "file:");
    if (window.XMLHttpRequest && !forceActiveX) {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch(e) {}
    }
    alert ("Your browser doesn't support XML handling!");
    return null;
}

getJSON = function(url, callback)
{
    getData(url, callback, JSON.parse);
}

getText = function(url, callback)
{
    getData(url, callback, function(t){return t;});
}

getData = function(url, callback, parse)
{
    var xhr = createHTTPRequestObject();
    xhr.open("get", url, true);
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200) {
            var headers = {};
            if (xhr.getAllResponseHeaders) {
                var headersArray = xhr.getAllResponseHeaders().split("\n");
                for (var i=0; i<headersArray.length; i++) {
                    var kv = headersArray[i].split(": ");
                    if (kv.length==2) {
                        headers[kv[0]] = kv[1];
                    }
                }
            }
            callback(parse(xhr.responseText), headers);
        }
    }
    xhr.send();
}

postBinary = function(data, url, callback) {
    var xhr = createHTTPRequestObject();
    xhr.open("post", url, true);
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.onreadystatechange = function() {
        if (xhr.readyState==4 && xhr.status==200)
        {
            callback(xhr.responseText);
        }
    }
    xhr.send(data);
}


cleanChild = function(node)
{
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

removeChildById = function(node, id)
{
    var child = document.getElementById(id);
    if (child) {
        node.removeChild(child);
    }
}

setFooter = function()
{
    var footer = document.getElementById("footer");
    footer.innerHTML = '<span>\
        Copyright © 2015-2016 <a href="http://github.com/hanxi" target="_blank">hanxi</a>.\
        Powered by <a href="http://37.com" target="_blank">tlxserver</a>.\
        </span>';
}

hideElement = function(id)
{
    var node = document.getElementById(id);
    node.style.display="none";
}

showElement = function(id)
{
    var node = document.getElementById(id);
    node.style.display="";
}

loadPageVar = function(sVar)
{
    return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

getCurTimeStr = function()
{
    var date = new Date();
    var timeStr = "" + date.getFullYear()
        + "." + (date.getMonth()+1)
        + "." + date.getDate()
        + "." + date.getHours()
        + "." + date.getMinutes()
        + "." + date.getSeconds()
        + "." + date.getMilliseconds();
    return timeStr;
}

getTimeFromStr = function(str)
{
    var arr = str.split(".");
    arr.forEach(function(value, index, ar){
        ar[index] = parseInt(value);
    });
    var date = new Date();
    date.setFullYear(arr[0]);
    date.setMonth(arr[1]-1);
    date.setDate(arr[2])
    date.setHours(arr[3])
    date.setMinutes(arr[4])
    date.setSeconds(arr[5])
    date.setMilliseconds(arr[6]);
    return date;
}

function getMdUrl()
{
    return config.file_server+"/md/";
}
