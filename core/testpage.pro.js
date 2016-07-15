var jsqmake=require('./jsqmake').jsqmake;

var opts={PROJECTPATH:__dirname, SOURCEPATH:['.'], SCRIPTS:[], STYLESHEETS:[]};
opts.TARGET = 'testpage.html';

opts.SCRIPTS.push(
	'jquery.min.js','jsq.js','jsqobject.js','jsqwidget.js','jsqpanelwidget.js','mda.js','remotereadmda.js'
);
opts.STYLESHEETS.push(
	'jsq.css','testpage.css'
);

opts.SCRIPTS.push(
	'testpagemain.js','mvabstractview.js','mvtemplateview.js'
);

jsqmake(opts);
