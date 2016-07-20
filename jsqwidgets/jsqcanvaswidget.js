function JSQCanvasWidget(O) {
	O=O||this;
	JSQWidget(O);

	O.update=function() {private_signals.emit('paint');};

	//protected methods
	var private_signals=new JSQObject();
	O.onPaint=function(handler) {paint(handler);};

	JSQ.connect(O,'sizeChanged',O,update_canvas_size);

	var m_canvas=$(document.createElement('canvas'));
	O.div().append(m_canvas);
	m_canvas.css('position','absolute');
	var m_painter=new JSQCanvasPainter(m_canvas);

	function update_canvas_size() {
		var ss=O.size();
		m_canvas[0].width=ss[0];
		m_canvas[0].height=ss[1];
		m_canvas.css({
			width:ss[0],
			height:ss[1]
		});
		O.update();
	}

	function paint(handler) {
		JSQ.connect(private_signals,'paint',O,function(sender,args) {
			m_painter._initialize(O.size()[0],O.size()[1]);
			handler(m_painter);
			m_painter._finalize();
		},'queued');
	}
}

function JSQCanvasPainter(canvas) {
	var that=this;
	var ctx=canvas[0].getContext('2d');

	this.pen=function() {return JSQ.clone(m_pen);};
	this.setPen=function(pen) {setPen(pen);};

	this._initialize=function(W,H) {
		//ctx.fillStyle='black';
		//ctx.fillRect(0,0,W,H);
	};
	this._finalize=function() {
	};
	this.fillRect=function(x,y,W,H,brush) {
		if (typeof brush === 'string') brush={color:brush};
		if (!('color' in brush)) brush={color:brush};
		ctx.fillStyle=to_color(brush.color);
		ctx.fillRect(x,y,W,H);
	};
	this.drawRect=function(x,y,W,H) {
		ctx.strokeRect(x,y,W,H);
	};
	this.drawPath=function(painter_path) {
		painter_path._draw(ctx);
	};
	this.drawLine=function(x1,y1,x2,y2) {
		var ppath=new JSQPainterPath();
		ppath.moveTo(x1,y1);
		ppath.lineTo(x2,y2);
		that.drawPath(ppath);
	};

	function setPen(pen) {
		m_pen=JSQ.clone(pen);
		ctx.strokeStyle=to_color(m_pen.color);
	}

	function to_color(col) {
		if (typeof col === 'string') return col;
		return 'rgb('+Math.floor(col[0])+','+Math.floor(col[1])+','+Math.floor(col[2])+')';
	}

	var m_pen={color:'black'};
}

function JSQPainterPath() {
	this.moveTo=function(x,y) {moveTo(x,y);};
	this.lineTo=function(x,y) {lineTo(x,y);};

	this._draw=function(ctx) {
		ctx.beginPath();
		for (var i=0; i<m_actions.length; i++) {
			apply_action(ctx,m_actions[i]);
		}
		ctx.stroke();
	}
	var m_actions=[];

	function moveTo(x,y) {
		if (y===undefined) {moveTo(x[0],x[1]); return;}
		m_actions.push({
			name:'moveTo',
			x:x,y:y
		});
	}
	function lineTo(x,y) {
		if (y===undefined) {lineTo(x[0],x[1]); return;}
		m_actions.push({
			name:'lineTo',
			x:x,y:y
		});
	}

	function apply_action(ctx,a) {
		if (a.name=='moveTo') {
			ctx.moveTo(a.x,a.y);
		}
		else if (a.name=='lineTo') {
			ctx.lineTo(a.x,a.y);
		}
	}
}
