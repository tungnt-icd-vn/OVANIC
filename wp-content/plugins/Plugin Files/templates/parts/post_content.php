<?php
/** 
 * This template can be overridden by copying it to yourtheme/wp-amp/parts/post_content.php.
 *
 * @var $this AMPHTML_Template
 * @version 9.3.0
 */
?>
<?php

do_action( 'amphtml_before_content' );
echo $this->content;
wp_link_pages( array(
    'next_or_number'   => 'next',
    'before'           => '<p class="amp-multipage-holder">',
    'after'            => '</p><div class="clear"></div>',
    'nextpagelink'     => '<span class="alignright">' . __( 'Next &raquo;', 'amphtml' ) . '</span>',
    'previouspagelink' => '<span class="alignleft">' . __( '&laquo; Prev', 'amphtml' ) . '</span>',
) );
do_action( 'amphtml_after_content' );
