// const tenantCodeRegex = /^[a-z][a-z0-9_]{1,20}$/ // 租户编码校验正则
const tenantCodeRegex = /^[a-z][a-z0-9]{1,20}$/ // 租户编码校验正则
const passwordRegex = /^[A-Z][a-zA-Z0-9]{7,20}$/ // 密码正则
const fileNameRegex = /^[a-z][a-z0-9_]{1,20}$/ // 文件英文正则
const tableNameRegex = /^[a-z][a-z_]{1,50}$/ // 空间表名正则

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isYes(value) {
  return value === 'YES'
}

// 匹配由小写字母开头，数字、小写字母组成的 限制在1-20个字符的 字符串
export function isPassword(string) {
  return passwordRegex.test(string)
}

// 匹配由数字、26个英文字母或者下划线组成的 限制在0-20个字符的 字符串
// export function isPassword(string) {
//   return /^[a-zA-Z0-9_]{0, 20}$/.test(string)
// }

// 匹配由数字、26个英文字母或者下划线
// export const regW = /^\w+$/

// 表单规则
export const formRules = {
  positiveInteger: { pattern: /^[0-9]*$/, message: '请输入正整数', trigger: 'blur' },
  phone: { pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '请输入正确的手机号', trigger: 'blur' },
  password: { pattern: passwordRegex, message: '由大写字母开头，数字、字母组成，8-20个字符', trigger: 'blur' }, // 密码
  tenantCode: { pattern: tenantCodeRegex, message: '由小写字母开头，数字、小写字母组成，1-20个字符', trigger: 'blur' }, // 租户编码
  fileNameRegex: { pattern: fileNameRegex, message: '由小写字母开头，数字、小写字母、下划线组成，1-20个字符', trigger: 'blur' }, // 工作空间名称、样式名称、资源名称等
  tableNameRegex: { pattern: tableNameRegex, message: '由小写字母开头，小写字母、下划线组成，1-50个字符', trigger: 'blur' }, // 空间表名等
}

// 向表单项添加必填规则
export const getRules = (item, tip) => {
  let result = []
  if(item){ // tableProps 配置的表单项
    result = item.rules || []
    if (item.isRequired) {
      result.unshift({ required: true, message: item.placeholder || '请输入' + item.label, trigger: 'blur' }) // 添加必填规则
    }
  }else{ // 无配置，设置提示内容
    result = [{ required: true, message: tip, trigger: 'blur' }]
  }
  return result
}
