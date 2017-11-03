define(function() {
	var View = function(table, visibleContentNumber) {
		// jQuery table 对象
		this.table = table;
		// 存放数据的tableData 
		this.tableDataSource = [];
		// 初始化可见行数
		this.visibleContentNumber = visibleContentNumber || 10;
		// 每次移动多少条数据
		this.moveNumber = 8;
		// 【重要】【仅执行一次】整个页面的tr td 渲染模型
		this.tableDomModel = [];
		// 【重要】【二维数组】整个页面的td位置 
		this.cellPosition = [];
		// 每一个单元格的高度是多少
		this.cellHeigh = 43;
		// 从tableData的哪个地方开始渲染data
		this.beginIndex = 0;
		// 结束渲染
		this.endIndex = this.visibleContentNumber;
		// 多少列
		this.columnsNumber = 0;
		// 多少行
		this.rowsNumber = this.visibleContentNumber;
		// 滚动条
		this.scrollbar = $(".scrollbar");
		// 滑块
		this.slider = $(".scrollbar_block");
		// 滑块位移
		this.slider_once_displacement = 0;
		// 滑块最小高度 3%
		this.slider_min_height_percentage = 0.03;
	};
	View.prototype.render = function(arrayData, beginIndex) {
		// 如果开始位置加上显示条目大于整个数组长度
		if (!beginIndex || (beginIndex + this.visibleContentNumber) >= arrayData.length) {
			beginIndex = 0;
		}
		// 获取开始位置
		this.beginIndex = beginIndex;
		// 首次加载结束位置
		this.endIndex = beginIndex + this.visibleContentNumber;
		// 获取列的数量
		this.columnsNumber = this.objectToArray(arrayData[0]).length;
		// 获取表的数据源
		this.tableDataSource = arrayData;
		// 创建空的表的dom模型 和 位置映射
		this.createEmptyTableDomModel();
		// 把空的dom结构塞入到表的容器里
		this.table.append(this.tableDomModel);
		// 渲染滚动条必要参数
		this.calculationScrollBar();
		// 计算滑块单次位移的大小
		this.calculationSliderOnceDisplacement();
		// 初始化滑块的位置
		this.setScrollbarPaddingTop();
		// 渲染表的内容
		this.updateVisibleTableData();
	};

	View.prototype.calculationScrollBar = function() {
		var tableHeight = this.visibleContentNumber * this.cellHeigh;
		this.scrollbar.height(tableHeight);
		// 高度百分比
		var heightPercentage = this.visibleContentNumber / this.tableDataSource.length;
		// 最小化处理
		if (heightPercentage < 0.02) heightPercentage = this.slider_min_height_percentage;
		this.slider.height(tableHeight * heightPercentage);
	};
	View.prototype.calculationSliderOnceDisplacement = function() {
		// 余量单个对应高度
		this.slider_once_displacement = (this.scrollbar.height() - this.slider.height()) / (this.tableDataSource.length - this.visibleContentNumber);
		// 单次滚动的高度
		 //= oneItemHeight * this.moveNumber;
	};
	View.prototype.updateVisibleTableData = function() {
		for (var i = this.beginIndex, k = 0; i < this.endIndex; i++) {
			var trItemData = this.objectToArray(this.tableDataSource[i]);
			for (var j = 0; j < trItemData.length; j++) {
				this.updateCellValue(this.cellPosition[k][j], trItemData[j]);
			}
			k++;
		}
	};
	View.prototype.objectToArray = function(obj) {
		var arr = [];
		for (var key in obj) {
			arr.push(obj[key]);
		}
		return arr;
	};
	View.prototype.updateCellValue = function(td, value) {
		td.text(value);
	};
	View.prototype.setScrollbarPaddingTop = function(isBottom) {
		if (isBottom){
			return this.scrollbar.css("padding-top", this.slider_once_displacement/this.moveNumber *(this.tableDataSource.length - this.visibleContentNumber) + "px");
		}
		return this.scrollbar.css("padding-top", this.slider_once_displacement * this.beginIndex + "px");
	};
	View.prototype.updateHeight = function(height, delta) {
		var beginIndexTime = new Date().getTime();
		if (delta > 0) {
			this.beginIndex += this.moveNumber;
			this.endIndex += this.moveNumber;
			if (this.endIndex >= this.tableDataSource.length){
				this.beginIndex = this.tableDataSource.length - this.visibleContentNumber;
				this.endIndex = this.tableDataSource.length;
			}
		} else {
			this.beginIndex -= this.moveNumber;
			this.endIndex -= this.moveNumber;
			if (this.beginIndex < 0){
				this.beginIndex = 0;
				this.endIndex = this.visibleContentNumber;
			} 	
		}
		this.setScrollbarPaddingTop();
		this.updateVisibleTableData();
		console.log((delta > 0) ? "【【向下加载数据】】】加载毫秒数:" : "【【向上加载数据】】】加载毫秒数:" + (new Date().getTime() - beginIndexTime));
	};
	View.prototype.createEmptyTableDomModel = function() {
		// TODO check first and end ; 
		// 循环行
		for (var i = 0; i < this.rowsNumber; i++) {
			var tr = this.getCloneTR();
			this.cellPosition[i] = [];
			// 循环列
			for (var j = 0; j < this.columnsNumber; j++) {
				var td = this.getCloneTD();
				// 二维数组对应关系
				this.cellPosition[i][j] = td;
				tr.append(td);
			}
			// 空的tr td 
			this.tableDomModel.push(tr);
		}
	};
	View.prototype.getCloneTR = function(first_argument) {
		return this.table.find(".clone_tr").clone().removeClass("clone_tr hide");
	};
	View.prototype.getCloneTD = function(first_argument) {
		return this.table.find(".clone_td").clone().removeClass("clone_td hide");
	};
	return View;
});