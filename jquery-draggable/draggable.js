// Simple JQuery Draggable Plugin
// https://plus.google.com/108949996304093815163/about
// Usage: $(selector).drags();
// Options:
// handle            => your dragging handle.
//                      If not defined, then the whole body of the
//                      selected element will be draggable
// cursor            => define your draggable element cursor type
// draggableClass    => define the draggable class
// activeHandleClass => define the active handle class
// cancel            => elements to ignore starting the drag operation
//
// Update: 26 February 2013
// 1. Move the `z-index` manipulation from the plugin to CSS declaration
// 2. Fix the laggy effect, because at the first time I made this plugin,
//    I just use the `draggable` class that's added to the element
//    when the element is clicked to select the current draggable element. (Sorry about my bad English!)
// 3. Move the `draggable` and `active-handle` class as a part of the plugin option
// Next update?? NEVER!!! Should create a similar plugin that is not called `simple`!
//
// v 0.2 - @pjfsilva - Added cancel elements option. This fixes the problem where <select> elements inside the draggable
// element stop working and also improves UX as no drag event is triggered when the user is on top of a cancel element.
// This solution is based on jquery-ui cancel solution.
//
// v 0.3 - @danieldeloretta - Added in a callback function onRelease and added the draggableElement option so you can use a handle
// to drag the desired element (example: child element drags a parent element) - the previous version would apply the drag to the handle, so a nested handle would not
// move the desired element, but the nested handle instead. also updated the mouse events to include touch events because
// you know... mobile support! yay!
//
//
//
(function($) {
	$.fn.drags = function(opt) {
		
		opt = $.extend({
			handle: "",
			draggableElement: "",
			cursor: "move",
			draggableClass: "draggable",
			activeHandleClass: "active-handle",
			cancel: 'a,input,textarea,button,select,option',
			onRelease: function(){}
		}, opt);
		
		var $selected = null;
		var $elements = (opt.handle === "") ? this : this.find(opt.handle);
		
		$elements.css('cursor', opt.cursor).on("mousedown touchstart", function(e) {
			var elIsCancel = e.target.nodeName ? $(e.target).closest(opt.cancel).length : false;
			
			if(opt.handle === "") {
				$selected = $(this);
				$selected.addClass(opt.draggableClass);
			} else {
				$selected = $(this).closest(opt.draggableElement);
				$selected.addClass(opt.draggableClass).find(opt.handle).addClass(opt.activeHandleClass);
			}
			
			if (elIsCancel){
				// cancel drag if user started on a cancel element
				return true;
			}
			
			var drg_h = $selected.outerHeight(),
				drg_w = $selected.outerWidth(),
				pos_y = $selected.offset().top + drg_h - e.pageY,
				pos_x = $selected.offset().left + drg_w - e.pageX;
			$(document).on("mousemove touchmove", function(e) {
				$selected.offset({
					top: e.pageY + pos_y - drg_h,
					left: e.pageX + pos_x - drg_w
				});
			}).on("mouseup touchend", function() {
				$(this).off("mousemove touchmove"); // Unbind events from document
				if ($selected !== null) {
					$selected.removeClass(opt.draggableClass);
					$selected = null;
				}
			});
			e.preventDefault(); // disable selection
		}).on("mouseup touchend", function() {
			if(opt.handle === "") {
				$selected.removeClass(opt.draggableClass);
			} else {
				$selected.removeClass(opt.draggableClass)
					.find(opt.handle).removeClass(opt.activeHandleClass);
			}
			opt.onRelease($selected);
			$selected = null;
		});
		
		
		return this;
		
	};
})(jQuery);
