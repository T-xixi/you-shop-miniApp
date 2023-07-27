// pages/order/index.js
/** 
 * 1.页面被打开的时候 onShow
 *  0.onshow 无法在形参上接收options 而onLoad可以
 *  需要判断缓存中有无token
 *    无 直接跳转到授权页面
 *    有 直接往下进行
 *   1.获取url上面的参数type
 *    根据type选择被选中
 *   2.根据type 去发送请求获取订单数据
 *   3.渲染页面
 * 2.点击不同的标题 重新发送请求来获取和渲染数据
*/
import { request} from "../../request/index.js"

Page({

   /**
   * 页面的初始数据
   */
  data: {
      tabs:[
        {
          id:0,
          value:"全部",
          isActive:true
        },
        {
          id:1,
          value:"待付款",
          isActive:false
        },
        {
          id:2,
          value:"待收货",
          isActive:false
        },{
          id:3,
          value:"退货/退款",
          isActive:false
        }
      ],
      orders:[],
      orderData: {
        "count": 1,
        "orders": [
          {
            "order_id": 428,
            "user_id": 23,
            "order_number": "HMDD20190802000000000428",
            "order_price": 13999,
            "order_pay": "0",
            "is_send": "否",
            "trade_no": "",
            "order_fapiao_title": "个人",
            "order_fapiao_company": "",
            "order_fapiao_content": "",
            "consignee_addr": "广东省广州市海珠区新港中路397号",
            "pay_status": "1",
            "create_time": 1564731518,
            "update_time": 1564731518,
            "order_detail": null,
            "goods": [
              {
                "id": 717,
                "order_id": 428,
                "goods_id": 43986,
                "goods_price": 13999,
                "goods_number": 1,
                "goods_total_price": 13999,
                "goods_name": "海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统",
                "goods_small_logo": "http://image5.suning.cn/uimg/b2c/newcatentries/0000000000-000000000160455569_1_400x400.jpg"
              }
            ],
            "total_count": 1,
            "total_price": 13999
          },
          {
            "order_id": 429,
            "user_id": 23,
            "order_number": "HMDD20190802000000000429",
            "order_price": 13999,
            "order_pay": "0",
            "is_send": "否",
            "trade_no": "",
            "order_fapiao_title": "个人",
            "order_fapiao_company": "",
            "order_fapiao_content": "",
            "consignee_addr": "广东省广州市海珠区新港中路397号",
            "pay_status": "1",
            "create_time": 1564732000,
            "update_time": 1564732000,
            "order_detail": null,
            "goods": [
              {
                "id": 717,
                "order_id": 428,
                "goods_id": 43986,
                "goods_price": 13999,
                "goods_number": 1,
                "goods_total_price": 13999,
                "goods_name": "海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统",
                "goods_small_logo": "http://image5.suning.cn/uimg/b2c/newcatentries/0000000000-000000000160455569_1_400x400.jpg"
              }
            ],
            "total_count": 1,
            "total_price": 13999
          }
        ]
    }
    },
  onShow(options){
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return
    }  

    // console.log(options);//undefined
    // 1.获取当前的小程序页面栈-数组 长度最大是10页面
    let pages  =  getCurrentPages();
    // 2.数组中存在的最大的页面就是当前页面
    let currentPage = pages[pages.length-1]
    // 3.获取url上的type值
    const type = currentPage.options.type
    // 4.激活选中页面标题
    this.changeTitleByIndex(type-1)
    this.getOrders(type)   
  },
  // 获取订单列表的方法
  async getOrders(type){
    // const res = await request({url:"/my/orders/all",data:type})
    const res = this.data.orderData
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
      // 标题的点击事件
  handleTabsItenChange(e){
    // console.log(e);
    // 1. 获取被点击的索引
    const {index} = e.detail
    this.changeTitleByIndex(index)
    // 2，重新发送请求
    this.getOrders(index+1)
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    // 2. 修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  }
})