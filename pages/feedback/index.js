// pages/feedback/index.js
/*
1.点击+ 触发tap点击事件
  1.调用小程序内置的API
  2.获取到图片的路径 数组
  3.把图片路径 存到data的变量中
  4.页面就可以根据 图片数组 进行循环显示 自定义组件
2.点击 自定义图片 组件
  1。获取被点击的元素索引
  2.获取data中的图片数组
  3.根据索引 数组中删除对应的元素
  4 数组重新设置回data中
3.点击 提交
  1.获取文本域的内容 类似 输入框的获取
    1.data中定义变量 表示 输入内容
    2.文本域 绑定 输入事件 事件触发的时候 把输入框的值存入data
  2.对这些内容 合法性验证
  3.验证通过 用户选择的图片 上传到专门的图片服务器中 返回图片外网的连接
    1.遍历图片数组
    2.挨个上传
    3.自己维护一个图片数组 存放上传后的外网连接
  4.文本域 和外网的图片路径 一起提交到服务器  前端的模拟 不会发送到后台
  5.清空当前页面
  6.返回上一页
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      }
    ],
    chooseImage:[],
    textVal:""
  },
  // 外网图片路径数组
  UploadImgs:[],
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
  handleChoosingImg(){
    // 内置API
    wx.chooseImage({
      // 同时选中图片的数量
      count: 9,
      // 图片格式 原图/压缩过的
      sizeType: ['original', 'compressed'],
      // 图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
         chooseImage:[...this.data.chooseImage,...result.tempFilePaths]
        })
      },
    });
      
  },
  // 点击自定义图片组件
  handleRemoveImg(e){
    const {index} = e.currentTarget.dataset
    // 获取data中的图片数组
    let {chooseImage} = this.data
    // 删除元素
    chooseImage.splice(index,1)
    this.setData({
      chooseImage
     })
  },
  // 文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  // 点击按钮 提交
  handleFormSubmit(){
    // 1.获取文本域的内容
    const {textVal,chooseImage} = this.data
    // console.log(textVal);
    // 2.合法性验证
    if(!textVal.trim()){
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return
    }
    // 3.准备上传图片
    // 不支持多张图片同时上传 遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    // 判断有无需要上传的图片数组
    if(chooseImage.length!==0){
      chooseImage.forEach((v,i)=>{
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://imgse.com',
          // 被上传的图片路径
          filePath: v,
          // 上传文件的名称 后台来获取文件 file
          name:"file" ,
          // 、顺带的文本信息
          formData: {},
          success: (result) => {
            // console.log(result.data);
            let url = this.getimgsrc(result.data)
            // console.log(url);
            this.UploadImgs.push(url)
            // 所有的图片都上传完毕再触发
            if(i===chooseImage.length-1){
              // 关闭提示
              wx.hideLoading();
              console.log("文本内容和图片数组提交到后台");
              // 提交都成功了 
                 // 重置页面
              this.setData({
               textVal:'',
               chooseImage:[]
              }) 
               // 返回上一个页面
               wx.navigateBack({
                delta: 1
               });             
            }
          },
  
        });
      })
    }else{
      wx.hideLoading()
      console.log("只是提交了文本");
      this.setData({
        textVal:""
      })
      wx.navigateBack({
        delta:1
      })
    }

        
  },
  getimgsrc(htmlstr) {  
    var reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;  
    var imgsrc = ""; 
    var arr = (reg.exec(htmlstr)); 
    imgsrc = arr[2]  
    return imgsrc;  
}
})