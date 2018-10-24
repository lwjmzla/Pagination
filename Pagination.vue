<template>
  <div class="pager_wrap" v-if="totalPage > 1">
    <div class="pager" id="pager">
      <a href="javascript:;" class="pg_prev" v-if="preBol" @click='goPrev'>上一页</a>
      <span class="pg_prev" disabled="true" v-else>上一页</span>
      <!-- 页码区域 -->
      <div class="pages" ref="pages">
        <a href="javascript:;" @click="go" :class="{on: !preBol}">1</a>
        <span href="javascript:;" class="els" v-if="lEls">...</span>
        <a href="javascript:;" v-for="number of pages" :key="number" @click="go" :class="{on: curPage === number}">{{number}}</a>
        <span href="javascript:;" class="els" v-if="rEls">...</span>
        <a href="javascript:;" @click="go" :class="{on: !nextBol}">{{totalPage}}</a>
      </div>
      <!-- 页码区域完 -->
      <a href="javascript:;" class="pg_next" v-if="nextBol" @click='goNext'>下一页</a>
      <span class="pg_next" disabled="true" v-else>下一页</span>
      <div class="total">
        共 <em>{{totalPage}}</em> 页
      </div>
      <div class="goPage">
        <span>到第</span><input type="text" class="goPageInp" id="goPageInp" :value="curPage" @keyup.enter='goSp'><span>页</span>
        <a href="javascript:;" class="goPageBtn" @click='goSp'>确定</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pager',
  props: {
    curPage: Number,
    totalPage: Number,
    defaultPage: {
      type: Number,
      default: 7 // 基准页面，至少为5页，取奇数 5 7 9 11之类都可以
    }
  },
  data () {
    return {
      lEls: false,
      rEls: false
    }
  },
  methods: {
    go (event) {
      let el = event.currentTarget
      if (el.className !== 'on') {
        const targetPage = parseInt(el.innerText)
        this.$emit('goPage', targetPage)
      }
    },
    goPrev (event) {
      const targetPage = parseInt(this.curPage - 1)
      this.$emit('goPage', targetPage)
    },
    goNext (event) {
      const targetPage = parseInt(this.curPage + 1)
      this.$emit('goPage', targetPage)
    },
    // 输入框跳转
    goSp (event) {
      if (!this.IsPosInteNum(document.getElementById('goPageInp').value)) {
        this.$message({
          type: 'error',
          message: '请输入正整数',
          duration: 1500
        })
      } else {
        let targetPage = parseInt(document.getElementById('goPageInp').value)
        if (targetPage > this.totalPage) {
          targetPage = this.totalPage
        }
        this.$emit('goPage', targetPage)
      }
    },
    IsPosInteNum (num) {
      var reg = new RegExp(/^\+?[1-9][0-9]*$/)
      return reg.test(num)
    }
  },
  computed: {
    preBol () {
      return this.curPage !== 1
    },
    nextBol () {
      return this.curPage !== this.totalPage
    },
    pages () {
      const delta = (this.defaultPage - 5) / 2
      const cur = this.curPage
      const total = this.totalPage
      let _self = this

      if (cur > 3 + delta) { // cur > 4
        _self.lEls = true
      } else {
        _self.lEls = false
      }

      if (cur < total - 2 - delta) { // cur < total -3
        _self.rEls = true
      } else {
        _self.rEls = false
      }

      let arr = []
      if (!this.lEls && this.rEls) { // 1234 5 ... total
        for (let i = 2; i < this.defaultPage - 1; i++) {
          arr.push(i)
        }
      } else if (this.lEls && this.rEls) { // 1  ...  cur-1  cur  cur+1 ... total
        for (let i = cur - delta; i <= cur + delta; i++) {
          arr.push(i)
        }
      } else if (this.lEls && !this.rEls) { // 1 ... total-4 total-3 total-2 total-1 total
        for (let i = total - this.defaultPage + 3; i < total; i++) {
          arr.push(i)
        }
      } else { // <=7
        for (let i = 2; i < total; i++) {
          arr.push(i)
        }
      }
      return arr
    }
  }
}
</script>

<style lang='stylus' scoped>
  .pager_wrap
    margin-top 20px
    text-align center
    .pager
      display inline-block
      overflow hidden
      max-width 870px
      .pg_prev,.pg_next
        margin-right 10px
        float left
        width 74px
        height 36px
        line-height 36px
        text-align center
        font-size 14px
        color #999
        border 1px solid #ccc
        border-radius 3px
        box-sizing border-box
        overflow hidden
      .pg_prev[disabled='disabled'],.pg_next[disabled='disabled']
        border-color #eee
        background: #eee
      a.pg_prev:hover,a.pg_next:hover
        border-color #C9151E
        color #C9151E
      .pages
        float left
        >a,>span
          margin-right 10px
          float left
          width 40px
          height 36px
          line-height 36px
          text-align center
          font-size 14px
          color #999
          border 1px solid #ccc
          border-radius 3px
          box-sizing border-box
          overflow hidden
        >a:hover
          border-color #C9151E
          color #C9151E
        .on
          background #C9151E
          border-color #C9151E
          color #fff
          &:hover
            color #fff
        .els
          border-color transparent
      .total
        float: left
        font-size 14px
        color: #999
        line-height: 36px
        em
          font-style normal
      .goPage
        float: left;
        margin-left: 10px
        color: #999
        line-height: 36px
        span
          float left
          font-size 14px
        .goPageInp
          float left
          margin 0px 10px
          width 40px
          height 36px
          line-height 34px
          text-align center
          font-size 14px
          color #999
          border 1px solid #ccc
          border-radius 3px
          box-sizing border-box
          outline none
        .goPageBtn
          display: inline-block
          margin-left: 8px
          border  1px solid #ccc
          width  50px;
          height  36px;
          line-height  36px
          font-size 14px
          color  #999
          border-radius 3px
          box-sizing border-box
          &:hover
            border-color #C9151E
            color #C9151E
</style>
