var jqmake=require('./jqmake').jqmake;

var opts={PROJECTPATH:__dirname, SOURCEPATH:['.'], SCRIPTS:[], STYLESHEETS:[]};
opts.TARGET = 'testpage.html';

opts.SCRIPTS.push(
	'jquery.min.js','jq.js','jqobject.js','jqwidget.js','jqpanelwidget.js','mda.js','remotereadmda.js'
);
opts.STYLESHEETS.push(
	'jq.css','testpage.css'
);

opts.SCRIPTS.push(
	'testpagemain.js','mvabstractview.js','mvtemplateview.js'
);

jqmake(opts);
