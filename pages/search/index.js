// pages/search/index.js
import { request} from "../../request/index.js"
Page({
  /*
  1.输入框绑定 值改变事件 input事件
    1.获取到输入框的值
    2.合法性的判断 如空字符过滤
    3.检验通过 把输入框的值 发送到后台
    4.返回的数据显示到页面上
  2.防抖
    0.防抖 一般用于输入框 防止重复输入 重复发送请求
    1.节流 一般用于页面的上拉和下拉
     
  */

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 按钮显示与否
    isFocus:false,
    // 输入框的值
    inputVal:""
  },
  // 定义全局的定时器id
  TimeId:-1,
  // 输入框的值 改变就触发的事件
  handleInput(e){
    // 1.获取输入框的值
    const {value} = e.detail
    // 2.检验合法性
    if(!value.trim()){
      // 不合法
      this.setData({
        isFocus:false,
        goods:[]
      })
      return
    }
    // 3. 准备发送请求获取数据
    this.setData({
      isFocus:true
    })
    // 清除上一次定时器
    clearTimeout(this.TimeId);
    // 开启下一次定时器
    this.TimeId = setTimeout(()=>{
      this.qSearch(value)
    },1000)
  },
  async qSearch(query){
    const res = await request({url:"/goods/search",data:{query}})
    this.setData({
      goods:res.goods
    })
  },
  // 取消按钮
  handleCancel(){
    this.setData({
      inputVal:"",
      isFocus:false,
      goods:[]
    })

  }

})