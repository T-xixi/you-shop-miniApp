// pages/cart/index.js
Page({
  /*
  1.获取用户的收货地址
    1.绑定点击事件
    2.调用小程序的api 获取用户的收获地址
    3.获取 用户 对小程序 所授予的 获取地址 权限 状态 scope(不考虑)
  2.页面加载完毕
    0.onLoad onShow
    1.获取本地存储中的地址数据
    2.把数据 设置给data中的一个变量
  3.onShow
    1.获取缓存中的购物车数组
    2.把购物车数据 填充到data中
  4.全选的实现 数据的展示
    1.onShow 获取缓存中的购物车数组
    2.根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就选中了
  5.总价格与总数量
    1.需要商品被选中才计算
    2、获取购物车的数组 对其进行遍历 判断商品是否被选中
    3. 总价格 += 商品单价*商品数量
    4. 总数量 += 商品数量
    5. 把计算后的价格和数量 设置回data中即可
  6.商品的选中功能
    1.绑定change事件
    2.获取到被修改的商品对象
    2.商品对象的选中状态取反
    4.重新填充回data缓存区
    5.重新计算总价格和总数量
  7.全选和反选
    1.全选的复选框 绑定事件
    2.获取data中的全选变量allChecked
    3.allChecked直接取反
    4.遍历购物车 让购物车商品的选中状态随之改变
    5.把购物车数组 和选中状态存在缓存中
  8.商品数量的编辑功能
    1."+"和"-"绑定 同一个点击事件 区分的关键 自定义属性
      "+" "+1"  "-" "-1"
    2.传递被点击的商品id
    3.获取data中的购物车数组 来获取需要被修改的商品对象
        当购物车的数量=1 同时用户点击"-"
        弹窗提示 询问用户 是否要删除
        1.确定 直接执行删除
        2.取消 什么都不做
    4.直接修改商品的num属性
    5.cart数组 重新设置回缓存和data中setCart()
  9.点击结算
   1.判断有无地址信息
   2.判断有无选购商品
   3.经过以上验证 跳转到支付页面

  */ 

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0

  },

 
  onShow() {
    // 1.获取本地存储中的地址数据
    const address = wx.getStorageSync("address");
    // a 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    // b 计算全选
    // every数组方法 会遍历 会接收一个回调函数 如果每个回调函数都返回true 那么 every方法的返回值为true
    // 只要又一个返回false 那么every方法返回true
    // 空数组 调用 也会返回true
    // const allChecked = cart.length? cart.every(v=>v.checked):false
    // 2.把数据 设置给data中的一个变量
    this.setData({
      address
    })  
    this.serCart(cart)

  },
  // 点击收货地址
  handleChooseAddress(){
    // 2. 获取收获地址
    wx.chooseAddress({
      success: (address) => {
        // console.log(result)
        address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo
        wx.setStorageSync("address", address);         
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  // 商品的选中事件
  handleItemChange(e){
    // 1.获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id
    // console.log(goods_id);
    // 2.获取购物车数组
    let {cart}=this.data
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id)
    // 4 状态取反
    cart[index].checked = !cart[index].checked
    // // 5.存入data
    // this.setData({
    //   cart
    // })
    // // 6.写入缓存
    // wx.setStorageSync("cart",cart)
    this.serCart(cart)
  },
  // 设置购物车状态 重新计算 底部栏工具中的数据
  serCart(cart){
    let allChecked = true
    let totalNum=0
    let totalPrice=0
    cart.forEach(v => {
      if(v.checked){
        totalPrice+=v.goods_price*v.num
        totalNum+=v.num
      }else{
        allChecked = false
      }
    });
    // 判断数组是否为空
    allChecked = cart.length?allChecked:false
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    }) 
    wx.setStorageSync("cart",cart)
  },
  // 商品的全选功能
  handleItemAllChecked(){
    // 1.获取data中的数据
    let {cart,allChecked} = this.data
    // 2.修改值
    allChecked = ! allChecked
    // 3.循环修改cart数组中商品的选中状态
    cart.forEach(v=>v.checked=allChecked)
    // 4.把修改后的值 填充回data或者缓存中
    this.serCart(cart)
  },
  // 商品数量的编辑
  handleItemNumEdit(e){
    // 1.获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset
    // 2.获取购物车数组
    let {cart} = this.data
    // 3.找到商品索引
    const index = cart.findIndex(v=>v.goods_id===id)
    // 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
      // 弹窗提示
      wx.showModal({
        title: '提示',
        content: '您是否要删除？',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index,1)
            this.serCart(cart)
          }else if(result.cancel){
            console.log("用户取消");
          }
        }
      });
        
    }else{
    // 4.进行修改数量
    cart[index].num+=operation
    // 5
    this.serCart(cart)
    }
  },
  // 点击结算
  handelPay(){
// 1 判断收货地址
    const {address,totalNum} =this.data
    if(!address.userName){
      wx.showToast({
        title: '您还没有选择收货地址',
        icon:'none',
        mask: false,
      });
      return
    }  
// 2.判断购物车有无商品
    if(totalNum===0){
      wx.showToast({
        title: '您还没有选购商品！',
        icon:'none',
        mask: false,
      }); 
      return     
    }
    // 3.跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
      
  }
})