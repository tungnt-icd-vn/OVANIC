<?php
function my_custom_translations( $strings ) {
  $text = array(
  'Quick View' => 'Xem nhanh',
  'SHOPPING CART' => 'Giỏ hàng',
  'CHECKOUT DETAILS' => 'Thanh toán',
  'ORDER COMPLETE' => 'Hoàn thành',
  'Accept' => 'Chấp nhận',
  'Add to cart' => 'Thêm vào giỏ hàng'

  );
  $strings = str_ireplace( array_keys( $text ), $text, $strings );
  return $strings;
  }
  add_filter( 'gettext', 'my_custom_translations', 20 );