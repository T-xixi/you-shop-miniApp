// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */

  // 点击按钮 获取用户信息
  handleGetuserinfo(e){
    const {userInfo} = e.detail
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
      
  }
})