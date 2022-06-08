<?php
//https://stackoverflow.com/questions/39063958/woocommerce-action-hooks-and-overriding-templates
function add_brand_product_singer() {
  global $post;
  $brand = get_the_terms( $post->ID , array( 'thuong-hieu') );
  if(!empty($brand[0]->name)){
   echo '<p class="m-brand">Thương Hiệu:  <a href="#"> '. $brand[0]->name .' </a></p>';
  }
};
add_action( 'woocommerce_single_product_summary', 'add_brand_product_singer', 6 );

// notselling product is check
function shownotselling() {
  if (function_exists('get_field')){
    if(get_field('stop_selling') == true){
      echo '<p class="m-status"><strong>Sản phẩm ngừng kinh doanh</strong></p>';
      remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart');
      remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
    }
}};
add_action( 'woocommerce_single_product_summary', 'shownotselling', 7 );