


<!-- 
  1- 地址编辑入口过 带参数进form表单 通过 router-link带参数~
  2- form组件根据不同的all组件中的query中的type类型来实现 
  3- 同时有两个按钮也要通过识别 all组件中的query中的type类型 来做到显示或隐藏 hide or show

 -->
<template>
  <div class="container " style="min-height: 597px;">
    <div class="section section-first">
      <div class="block form js-form">
        <input class="js-id" name="id" type="hidden" value="">
        <div class="block-item" style="border-top:0;">
          <label>收货人</label>
          <input type="text" placeholder="请输入姓名" name="user_name" maxlength="20"
            v-model.trim="name"
          >
        </div>
        <div class="block-item">
          <label>联系电话</label>
          <input type="tel" placeholder="联系电话" name="tel" maxlength="11"
            v-model.trim="tel"
          >
        </div>
        <div class="block-item">
          <label>选择地区</label>
          <div class="select-group">
            <select class="js-province-selector" v-model="provinceValue">
              <option value="-1">选择省份</option>
              <option 
                v-for="province in addressData.list"
                :value="province.value"
              >
              {{province.label}}
            </option>
            </select>
            <select class="js-city-selector" v-model="cityValue" >
              <option value="-1">选择城市</option>
              <option 
                v-for="city in cityList"
                 :value="city.value"
              >{{city.label}}</option>

            </select>
            <select class="js-county-selector" name="area_code" data-code="" v-model="districtValue">
              <option value="-1">选择地区</option>
              <option 
                v-for="district in districtList "
                :value="district.value"
              >
                {{district.label}}
              </option>
            </select>
          </div>
        </div>
        <div class="block-item">
          <label>详细地址</label>
          <input type="text" placeholder="街道门牌信息" name="address_detail" maxlength="100"
            v-model.trim="addressDetail"
          >
        </div>
      </div>
    </div>
    <div class="block section js-save block-control-btn">
      <div class="block-item c-blue center"
          @click="add"
      >保存</div>
    </div>
    <div class="block section js-delete block-control-btn"
      v-show=" type==='edit' "
    >
      <div class="block-item c-red center"
        @click="remove"
      >删除</div>
    </div>
    <div class="block stick-bottom-row center js-save-default"
      v-show=" type==='edit' "
    >
      <button class="btn btn-standard js-save-default-btn"
         @click="setDefault"
      >
        设为默认收货地址
      </button>
    </div>
  </div> 
</template>
<script type="text/javascript" src="./form.js"></script>


<style type="text/css" scoped>
  @import './css/address_base.css';
 @import './css/address.css';

</style>



