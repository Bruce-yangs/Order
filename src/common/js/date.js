export function formatDate(date,fmt) {
    if(/(y+)/.test(fmt)) {//匹配年 RegExp.$1 -> 指向的是匹配到的 /(y)+/
      fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth()+1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if(new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:autoZero(str))
      }
    };
    return fmt;
}
function autoZero(str) {//自动补零
  return ('00'+str).substr(str.length);
}
