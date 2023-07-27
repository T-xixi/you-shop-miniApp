// pages/category/index.js
// 0. 引入 用来发送请求的 方法 一定要把路径补全
import { request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList:[],
    // 右侧商品数据
    rightContent:[],
    // 被点击的左侧菜单的索引
    currentIndex:0,
    // 右侧滚动条距离顶部的位置
    scroll_top:0
  },
  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  /*
    0 web中的本地存储与小程序的区别
       1.写代码方式不一样
       web:localStorage.setItem("key","value")  localStorage.getItem("key") 
       小程序: wx.setStorageSync("key", "value") wx.getStorageSync("key")
       2.存的时候有没有类型转换
       web:不管存入的是什么类型的数据 最终都会调用一下 toString() 把数据变成字符串 再存进去
       小程序:不存在 类型转换这个操作 存什么类型的数据进去 取决于获取的数据类型

     1.判断本地存储中有没有旧的数据
     2.没有旧的数据 直接发送信的请求
     3.有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据
     this.getCates()
  */
    // 1.获取本地存储数据 (小程序中也存在本地存储技术)
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if(!Cates){
      // 不存在 发送请求获取数据
    this.getCates()
    }else{
      // 有旧的数据
      // 判断有无过期  定义过期时间 10s 改成5min
      if(Date.now()-Cates.time>1000*300){
        // 重新发送
        this.getCates()
      }else{
        // 可以使用
        // console.log("可以使用");
        this.Cates = Cates.data
        // 构造左侧菜单数据
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        //  构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
         leftMenuList,
         rightContent
       })
      }
    }
      

  },

// 获取分类数据
async getCates(){
//   request({
//     url:"/categories"
//   })
//   .then(res=>{
//     // console.log(res);
//     this.Cates=res.data.message;

//     // 把接口数据存入到本地存储中
//     wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
      

//     // 构造左侧菜单数据
//    let leftMenuList = this.Cates.map(v=>v.cat_name);
//   //  构造右侧商品数据
//    let rightContent = this.Cates[0].children;
//   this.setData({
//     leftMenuList,
//     rightContent
//   })
// })


// 使用async awiat 语法 
const res = await request({url:'/categories'});
  this.Cates=res
    // 把接口数据存入到本地存储中
  wx.setStorageSync("cates", {time:Date.now(),data:this.Cates})
    // 构造左侧菜单数据
  let leftMenuList = this.Cates.map(v=>v.cat_name)
  //  构造右侧商品数据
  let rightContent = this.Cates[0].children
  this.setData({
    leftMenuList,
    rightContent
  })
},
// 左侧菜单点击事件
handleItemtap(e) {
  // console.log(e);
  // 1.获取被点击的标题的索引
  const {index} = e.currentTarget.dataset
  // 2.给data中的currentIndex赋值
  // 3.根据不同索引来渲染右侧的商品内容
  let rightContent = this.Cates[index].children
  this.setData({
    currentIndex:index,
    rightContent,
    scroll_top:0
// 重新设置右侧内容scroll-view标签距离顶部的位置
  })
},
})