/*
* 表的事件
*
*/
define(function(){
	var Event = function (table,view) {
		this.view = view;
		this.table = table;
		this.scrollbar = $(".scrollbar");
		this.scrollbar_block = $(".scrollbar_block");
	};

	Event.prototype.init = function() {
		this.initBind();
	};
	Event.prototype.initBind = function() {
		 var that = this;
		 this.table.mousewheel(function(event,delta) {
		 	that.view.updateHeight(event.deltaFactor,delta);
		 });
	};
	return Event;
});