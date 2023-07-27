// pages/auth/index.js
import { request} from "../../request/index.js"

Page({
// 获取用户信息
async handleGetUsrInfo(e){
  try { 
    // 1.获取用户信息
    const {encryptedData,rawData,iv,signature} = e.detail
    // 2.获取小程序登录后的code
    const code =  wx.login({
      timeout:10000,
      success: (result) => {
      //  console.log(result); 
      const {code} = result
      return code
    // 3.发送请求 获取用户的token
      }
    });  
    const loginParams={encryptedData,rawData,iv,signature,code}
    // const {token} = await request({url:'/users/wxlogin',data:loginParams,method:"post"})
   const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
    // const token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
    // console.log(res);
    // 4.把token存入缓存中 同时跳转回上一个页面
    wx.setStorageSync("token", token);
    wx.navigateBack({
      delta: 1
    });
  } catch (error) {
  console.log(error);
  }
  // 模拟
  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
  wx.setStorageSync("token", token);
  wx.navigateBack({
    delta: 1
  });
}
})