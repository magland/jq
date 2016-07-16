function GeneralControlWidget(O,mvcontext,main_window) {
	O=O||this;
	var P=MVAbstractControlWidget(O,mvcontext,main_window);
	O.div().addClass('GeneralControlWidget');
	O.setSize(0,200);

	O.updateControls=function() { //override
		P.setControlValue('clip_size',mvcontext.option('clip_size'));
		P.setControlValue('cc_max_dt',mvcontext.option('cc_max_dt'));
	};

	var table0=$('<table></table>');
	O.div().append(table0);
	{ //clip_size
		var X=P.createIntControl('clip_size');
		var tr=$('<tr><td>Clip size:</td><td id=tmp></td></tr>');
		tr.find('#tmp').append(X); table0.append(tr);
	}
	{ //cc_max_dt
		var X=P.createIntControl('cc_max_dt');
		var tr=$('<tr><td>CC max. dt (msec):</td><td id=tmp></td></tr>');
		tr.find('#tmp').append(X); table0.append(tr);
	}
	{ //Apply button
		var X=P.createButtonControl('apply','Apply',function() {
			mvcontext.setOption('clip_size',P.controlValue('clip_size'));
			mvcontext.setOption('cc_max_dt',P.controlValue('cc_max_dt'));
		});
		var tr=$('<tr><td></td><td id=tmp></td></tr>');
		tr.find('#tmp').append(X); table0.append(tr);
	}
	P.updateControlsOn(mvcontext,'optionsChanged');
}