(function (window, undefined) {
  var analytics = {};
  function loadLibrary(src, cb) {
    (function () {
      var script = document.createElement('script');
      script.async = true;
      script.src = src;

      var entry = document.getElementsByTagName('script')[0];
      entry.parentNode.insertBefore(script, entry);
      script.onload = script.onreadystatechange = function () {
        var rdyState = script.readyState;
        if (!rdyState || /complete|loaded/.test(script.readyState)) {
          cb();
          script.onload = null;
          script.onreadystatechange = null;
        }
      }
    })();
  }

  if (window.analytics) {
    return;
  }

  window.analytics = analytics;
  analytics.init = function (credentials) {
    var post =
      "appName=" + encodeURIComponent(unescape(credentials.appName)) +
      "&apiKey=" + encodeURIComponent(unescape(credentials.apiKey));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.status === 200) {
        //load lib.js here
        loadLibrary("static/lib.js", () => {
        });
      }
    };
    xhttp.open("POST", "http://192.168.1.124:3000/authentication", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(post);
  }
  if (typeof window.analyticsReady === 'function') {
    console.log('first');
    window.analyticsReady();
  }
})(window);