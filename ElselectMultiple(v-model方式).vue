<template>
  <div class="elselect_multiple">
    <el-select v-popover:popover v-model="strs" :clearable="clearable" :placeholder="placeholder" popper-class="select_con_hide" v-tooltip="strs"></el-select>
    <el-popover placement="bottom-start" ref="popover" :width="sourceWidth" trigger="click" popper-class="elselect_multiple_popover">
      <div class="elselect_multiple_popover_wrap" v-if="sourceData.length">
        <div class="check_filter" v-if="filterable">
          <el-input v-model="filterText" placeholder="请输入" clearable></el-input>
        </div>
        <div class="check_all" v-show="showCheckAllDiv">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedData" @change="handleCheckedDataChange" class="">
          <div class="check_item" v-for="item in Options" :key="item[defaultProps.id]">
            <el-checkbox :label="item">{{ item[defaultProps.name] }}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <div class="none" v-else>
        无数据
      </div>
    </el-popover>
  </div>
</template>

<script>
/*
  sourceData 必传
  placeholder
  sourceWidth
  defaultProps 选传 作用:配置选项
  eg: defaultProps: {
          id: 'cityId',
          name: 'cityName'
        }
*/
  export default {
    model: {
      prop: 'vals', // ! 这个vals 比较随意
      event: 'modelChange' // ! modelChange 其实是自定义的，this.$emit('modelChange', this.checkedData); 就会改父组件的值
    },
    props: {
      vals: { // !父组件v-model传进来的值
        type: Array,
        default: () => []
      },
      sourceData: {
        type: Array,
        default: () => []
      },
      // checked: { // !默认选中哪些,里面保存的是id
      //   type: Array,
      //   default: () => []
      // },
      placeholder: {
        type: String,
        default: '请多选'
      },
      sourceWidth: {
        type: Number,
        default: 193
      },
      defaultProps: { // !配置选项
        type: Object,
        default: () => {
          return {
            id: 'id',
            name: 'name'
          };
        }
      },
      clearable: {
        type: Boolean,
        default: true
      },
      filterable: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        strs: '',
        checkAll: false,
        checkedData: [],
        isIndeterminate: false,
        filterText: '',
        Options: this.sourceData,
        showCheckAllDiv: true,
        initVals: [],
        checked: [] // !选中的id
      };
    },
    watch: {
      strs(newVal) {
        if (!newVal) {
          this.isIndeterminate = false;
          this.checkedData = [];
          this.checkAll = false;
          this.$emit('modelChange', []);
        }
      },
      filterText(newVal) {
        if (newVal) {
          this.showCheckAllDiv = false;
          this.Options = this.sourceData.filter((item) => item[this.defaultProps.name].includes(newVal));
        } else {
          this.showCheckAllDiv = true;
          this.Options = this.sourceData;
        }
      },
      sourceData: {
        handler(newVal) {
          if (newVal.length) {
            this.Options = newVal;
            this.setCheckedStatus();
          }
        },
        immediate: true
      },
      vals: {
        // !重点一：使用this.$refs.form.resetFields();时 会传 默认值/初始值进来的  ["1169141089018175489"]
        handler(newVal) {
          console.log(newVal);
          this.checked = newVal;
          if (this.sourceData.length) {
            this.setCheckedStatus();
          }
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {
    },
    methods: {
      handleCheckAllChange(val) {
        console.log(val); // type: Boolean
        this.checkedData = val ? this.sourceData : [];
        // this.isIndeterminate = false;  // !CheckedStatus  会在 this.$emit('modelChange', this.checked) 后，vals传进来的时候执行setCheckedStatus
        this.checked = this.checkedData.map(item => item[this.defaultProps.id]);
        this.doAfterChange();
      },
      handleCheckedDataChange(value) {
        this.checkedData = value;
        this.checked = this.checkedData.map(item => item[this.defaultProps.id]);
        this.doAfterChange();
        console.log(value);
        // let checkedCount = value.length; // !CheckedStatus  会在 this.$emit('modelChange', this.checked) 后，vals传进来的时候执行setCheckedStatus
        // this.checkAll = checkedCount === this.sourceData.length;
        // this.isIndeterminate = checkedCount > 0 && checkedCount < this.sourceData.length;
      },
      doAfterChange() {
        this.$emit('modelChange', this.checked); // !改外面 v-model的值，即vals
        // let checkedDataNameArr = this.checkedData.map((item) => item[this.defaultProps.name]); // !CheckedStatus  会在 this.$emit('modelChange', this.checked) 后
        // this.strs = checkedDataNameArr.join('/');
      },
      // resetDatas() {
      //   this.strs = '';
      //   this.isCheckedToDo();
      // },
      setCheckedStatus() {
        let checkedCount = this.checked.length;
        this.checkAll = checkedCount === this.sourceData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.sourceData.length;
        this.checkedData = this.sourceData.filter(item => this.checked.includes(item[this.defaultProps.id])); // !根据外面传入的值让checkbox选中
        let checkedDataNameArr = this.checkedData.map((item) => item[this.defaultProps.name]);
        this.strs = checkedDataNameArr.join('/');
      }
    }
    
  };
</script>

<style lang="scss">
.elselect_multiple_popover{
  padding: 5px 0;
  .check_all,.check_item{
    height: 34px;padding-left: 15px;display: flex;align-items: center;
    &:hover{background: #f5f7fa;}
  }
  .none{text-align: center;padding: 5px 0;}
  .elselect_multiple_popover_wrap{max-height: 238px;overflow: auto;}
  .check_filter {
    padding: 5px;
  }
}
</style>
