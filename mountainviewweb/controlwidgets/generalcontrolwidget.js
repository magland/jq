function GeneralControlWidget(O,mvcontext,main_window) {
	O=O||this;
	var P=MVAbstractControlWidget(O,mvcontext,main_window);
	O.div().addClass('GeneralControlWidget');
	O.setSize(0,200);

	var table0=$('<table><tr>Clip size:</tr></table>');
	O.div().append(table0);
	{
		var X=P.createIntControl('clip_size');
		var tr=$('<tr></tr>'); tr.append(X);
		O.div().append(tr);
	}
	{
		var X=P.createButtonControl('apply','Apply',function() {
			mvcontext.setOption('clip_size',P.controlValue('clip_size'));
		});
		var tr=$('<tr></tr>'); tr.append(X);
		O.div().append(tr);
	}
	JSQ.connect(mvcontext,'optionsChanged',O,update_controls);
	function update_controls() {
		P.setControlValue('clip_size',mvcontext.option('clip_size'));
	}
	update_controls();
}