function GeneralControlWidget(O,mvcontext,main_window) {
	O=O||this;
	var P=MVAbstractControlWidget(O,mvcontext,main_window);
	O.div().addClass('GeneralControlWidget');
	O.setSize(0,200);

	var B=P.createButtonControl('test_button','test button',function() {
		mvcontext.setOption('clip_size',30);
	});
	O.div().append(B);
}