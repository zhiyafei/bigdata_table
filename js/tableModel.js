define(function(){
	var Model = function(){
		this.data = [];
	};
	Model.prototype.setData = function(data) {
		if (!data) {
			var templArr = [];
			for (var i = 0; i< 1100; i ++){
				templArr.push({name:"testName"+i,age:"testAge"+i,sex: i % 2 == 0 ? "男":"女"});
			}
		}
		this.data = this.data.concat(templArr,this.data);
	};
	Model.prototype.getData = function() {
		return this.data;
	};
	return Model;
});