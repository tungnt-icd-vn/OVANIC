var amphtml = amphtml || {};
(function ($) {
  'use strict';

  $(document).on('click', '.notice-warning.update_wp_amp .notice-dismiss', hidePluginNotice);
  $(document).on('click', '#amp-settings #update_license', updatePlugin);
  $(document).on('click', '#amp-settings #submit', onFormSubmit);

  if ($('#shop_view').length || $('#wc_archives_view').length) {
    toggleDraggableBlocks();

    $('#shop_view').on('change', toggleDraggableBlocks);
    $('#wc_archives_view').on('change', toggleDraggableBlocks);
  }

  /**
   * Remove notice on click the close button
   */
  function hidePluginNotice(e) {
    e.preventDefault();

    $.post(amphtml.ajaxUrl, {action: 'delete_notice_wp_amp'}, function (res) {
      jQuery('.license-box-api').slideUp();
    });
  }

  /**
   * Update license on click "Update" button
   */
  function updatePlugin(e) {
    e.preventDefault();
    var self = this,
      regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

    $.ajax({
      beforeSend: function () {
        $('.license-activated-notice').addClass('block-ui');
        $(self).attr('disabled', true);
      },
      url: amphtml.ajaxUrl,
      method: 'POST',
      data: {
        action: 'update_wp_amp'
      },
      success: function (res) {
        if (typeof res === 'string') {
          $(self).remove();

          res = res.replace(regex, '');

          var notice = $('<div >')
            .addClass('update-notice')
            .html(res);
          $(notice).insertAfter('.license-activated-notice');
        }

        $('.notice-warning.update_wp_amp .notice-dismiss').trigger('click');
      },
      error: function () {
        console.error(arguments);
      },
      complete: function () {
        $('.license-activated-notice').removeClass('block-ui');
      }
    });
  }

  /**
   * Fires along with settings form submitting
   */
  function onFormSubmit() {
    var currentTab = $('input[name="tab"]').val();

    if (currentTab === 'license') {
      $(this).addClass('disabled');
    }
  }

  // ColorPicker attach
  $('.amphtml-colorpicker').wpColorPicker();

  $('#reset').on('click', function (e) {
    var reset = confirm('Your changes will be overridden. Are you sure?');
    if (reset) {
      $('#amp-settings').attr('action', '#');
    } else {
      e.preventDefault();
    }
  });

  /**
   * Toggle "disabled/enabled" state of a admin settings form table
   * depends on selected products view
   */
  function toggleDraggableBlocks() {
    var isNeedDisableBlocks = isNewTemplateEnabled(),
      $table = $('#amp-settings .form-table');

    return isNeedDisableBlocks ? $table.addClass('disable-draggable') : $table.removeClass('disable-draggable');
  }

  /**
   * Returns bool which means new products template currenty is selected
   */
  function isNewTemplateEnabled() {
    var productTemplateKey = 'list_2';

    if ($('#shop_view').length) {
      return $('#shop_view').val() === productTemplateKey;
    }

    if ($('#wc_archives_view').length) {
      return $('#wc_archives_view').val() === productTemplateKey;
    }

    return false;
  }

  var manage_image = function (element, custom_uploader) {
    element.find('.reset_image_button').on('click', function (e) {
      element.find('.upload_image').val('');
      element.find('.logo_preview').hide();
      element.find(this).hide();
    });

    element.find('.upload_image_button').on('click', function (e) {
      e.preventDefault();

      //If the uploader object has already been created, reopen the dialog
      if (custom_uploader) {
        custom_uploader.open();
        return;
      }

      //Extend the wp.media object
      custom_uploader = wp.media.frames.file_frame = wp.media({
        title: 'Choose Image',
        button: {
          text: 'Choose Image'
        },
        multiple: false
      });

      custom_uploader.on('select', function () {
        var attachment = custom_uploader
            .state()
            .get('selection')
            .first()
            .toJSON(),
          img_obj = prepare_attachment(attachment);
        element.find('.upload_image').val(img_obj);
        element.find('.logo_preview img').attr('src', attachment.url);
        element.find('.logo_preview').show();
        element.find('.reset_image_button').show();
      });

      custom_uploader.open();
    });
  };

  function prepare_attachment(attachment) {
    var data = {
      id: attachment.id,
      url: attachment.url,
      height: attachment.height,
      width: attachment.width,
      alt: attachment.alt
    };
    return JSON.stringify(data);
  }

  var logo_uploader;
  var image_uploader;
  var main_logo;

  manage_image($('tr[data-name=default_logo]'), logo_uploader);
  manage_image($('tr[data-name=default_image]'), image_uploader);
  manage_image($('tr[data-name=favicon]'), image_uploader);
  manage_image($('tr[data-name=logo]'), main_logo);

  $('#google_analytic').mask('SS-000099999-0999');

  $('#custom_content_width').on('keydown', function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if (
      $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });

  var checkLogo = function () {
    switch ($('#logo_opt').val()) {
      case 'icon_logo':
        $('tr')
          .has('.logo_preview')
          .show();
        $('tr')
          .has('#logo_text')
          .hide();
        $('.img_text_size_logo').show();
        $('.img_text_size_full').hide();
        break;
      case 'text_logo':
        $('tr')
          .has('#logo_text')
          .show();
        $('tr')
          .has('.hide_preview')
          .hide();
        break;
      case 'icon_an_text':
        $('tr')
          .has('#logo_text')
          .show();
        $('tr')
          .has('.logo_preview')
          .show();
        $('.img_text_size_logo').show();
        $('.img_text_size_full').hide();
        break;
      case 'image_logo':
        $('tr')
          .has('#logo_text')
          .hide();
        $('tr')
          .has('.logo_preview')
          .show();
        $('.img_text_size_full').show();
        $('.img_text_size_logo').hide();
        break;
    }
  };
  checkLogo();

  $('#logo_opt').on('change', function () {
    checkLogo();
  });

  if ($('input[name="amphtml-exclude"]:checked').length === 1) {
    $('#amphtml-metabox-settings').hide();
    $('#amphtml-featured-image').hide();
  }

  $('input[name="amphtml-exclude"]').on('change', function () {
    $('#amphtml-metabox-settings').toggle();
    $('#amphtml-featured-image').toggle();
  });

  $('#amp-settings select').each(function (idx, field) {
    $(field).select2({
      allowClear: false,
      minimumResultsForSearch: -1
    });
  });

  amphtml.postSettings = {
    postContent: 'content',
    excludedContent: 'amphtml-custom-content',
    overwriteContent: $('input[name=amphtml-override-content]'),
    overwriteTitle: $('input[name=amphtml-override-title]'),
    excludedTitle: $('input[name=amphtml-custom-title]'),
    postTitle: $('#title'),
    excludedContentWrap: $('#wp-amphtml-custom-content-wrap'),
    init: function () {
      if (!this.overwriteContent.prop('checked')) {
        amphtml.utils.disableExcludedContent();
      }
      if (!this.overwriteTitle.prop('checked')) {
        this.excludedTitle.prop('disabled', true);
      }
    },
    addEvents: function () {
      var self = this;
      this.overwriteContent.on('change', function () {
        if (this.checked) {
          amphtml.utils.enableExcludedContnet();
          var postContent = amphtml.utils.getContent(self.postContent);
          var overrideContent = true;
          if (amphtml.utils.getContent(self.excludedContent).length > 0) {
            overrideContent = amphtml.utils.confirmBox(
              'Do you want replace current AMPHTML content with post content?',
              postContent
            );
          } else if (postContent) {
            amphtml.utils.setExcludedContent(postContent);
          }
        } else {
          amphtml.utils.disableExcludedContent();
        }
      });

      this.overwriteTitle.on('change', function () {
        if (this.checked && self.excludedTitle.html().length == 0) {
          self.excludedTitle.prop('disabled', false);
          var title = self.postTitle.val();
          self.excludedTitle.val(title);
        } else {
          self.excludedTitle.prop('disabled', true);
        }
      });
    }
  };

  amphtml.utils = {
    isTinyMCE: function (name) {
      return typeof window['tinyMCE'] !== 'undefined' && tinyMCE.get(name);
    },
    getContent: function (name) {
      if (this.isTinyMCE(name)) {
        return tinyMCE.get(name).getContent();
      } else {
        return $('#' + name).html() || wp.data.select('core/editor').getEditedPostContent();
      }
    },
    setExcludedContent: function (content) {
      if (this.isTinyMCE(amphtml.postSettings.excludedContent)) {
        tinyMCE.get(amphtml.postSettings.excludedContent).setContent(content);
      } else {
        $('#' + amphtml.postSettings.excludedContent).html(content);
      }
    },
    disableExcludedContent: function () {
      if (
        this.isTinyMCE(amphtml.postSettings.excludedContent) &&
        amphtml.postSettings.excludedContentWrap.hasClass('tmce-active')
      ) {
        tinymce
          .get(amphtml.postSettings.excludedContent)
          .getBody()
          .setAttribute('contenteditable', 'false');
      }
      $('#' + amphtml.postSettings.excludedContent).prop('disabled', true);
    },
    enableExcludedContnet: function () {
      if (
        this.isTinyMCE(amphtml.postSettings.excludedContent) &&
        amphtml.postSettings.excludedContentWrap.hasClass('tmce-active')
      ) {
        tinymce
          .get(amphtml.postSettings.excludedContent)
          .getBody()
          .setAttribute('contenteditable', 'true');
      }
      $('#' + amphtml.postSettings.excludedContent).prop('disabled', false);
    },
    confirmBox: function (message, postContent) {
      $('<div></div>')
        .appendTo('body')
        .html('<div>' + message + '</div>')
        .dialog({
          modal: true,
          autoOpen: true,
          width: 'auto',
          resizable: false,
          buttons: {
            Yes: function () {
              amphtml.utils.setExcludedContent(postContent);
              $(this).dialog('close');
            },
            No: function () {
              $(this).dialog('close');
            }
          },
          close: function (event, ui) {
            $(this).remove();
          }
        });
    }
  };

  amphtml.ad = {
    addNewBlockButton: $('#add-new-ad'),
    deleteAdButton: $('#delete-ad'),
    fields: [
      'ad_data_id_client',
      'ad_adsense_data_slot',
      'ad_doubleclick_data_slot',
      'ad_content_code',
      'ad_width',
      'ad_height',
      'ad_layout'
    ],
    getField: function (id) {
      return '#' + id + '_' + amphtml.current_section;
    },

    updateAd: function (type) {
      var visible_fields = [];
      switch ($('#ad_type_' + type).val()) {
        case 'adsense':
          visible_fields = ['ad_data_id_client', 'ad_adsense_data_slot', 'ad_width', 'ad_height', 'ad_layout'];
          break;
        case 'doubleclick':
          visible_fields = ['ad_doubleclick_data_slot', 'ad_width', 'ad_height', 'ad_layout'];
          break;
        case 'adsense_auto':
          visible_fields = ['ad_data_id_client'];
          break;
        case 'other':
          visible_fields = ['ad_content_code'];
          break;
      }
      this.showFields(visible_fields);
    },
    init: function () {
      var self = this;
      self.updateAd(amphtml.current_section);

      $('#ad_type_' + amphtml.current_section).on('change', function () {
        self.updateAd(amphtml.current_section);
      });

      this.addNewBlockButton.on('click', function () {
        $('#amp-settings').attr('action', '#');
        $('input[name=action]').val('add_new_ad_block');

        $(self.data_id_client).attr('required', false);
        $(self.ad_sense_data_slot).attr('required', false);
        $(self.double_click_data_slot).attr('required', false);
      });

      this.deleteAdButton.on('click', function () {
        $('#amp-settings').attr('action', '#');
        $('input[name=action]').val('delete_ad_block');

        $(self.data_id_client).attr('required', false);
        $(self.ad_sense_data_slot).attr('required', false);
        $(self.double_click_data_slot).attr('required', false);
      });
    },
    hideField: function (field) {
      $('tr')
        .has(field)
        .hide();
      $(field).attr('required', false);
    },
    showFields: function (visible_fields) {
      var self = this;
      $.each(this.fields, function (index, el) {
        var field = self.getField(el);
        if (visible_fields.indexOf(el) !== -1) {
          $('tr')
            .has(field)
            .show();
          $(field).attr('required', true);
        } else {
          self.hideField(field);
        }
      });
    }
  };

  amphtml.schema = {
    fields: [
      'legal_service_name',
      'legal_service_telephone',
      'legal_service_price_range',
      'legal_service_street_address',
      'legal_service_address_locality',
      'legal_service_postal_code',
      'legal_service_address_region',
      'legal_service_address_country',
      'legal_service_open_days',
      'legal_service_opens',
      'legal_service_closes',
      'contact_point_contact_type',
      'contact_point_telephone',
      'contact_point_page_url',
      'contact_point_email',
      'contact_point_area_served',
      'contact_point_available_language'
    ],
    init: function () {
      this.schemaSelectLoad();
    },
    schemaSelectLoad: function () {
      var self = this,
        select = $('#schema_type');
      self.updateSchema();
      select.on('change', function () {
        self.updateSchema();
      })
    },
    getField: function (id) {
      return '#' + id;
    },
    updateSchema: function () {
      var visible_fields = [];
      var required_fields = [];
      switch ($('#schema_type').val()) {
        case 'LegalService':
          visible_fields = [
            'legal_service_name',
            'legal_service_telephone',
            'legal_service_price_range',
            'legal_service_street_address',
            'legal_service_address_locality',
            'legal_service_postal_code',
            'legal_service_address_region',
            'legal_service_address_country',
            'legal_service_open_days',
            'legal_service_opens',
            'legal_service_closes',
            'contact_point_contact_type',
            'contact_point_telephone',
            'contact_point_page_url',
            'contact_point_email',
            'contact_point_area_served',
            'contact_point_available_language'
          ];
          required_fields = [
            'legal_service_name',
            'legal_service_price_range',
            'legal_service_street_address',
            'legal_service_address_locality',
            'legal_service_postal_code',
            'legal_service_address_region',
            'legal_service_open_days',
            'legal_service_opens',
            'legal_service_closes',
            'contact_point_telephone',
          ];
          break;
      }
      this.showFields(visible_fields, required_fields);
    },
    hideField: function (field) {
      $('tr')
        .has(field)
        .hide();
      $(field).attr('required', false);
    },
    showFields: function (visible_fields, required_fields) {
      var self = this;
      $.each(this.fields, function (index, el) {
        var field = self.getField(el);
        if (visible_fields.indexOf(el) !== -1) {
          $('tr')
            .has(field)
            .show();
          if (required_fields.indexOf(el) !== -1) {
            $(field).attr('required', true);
          }
        } else {
          self.hideField(field);
        }
      });
    }
  };

  amphtml.fonts = {
    addNewFontBtn: $('#amphtml-add-font'),
    fontsTmpl: $('#amphtml-custom-font-tmpl').html(),
    tmplReplacer: /__N__/g,
    init: function () {
      this.addEvents();
    },
    addEvents: function () {
      var self = this;

      this.addNewFontBtn.off('click').on('click', function () {
        self.appendFontsBlock.call(self);
      });

      $('.amphtml-delete-font')
        .off('click')
        .on('click', function () {
          self.removeFont.call(this, self);
        });
    },
    appendFontsBlock: function () {
      var fontsBlocksCount = this.getFontsBlocksCount();
      var fontsTmpl = this.fontsTmpl.replace(this.tmplReplacer, fontsBlocksCount + 1);
      $(fontsTmpl).insertBefore(this.addNewFontBtn);

      this.addEvents();
    },
    removeFont: function (self) {
      var fontBlock = $(this).closest('.amphtml-custom-font');
      fontBlock.slideUp();

      setTimeout(function () {
        fontBlock.remove();
        self.recalculateBlocks();
      }, 300);
    },
    getFontsBlocksCount: function () {
      return $('.amphtml-custom-font').length;
    },
    recalculateBlocks: function () {
      $('.amphtml-custom-font').each(function (i, item) {
        var legend = $(this).find('legend'),
          label = $(this)
            .find('legend')
            .text(),
          newLabel = label.replace(/[\d]+/, i + 1);

        legend.text(newLabel);
      });
    }
  };
  amphtml.postSettings.addEvents();

  if (amphtml.postSettings.excludedContentWrap.has('html-active')) {
    amphtml.postSettings.init();
  }

  amphtml.ad.init();
  amphtml.fonts.init();
  amphtml.schema.init();

  // add sortable for templates and wc tabs
  var tab = amphtml.current_tab;
  var tab_section = amphtml.current_section;
  if (tab == 'templates' || (tab == 'wc' && tab_section != 'add_to_cart')) {
    var templateElements = $('.form-table tbody');
    templateElements.sortable({
      items: 'tr:not(.unsortable)'
    });
    $('#submit').on('click', function (event) {
      var positions = templateElements.sortable('toArray', {
        attribute: 'data-name'
      });
      if (tab_section == 'wc_archives') {
        positions.unshift('wc_archives_desc');
      }
      var data = {
        positions: positions,
        action: amphtml.action,
        current_section: amphtml.current_section
      };

      $.ajax({
        type: 'POST',
        url: amphtml.ajaxUrl,
        data: data,
        async: false
      });
    });
  }
})(jQuery);
