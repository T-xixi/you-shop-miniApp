// pages/pay/index.js
import { request} from "../../request/index.js"

Page({
  /*
  1.页面加载的时候
    1.从缓存中获取购物车数据 渲染到页面中
      这些数据 checked=true
  2.微信支付
    1.哪些人 哪些账号 可以实现微信支付
      1.企业账号
      2.企业账号的小程序后台 必须给开发者 添加上白名单
        1.一个 appid可以同时绑定多个开发者
        2.这些开发者可以公用这个appid和它的开发权限
  3.支付按钮
    1.先判断有无token 
    2.没有 跳转到授权页面 进行获取token
    3.有token
    4.创建订单
    5.完成支付
    6.手动删除缓存中 已被选中的商品
    7.删除购物车中的数据 填充回缓存
    8.再跳转页面

  */ 

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow() {
    // 1.获取本地存储中的地址数据
    const address = wx.getStorageSync("address");
    // a 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked) 
    let totalNum=0
    let totalPrice=0
    cart.forEach(v => {
        totalPrice+=v.goods_price*v.num
        totalNum+=v.num
    });
    // 判断数组是否为空
    this.setData({
      address,
      cart,
      totalNum,
      totalPrice
    }) 
  },
  async handleOrderPay(){
    try {
      const token = wx.getStorageSync("token")
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index',
        });       
        return
      }
      // 3.创建订单
      // 3.1准备 请求头参数
      // const {header} = {Authorization:token}
      // 3,2准备 请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all 
      const cart = this.data.cart
      let goods=[]
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams = {order_price,consignee_addr,goods}
      // 4.发送请求 创建订单 获取订单编号
      // const {order_number} = await request({url:"/my/orders/create",method:"POST",data:orderParams})
      const order_number = "HMDD20190809000000001061"
      // console.log(res);
      // 5.发起 预支付接口
      const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}})
      // console.log(pay);
      // 6.发起微信支付
      await wx.requestPayment({
        ...pay,
        success: (result) => {
        },
      });
      // 7.查询后台  订单状态
      const res = await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}})
      await wx.showToast({
        title: '支付成功',
        icon: 'none',
      });       
    } catch (error) {
      await wx.showToast({
        title: '支付失败',
        icon: 'none',
      });
      console.log(error);
    }
    // 8.跳转到支付页面
    wx.navigateTo({
      url:'/pages/order/index'
    })
    // 9.手动删除
    let newCart = wx.getStorageSync("cart")
    newCart = newCart.filter(v=>!v.checked)
    wx.setStorageSync("cart", newCart);
  }
})