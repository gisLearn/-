/*
 * @Author: your name
 * @Date: 2023-10-24 15:32:37
 * @LastEditors: your name
 * @LastEditTime: 2023-10-26 13:47:53
 * @Description: 
 * @FilePath: \etone_cloudrender\src\api\senceModule.js
 */
import request from '@/api/request'
import httpUrl from '@/api/httpUrl'
import qs from "qs"


// 获取帧率显示接口
export const getlogging = async (params) => {
    return await request.post(httpUrl.SenceModule.getlogging, qs.stringify(params))
}

// 获取帧率显示接口
export const getrenderLog = async (params) => {
    return await request.post(httpUrl.SenceModule.getrenderLog, qs.stringify(params))
}