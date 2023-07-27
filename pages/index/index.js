// 0. 引入 用来发送请求的 方法 一定要把路径补全
import { request} from "../../request/index.js"
//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 分类数组
    cateList:[],
    // 楼层数据
    floorList:[]

    
  },
  //页面开始加载就会触发
  onLoad: function(options) {
    this.getSwiperList(),
    this.getCateList(),
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList(){
    // 1.发送异步请求获取轮播图数据
  //  wx.request({
  //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
  //     success: (result) => {
  //       // console.log(result);
  //       this.setData({
  //         swiperList:result.data.message
  //       })
  //     }
  //   });
      
  request({url:"/home/swiperdata"})
  .then(result=>{
     this.setData({
       swiperList:result
     })
  })
  },
  // 获取分类导航数据
  getCateList(){    
  request({url:"/home/catitems"})
  .then(result=>{
     this.setData({
       cateList:result
     })
  })
  },  
  // 获取楼层导航数据
  getFloorList(){    
    request({url:"/home/floordata"})
    .then(result=>{
      result.forEach(v1 => {
        v1.product_list.forEach(v2 => {
          v2.navigator_url = v2.navigator_url.replace(/\?/, "/index\?");
          // console.log(v2.navigator_url);
        }); 
      });
       this.setData({
        floorList:result
       })
    })
    }, 
});
  