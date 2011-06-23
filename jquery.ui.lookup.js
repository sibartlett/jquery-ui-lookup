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

	$.widget('ui.lookup', {
		version: '0.1.0',
		options: {
			cancelText: 'Cancel',
			delay: 300,
			disabled: false,
			height: 400,
			minLength: 1,
			modal: 400,
			name: null,
			okText: 'Ok',
			resizable: false,
			select: null,
			source: null,
			title: 'Search',
			value: null,
			width: 600
		},
		_resizeAutocomplete: function () {
			var context = $(this).is('.ui-dialog-content') ? $(this) : $(this).parent().parent().parent();
			$('.ui-lookup-results ul', context).css({
				top: '',
				left: '',
				overflowY: 'auto',
				overflowX: 'hidden',
				width: $('.ui-lookup-results', context).width(),
				height: context.height() -  $('div:first', context).outerHeight()
			});
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
				$(this).dialog('close');
			};
			buttons[$this.options.cancelText] = function () {
				$(this).dialog('close');
			};

			$this._dialog = $(dialogBody).dialog({
				autoOpen: false,
				height: $this.options.height,
				modal: true,
				resizable: $this.options.resizable,
				title: $this.options.title,
				width: $this.options.width,
				buttons: buttons,
				resize: $this._resizeAutocomplete,
				open: function (dialogEvent, dialogUi) {
					$this._autocomplete = $('input', $this._dialog)
						.autocomplete({
							appendTo: '#' + $this.options.name + ' .ui-lookup-results',
							delay: $this.options.delay,
							minLength: $this.options.minLength,
							source: $this.options.source,
							open: $this._resizeAutocomplete,
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
						
					// Copied from jQuery UI Autocomplete, just to comment out: self.close( event );
					
					var self = $this._autocomplete.data('autocomplete'),
						doc = $this._autocomplete.data('autocomplete').element[0].ownerDocument;
					
					self.menu.options.selected = function (event, ui) {
						var item = ui.item.data('item.autocomplete'),
							previous = self.previous;

						// only trigger when focus was lost (click on menu)
						if (self.element[0] !== doc.activeElement) {
							self.element.focus();
							self.previous = previous;
							// #6109 - IE triggers two focus events and the second
							// is asynchronous, so we need to reset the previous
							// term synchronously and asynchronously :-(
							setTimeout(function () {
								self.previous = previous;
								self.selectedItem = item;
							}, 1);
						}

						if (false !== self._trigger('select', event, { item: item })) {
							self.element.val(item.value);
						}
						// reset the term after the select event
						// this allows custom select handling to work properly
						self.term = self.element.val();

						//self.close( event );
						self.selectedItem = item;
					};
					
					//End of jQuery UI code
					
					self.close = function () {};
					
					self.menu.element.dblclick(function (event) {
						if (!$(event.target).closest('.ui-menu-item a').length) {
							return;
						}
						event.preventDefault();
						self.menu.select(event);
						$this.options.value = $this.options._value;
						if ($this.options.select) {
							$this.options.select($this.options.value);
						}
						$this._dialog.dialog('close');
					});
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