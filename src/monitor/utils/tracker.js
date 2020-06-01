let host = "cn-hangzhou.log.aliyuncs.com";
let project = "front-end-monitor";
let logstoreName = "front-end-monitor";
let userAgent = require("user-agent");

// 可以添加一些额外的数据
function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name,
    // 用户ID ...
  };
}

class SendTracker {
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logstoreName}/track`; //上报的路径
    this.xhr = new XMLHttpRequest();
  }

  send(data = {}) {
    let extraData = getExtraData();
    let log = { ...extraData, ...data };
    // 对象的值不能是数字 阿里云的要求
    for (let key in log) {
      if (typeof log[key] === "number") {
        log[key] = `${log[key]}`;
      }
    }
    console.log("log", log);
    let body = JSON.stringify({
      __logs__: [log],
    });
    this.xhr.open("POST", this.url, true);
    this.xhr.setRequestHeader("Content-Type", "application/json"); //请求体类型
    this.xhr.setRequestHeader("x-log-apiversion", "0.6.0"); //版本号
    this.xhr.setRequestHeader("x-log-bodyrawsize", body.length); //请求体大小

    this.xhr.onload = () => {
      // console.log(this.xhr.response);
    };

    this.xhr.onerror = function(error) {
      console.log(error);
    };

    this.xhr.send(body);
  }
}

export default new SendTracker();
