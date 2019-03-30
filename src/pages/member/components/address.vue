<template>
  <!-- 入口在member逐组件的「个人地址管理」 -->
  <div>
   <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'member-address',
  }
</script>


<style scoped>
  @import './css/address_base.css';
  @import './css/address.css';
</style>


