<template>
  <div class="elselect_multiple">
    <el-select v-popover:popover v-model="strs" :placeholder="sourcePlaceholder" popper-class="select_con_hide" v-tooltip="strs"></el-select>
    <el-popover placement="bottom-start" ref="popover" :width="sourceWidth" trigger="click" popper-class="elselect_multiple_popover">
      <div class="elselect_multiple_popover_wrap" v-if="sourceData.length">
        <div class="check_all">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedData" @change="handleCheckedDataChange" class="">
          <div class="check_item" v-for="item in sourceData" :key="item[defaultProps.id]">
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
  checked 选传 数组，里面是id
  sourcePlaceholder
  sourceWidth
  defaultProps 选传 作用:配置选项
  eg: defaultProps: {
          id: 'cityId',
          name: 'cityName'
        }
*/
  export default {
    props: {
      sourceData: {
        type: Array,
        default: () => []
      },
      checked: { // !里面保存的是id
        type: Array,
        default: () => []
      },
      sourcePlaceholder: {
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
      }
    },
    data() {
      return {
        strs: '',
        checkAll: false,
        checkedData: [],
        isIndeterminate: false
      };
    },
    mounted() {
      if (this.checked.length) {
        // this.checkedData = [{ id: 1, name: '广州11111111' }]; // !这种是无效的
        this.checkedData = this.sourceData.filter((item) => this.checked.includes(item[this.defaultProps.id])); // !checkedData要和 sourceData关联才有效。
        let checkedCount = this.checked.length;
        this.checkAll = checkedCount === this.sourceData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.sourceData.length;
        this.doAfterChange();
      }
    },
    methods: {
      handleCheckAllChange(val) {
        console.log(val); // type: Boolean
        this.checkedData = val ? this.sourceData : [];
        this.isIndeterminate = false;
        this.doAfterChange();
      },
      handleCheckedDataChange(value) {
        this.checkedData = value;
        this.doAfterChange();
        console.log(value);
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.sourceData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.sourceData.length;
      },
      doAfterChange() {
        this.$emit('update:vals', this.checkedData);
        let checkedDataNameArr = this.checkedData.map((item) => item[this.defaultProps.name]);
        this.strs = checkedDataNameArr.join('/');
      },
      resetDatas() {
        this.strs = '';
        this.isIndeterminate = false;
        this.checkedData = [];
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
}
</style>
