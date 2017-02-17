
// analytics.add = function (callback) {

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//         console.log('Successfully connected to the backend server');
//       }
//     };
//     xhttp.open("GET", "http://192.168.1.124:3000/", true);
//     xhttp.send();
//     callback();
//   }

(function (window, undefined) {
  var analytics = window.analytics;
  analytics.push = function (userInfo, callback) {
    var push = {};
    var xhttp = new XMLHttpRequest();
    var post =
      "name=" + encodeURIComponent(unescape(userInfo.name)) +
      "&age=" + encodeURIComponent(unescape(userInfo.age)) +
      "&email=" + encodeURIComponent(unescape(userInfo.email));
    console.log('post is');
    console.log(post);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log('Successfully pushed user');
      }
    };
    xhttp.open("POST", "http://192.168.1.124:3000/insert", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(post);
    callback();
  }
})(window);