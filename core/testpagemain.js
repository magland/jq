function jsqmain(query) {
	var context={};
    var X=new MVTemplateView(0,context);
    X.showFullBrowser();

    var B=new RemoteReadMda();
    var url='http://datalaboratory.org:8020/mdaserver/franklab/results/20160426_r1_nt16/ms_20160605/firings_new.mda';
    B.setPath(url,function(res) {
    	console.log(res);
    	console.log(B.N1()+'x'+B.N2()+'x'+B.N3());
    	B.readChunk(0,20,function(res) {
            console.log(res);
    		var chunk=res.chunk;
            console.log(chunk.N1()+'x'+chunk.N2()+'x'+chunk.N3());
    		console.log(chunk.data());
    	});
    });
}