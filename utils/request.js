const request = function(obj) {
  if (obj.header) {
    obj.header.Cookie = getCookie();
  } else {
    obj.header = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": getCookie()
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
      setCookie(res.header);
      obj.success(res);
    },
    fail: err => {
      setCookie(res.header);
      obj.fail(err);
    },
    complete: res => {
      obj.complete(res);
    }
  });
}

function getCookie() {
  var cookie = null;
  try {
    cookie = wx.getStorageSync('cookie');
  } catch (e) {}
  console.log('getCookie()', cookie);
  return cookie;
}

function setCookie(header) {
  if (header && 'Set-Cookie' in header) {
    let cookie = header['Set-Cookie'];
    wx.setStorageSync('cookie', cookie.split(";").shift());
  }
}

module.exports = request;