/*
1. 用户上滑页面 滚动条触底 开始加载下一页数据
  1.找到滚动条触底事件 微信小程序的开发文档
  2.判断 还有无下一页数据
    1.获取总页数 Math.ceil(total/pagesize)
    2.获取当前的页码 pagenum
    3.判断一下当前的页码是否是大于等于总页数
      表示没有下一页数据
  3.假如没有下一页数据 弹出提示框
  4.如果有下一页数据  加载
    1.当前页码++
    2.重新发送请求
    3.数据拼接 而不是全部替换
2.下拉刷新页面
  1.触发下拉刷新事件  x需要在json文件中开启一个配置项
    1.找到触发下拉刷新事件 onPullDownRefresh
  2.重置 数据 数组
  3.重置页码 设置为1
  4.重新发送请求
  5.手动关闭等待效果
*/
// 0. 引入 用来发送请求的 方法 一定要把路径补全
import { request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    // 商品列表信息
    goodsList:[]

  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,
  // 标题的点击事件
  handleTabsItenChange(e){
    // console.log(e);
    // 1. 获取被点击的索引
    const {index} = e.detail
    // 2. 修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);
    this.QueryParams.cid = options.cid||""
    this.QueryParams.query = options.query||""
    this.getGoodsList()

  },
  // 获取商品列表的数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams})
    // 获取总条数
    const total = res.total
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      // 拼接的数组
      goodsList:[...this.data.goodsList,...res.goods]
    })

  },
  // 页面上滑 滚动条触底事件
  onReachBottom(){
    // console.log("页面触底");
    // 1.判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      // 没有下一页数据
      // console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据！'
      });
        
    }else{
      this.QueryParams.pagenum++
      this.getGoodsList()
    }

  },
  // 下拉刷新事件
  onPullDownRefresh(){
    // console.log("刷新");
    // 1.重置数组
    this.setData({
      goodsList:[]
    })
    // 2.重置页码
    this.QueryParams.pagenum=1
    // 3.发送请求
    this.getGoodsList()
    // 4.关闭等待效果  如果没有下拉刷新窗口 直接关闭也不会报错
    wx.stopPullDownRefresh()     
  }

})