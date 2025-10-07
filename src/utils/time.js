/**
 * 将时间解析为字符串
 * @param {(Object|string|number)} time 要转换的时间
 * @param {string} cFormat 转换格式，默认 {y}-{m}-{d} {h}:{i}:{s}
 * @returns {string | null} 转换后的时间
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

// 获取当前时间这一周的时间范围
// date new Date()
// export function getWeekRange (date) {
//   let timeStamp = date.getTime(); //标准时间转为时间戳，毫秒级别
//   let start = parseTime(timeStamp, '{y}-{m}-{d}'); //开始时间
//   let end = parseTime(timeStamp + (24 * 60 * 60 * 1000) * 6, '{y}-{m}-{d}'); //结束时间
//   return [start, end]
// }

// 获取上周周一到周日 日期字符串
export function getWeekRange(date) {
  let timeStamp = date.getTime(); //标准时间转为时间戳，毫秒级别
  let week = date.getDay() // 周几 0为周末
  let dateTime = 24 * 60 * 60 * 1000
  let start = parseTime(timeStamp - dateTime * (week - 1), '{y}-{m}-{d}'); //开始时间
  let end = parseTime(timeStamp + dateTime * (7 - week), '{y}-{m}-{d}'); //结束时间
  return [start, end]
}

// 获取默认时间（上个月或上周或昨天）
export function getNowDate(type = 'month') {
  let str = ''

  let date = new Date()
  let y = date.getFullYear()
  let m = date.getMonth() + 1 // 当前月
  let d = date.getDate()

  switch (type) {

    case 'month': {
      m = d > 5 ? m - 1 : m - 2 // 默认显示上个月的数据 5号之前显示上上个月
      m = m.toString().padStart(2, '0') // 补全位数
      // str = `${y}${m}`
      str = `202306`
    } break;
    case 'week': {
      let timeStamp = date.getTime(); //标准时间转为时间戳，毫秒级别
      let lastWeek = timeStamp - (24 * 60 * 60 * 1000) * 7; // 上周
      str = new Date(lastWeek)
    } break;
    case 'day': {
      let timeStamp = date.getTime();
      let lastWeek = timeStamp - (24 * 60 * 60 * 1000) * 1; // 昨天
      let date_n = new Date(lastWeek)
      let d_n = date_n.getDate()

      m = m.toString().padStart(2, '0') // 补全位数
      str = `${y}${m}${d_n}`
    } break;
  }

  return str
}

// 获取日期时间戳
export function getWeekDate(dateStr) {
  // dateStr = getDayUndividedStr(dateStr)
  let date = new Date(dateStr)
  return date
}

// 获取不使用-分隔的日期字符串
export function getDayUndividedStr(date) {
  if (!date) return '';

  let arr = date.split('-')
  return arr.join('') || ''
}

// 获取指定日期的前几天或后几天
export function getNextDate(date, day) {
  let dd = new Date(date);
  dd.setDate(dd.getDate() + day);
  let y = dd.getFullYear();
  let m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
  let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();

  return y + "-" + m + "-" + d;
};

// 根据月份获取日期范围
export function getMonthRange(month) {
  if (!month) return '';

  // let date = new Date()
  // let y = date.getFullYear()
  // let m = date.getMonth()

  let y = month.slice(0, 4)
  let m = month.slice(4)
  m = Number(m) - 1

  let monthStart = new Date(y, m, 1) // 获取本月第一天的日期时间
  // let monthEnd = new Date(y, m + 1, 0, 23, 59, 59) // 获取本月最后一天的日期时间
  let monthEnd = new Date(y, m + 1, 0) // 获取本月最后一天的日期时间
  monthStart = parseTime(monthStart)
  monthEnd = parseTime(monthEnd)

  return { monthStart, monthEnd }
}

/**
 * 毫秒转秒
 * @param {Number} val
 * @returns {string}
 */
export function formatMillisecond(val) {
  val = Number(val)
  let output;
  let s = 60
  let m = 60 * 60
  let h = 60 * 60 * 60
  if (!val) {
    output = '0秒';
  } else if (val > s) {
    output = (val / s).toFixed(2) + '秒';
  } else if (val > m) {
    output = (val / m).toFixed(2) + '分钟';
  } else if (val > h) {
    output = (val / h).toFixed(2) + '小时';
  } else {
    output = val.toFixed(2) + '毫秒';
  }
  return output
}