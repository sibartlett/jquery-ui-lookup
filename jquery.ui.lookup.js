/*!
 * jQuery UI Lookup 0.1.0
 *
 * Copyright 2011, Simon Bartlett
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * https://github.com/SimonBartlett/jquery-ui-lookup
 */

(function ($) {

    $.lookup = {

        createBodyTemplate: function (name) {
            return '<div id="' + name + '" style="display:none;">' +
                '<div style="height: 30px;"><label style="display: inline;">Search: <input type="text" class="ui-widget-content ui-corner-all" style="padding: 2px;" /></label></div>' +
                '<div class="ui-lookup-results"></div>' +
                '</div>';
        }

    };

    $.widget("ui.lookup", {
        version: "0.1.0",
        options: {
            cancelText: 'Cancel',
            delay: 300,
            disabled: null,
            height: 400,
            minLength: 1,
            modal: 400,
            name: null,
            okText: 'Ok',
            select: null,
            source: null,
            title: 'Search',
            value: null,
            width: 600
        },
        _create: function () {

            if (this.options.name === null) {
                this.options.name = 'dialog_' + Math.floor(Math.random() * 10001).toString();
            }

            var $this = this,
				dialogBody = $.lookup.createBodyTemplate($this.options.name),
				buttons = { };

            buttons[$this.options.okText] = function () {
                $this.options.value = $this.options._value;
                if ($this.options.select) {
                    $this.options.select($this.options.value);
                }
                $(this).dialog("close");
            };
            buttons[$this.options.cancelText] = function () {
                $(this).dialog("close");
            };

            $this._dialog = $(dialogBody).dialog({
                autoOpen: false,
                height: $this.options.height,
                modal: true,
                resizable: false,
                title: $this.options.title,
                width: $this.options.width,
                buttons: buttons,
                open: function (dialogEvent, dialogUi) {
                    $this._autocomplete = $('input', $this._dialog)
						.autocomplete({
							appendTo: '#' + $this.options.name + ' .ui-lookup-results',
							delay: $this.options.delay,
							minLength: $this.options.minLength,
							source: $this.options.source,
							open: function (event, ui) {
								$('.ui-lookup-results ul', $this._dialog).css({
									top: '',
									left: '',
									width: $('.ui-lookup-results', $this._dialog).width(),
									height: $this._dialog.height() - $('div:first', $this._dialog).height(),
									overflowY: 'auto',
									overflowX: 'hidden'
								});
							},
							close: function (event, ui) {
								setTimeout(function () {
									$('#' + $this.options.name + ' .ui-lookup-results ul').show();
								}, 10);
								return false;
							},
							select: function (event, ui) {
								var selected = $('#ui-active-menuitem');
								setTimeout(function () {
									$this._dialog.find('.ui-lookup-results ul li a').removeClass('ui-state-active');
									selected.addClass('ui-state-active');
								}, 10);
								$this.options._value = ui.item;
								return false;
							},
							focus: function (event, ui) {
								var focused = $('#ui-active-menuitem');
								if (!focused.hasClass('ui-state-active')) {
									focused.addClass('ui-state-hover');
								}
								return false;
							}
						})
						.focus();
                }
            });

            $this.element.bind('focus', function () {
                if (!$this.options.disabled) {
                    $this._dialog.dialog('open');
                }
            });
        },
        value: function () {
            return this.options.value;
        },
        destroy: function () {
			this._autocomplete.autocomplete('destroy');
            this._dialog.dialog('destroy');
            $.Widget.prototype.destroy.apply(this, arguments);
        },
        disable: function () {
            this.options.disabled = true;
        },
        enable: function () {
            this.options.disabled = false;
        }
    });

}(jQuery));