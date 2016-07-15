function jsqmain(query) {
	var context={};
    var X=new MVTemplateView(0,context);
    X.showFullBrowser();

    /*
    var A=new Mda();
    var url='http://datalaboratory.org:8020/mdaserver/tmp_short_term/ce42c74996b2b729736b49c32d690a4c97132ff0.float32.0.13104.mda';
    A.load(url,function(res) {
    	console.log(res);
    	console.log(A.N1()+' '+A.N2()+' '+A.N3()+' '+A.N4()+' '+A.N5());
    	console.log(A.value(0),A.value(1),A.value(2));
    });

    var B=new RemoteReadMda();
    var url='http://datalaboratory.org:8020/mdaserver/franklab/results/20160426_r1_nt16/ms_20160605/firings_new.mda';
    B.setPath(url,function(res) {
    	console.log(res);
    	console.log(B.N1()+'x'+B.N2()+'x'+B.N3());
    	B.readChunk(0,20,function(res) {
    		var chunk=res.chunk;
    		console.log(chunk.value(0));
    	});
    });
    */
}