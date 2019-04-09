<template>
  <div class="main">
    <h1>购物车案例</h1>
    <Tabs>
      <TabPane label="全局/Vue实例插件">
        <Plugins/>
      </TabPane>

      <TabPane label="混入mixin">
        <C/>
      </TabPane>

      <TabPane label="自定义指令">
        <D/>
      </TabPane>
      <TabPane label="商品列表">
        <ProductList/>
      </TabPane>

      <TabPane label="购物车">
        <ShoppingCart/>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Plugins from "./Plugins.vue";
import C from "./C.vue";
import D from "./D.vue";
import ProductList from "./ProductList.vue";
import ShoppingCart from "./ShoppingCart.vue";
import { Tabs, TabPane } from "iview";
export default {
  components: { ProductList, ShoppingCart, Tabs, TabPane, Plugins, C, D }
};
</script>


<style scoped>
.main {
  margin: 20px;
}
</style>
