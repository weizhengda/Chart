/**
 * Created by Jayce on 2017/4/27 0027.
 */
function Draw(target, opt) {
	// 定义默认的参数
	this.config = {
		width: 100,
		height: 100,
		type: 'column'
	}
	
	// 用传过来的参数修改 默认参数
	for (var key in opt) {
		this.config[key] = opt[key];
	}
	
	// 先获取容器
	var container = document.querySelector(target);
	container.style.width = this.config.width + 'px';
	container.style.height = this.config.height + 'px';
	container.style.margin = '0 auto';
	container.style.border = '1px solid #000';
	container.style.borderRadius = '5px';
	
	// 创建一个 画布 并插入到 上面的容器中
	var canvasEl = document.createElement('canvas');
	container.appendChild(canvasEl);
	canvasEl.width = this.config.width;
	canvasEl.height = this.config.height;
	
	// 获取画笔
	this.ctx = canvasEl.getContext('2d');
	
	// 定义宽高的百分比
	this.vw = this.config.width * 0.01;
	this.vh = this.config.height * 0.01;
	
	this.init();
}

Draw.prototype = {
	init: function() {
		
		// 三个点的坐标的确定
		this.pos = {
			one: {x: 10 * this.vw, y: 10 * this.vh},
			two: {x: 10 * this.vw, y: 90 * this.vh},
			three: {x: 90 * this.vw, y: 90 * this.vh},
			width: 80 * this.vw,
			height: 80 * this.vh
		};
		
		
		// 根据传过来 的 type 类型 画不同类型的图表
		if (this['draw' + this.config.type]) {
			this['draw' + this.config.type]();
		} else {
			alert('请遵守游戏规则！！！！');
		}
	},
	// 画柱状图
	drawcolumn: function() {
		var ctx = this.ctx;
		this.drawXY();
		// 数据的条数
		var data = this.config.data;
		var pos = this.pos;
		var xdeep = parseInt(pos.width / (data.length + 1));
		// 柱状图的宽度
		var cwidth = xdeep / 2;
		// y 轴的 百分比
		var cvh = pos.height / this.getDataMax();
		
		for (var i = 0; i < data.length; i++) {
			ctx.beginPath();
			ctx.fillStyle = data[i].color;
			var x = xdeep * (i + 1) + i / 2 * xdeep;
			ctx.rect(x - cwidth / 2, pos.two.y, cwidth, -data[i].money * cvh);
			ctx.fill();
			
			ctx.beginPath();
			ctx.textAlign = 'center';
			ctx.fillText(data[i].name, x, pos.two.y + 10);
		}
		
		
		// 1.  x   ;
		
		// 2.  x   xdeep * 2 + 1/2 xdeep
		// 3.  x   xdeep * 3 + 1 xdeep
		// 4.  x   xdeep * 4 + 3/2 xdeep
		
	},
	// 画折线图
	drawline: function() {
		console.log('折线图');
	},
	// 画饼图
	drawpie: function() {
		console.log('饼图');
	},
	// 画坐标系的方法
	drawXY: function() {
		var ctx = this.ctx;
		var pos = this.pos;
		
		// x, y
		ctx.beginPath();
		ctx.moveTo(pos.one.x, pos.one.y);
		ctx.lineTo(pos.two.x, pos.two.y);
		ctx.lineTo(pos.three.x, pos.three.y);
		ctx.stroke();
		
		// y 箭头
		ctx.beginPath();
		ctx.moveTo(pos.one.x - 10, pos.one.y + 10);
		ctx.lineTo(pos.one.x, pos.one.y);
		ctx.lineTo(pos.one.x + 10, pos.one.y + 10);
		ctx.stroke();
		
		// x 箭头
		ctx.beginPath();
		ctx.moveTo(pos.three.x - 10, pos.three.y - 10);
		ctx.lineTo(pos.three.x, pos.three.y);
		ctx.lineTo(pos.three.x - 10, pos.three.y + 10);
		ctx.stroke();
		
		// x , y 字
		ctx.font = '26px 微软雅黑';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.beginPath();
		ctx.fillText('x', pos.three.x + 10, pos.three.y);
		ctx.beginPath();
		ctx.fillText('y', pos.one.x - 10, pos.one.y - 10);
		
		// 0 刻度
		ctx.font = '16px 微软雅黑';
		ctx.textAlign = 'right';
		ctx.beginPath();
		ctx.fillText('0', pos.two.x - 10, pos.two.y);
		
		// 6根虚线
		// 横着画实现 #ccc
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 2;
		// 间隙
		var ydeep = pos.height / 6;
		// 获取我的数据的最大值
		var maxData = this.getDataMax();
		for (var i = 0; i < 6; i++) {
			ctx.beginPath();
			ctx.moveTo(pos.one.x, i * ydeep + pos.one.y);
			ctx.lineTo(pos.three.x, i * ydeep + pos.one.y);
			ctx.stroke();
			
			// 要写刻度。。。 要根据我的 数据的 最大值要分割
			ctx.beginPath();
			ctx.font = '16px 微软雅黑';
			ctx.textAlign = 'right';
			var text = parseInt(maxData / 6 * (6 - i));
			ctx.fillText(text, pos.one.x - 10, pos.one.y + i * ydeep);
		}
		
		// 竖着画 x个 白色 实线
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 4;
		var xdeep = pos.width / 20;
		for (var i = 1; i <= 20; i++) {
			ctx.beginPath();
			ctx.moveTo(pos.one.x + i * xdeep, pos.one.y - 3);
			ctx.lineTo(pos.two.x + i * xdeep, pos.two.y - 3);
			ctx.stroke();
		}
	},
	// 获取数据最大值
	getDataMax: function() {
		var arr = [];
		var data = this.config.data;
		for (var i = 0; i < data.length; i++) {
			arr.push(data[i].money);
		}
		// 求数组里面最大值
		return Math.max.apply(null, arr);
	}
}


// function Obj1(name, age) {
//     this.name = name;
//     this.age = age;

//     this.show = function() {
//         console.log(this.name + this.age);
//     }
// }

// function Obj2() {
//     Obj1.call(this, 'zhangsan', 18);
// }

// var obj2 = new Obj2();
// console.log(obj2);