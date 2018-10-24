# Pagination--Vue分页组件
### @param: curPage     必选 [Number]     当前页
### @param: totalPage     必选 [Number]     总页数
### @param: defaultPage     可选 [Number]     默认为7，至少为5，取奇数 5 7 9 11之类都可以(该项一般不需要改)
![github](https://raw.githubusercontent.com/lwjmzla/Pagination/master/img-storage/demo.png "github")
#### 7就是图片框起来的地方
### @Events:  goPage  参数  目标页
## 使用方式<Pager :curPage="curPage" :totalPage="totalPage"  @goPage="goP"></Pager>