define(["tableView","tableModel","tableEvent"],function(View,Model,Event){
	 var Test = function () {};
	 Test.prototype.init = function() {
	 	var beginTime = new Date().getTime();
	 	var view = new View($(".customerTable"),10);
	 	var model = new Model();
	 	model.setData();
	 	console.log("初始化加载数组长度:"+model.getData().length);
	 	view.render(model.getData(),999);
	 	var event = new Event($(".customerTable"),view);
	 	event.init();
	 	console.log("加载框架所用时间：" + (new Date().getTime() - beginTime));
	 };
	 new Test().init();
});