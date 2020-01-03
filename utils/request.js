const request = function(obj) {
  let key = 'cookie'
  let cookie = wx.getStorageSync(key);
  console.log("wx.getStorageSync('cookie')", cookie);
  cookie = cookie.name + '=' + cookie.value

  if (obj.header) {
    obj.header.Cookie = cookie;
  } else {
    obj.header = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookie
    }
  }

  if (!('fail' in obj)) {
    obj.fail = function(err) {}
  }
  if (!('complete' in obj)) {
    obj.complete = function(res) {}
  }

  wx.request({
    url: obj.url,
    data: obj.data,
    header: obj.header,
    method: obj.method ? obj.method : 'GET',
    dataType: obj.dataType ? obj.dataType : 'json',
    responseType: obj.responseType ? obj.responseType : 'text',
    success: res => {
      saveCookie(res.header);
      obj.success(res);
    },
    fail: err => {
      saveCookie(res.header);
      obj.fail(err);
    },
    complete: res => {
      obj.complete(res);
    }
  });
}

function saveCookie(header) {
  if (!header) return;
  var cookies = null;
  if ('Set-Cookie' in header) {
    cookies = header['Set-Cookie'];
  } else if ('set-cookie' in header) {
    cookies = res.header['set-cookie'];
  }
  //console.log(cookies);
  if (!cookies) return;
  if (!Array.isArray(cookies)) {
    cookies = [cookies];
  }
  cookies.forEach(function(item) {
    var parts = item.split(";");
    //console.log(parts);
    var nameValue = parts.shift().split("=");
    var name = nameValue.shift();
    var value = nameValue.join("=");
    var cookie = {
      name: name,
      value: value
    }
    wx.setStorageSync('cookie', cookie);
  });
}

module.exports = request;