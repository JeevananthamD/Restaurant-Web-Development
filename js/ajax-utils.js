(function(global) {
   var ajax={};

    function getRequestObject() {
        if(window.XMLHttpRequest) {
            return(new XMLHttpRequest());
        }
        else {
            global.alert("Ajax not supported");
            return(null);
        }
    }

    ajax.sendGetRequest = function(requestUrl, responseHandler, isJson) {
        var request=getRequestObject();
        request.onreadystatechange=function() { handleResponse(request, responseHandler, isJson); };
        request.open("GET", requestUrl, true);
        request.send(null);
    };

    function handleResponse(request, responseHandler, isJson) {
        if((request.readyState==4) && (request.status==200)) {
            if(isJson==undefined) {
                isJson=true;
            }
            if(isJson) {
                responseHandler(JSON.parse(request.responseText));
            }
            else {
                responseHandler(request.responseText);
            }
        }
    }

    global.$ajax=ajax;
})(window);

