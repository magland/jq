function jsqmain(query) {
	var context={};

    var timeseries_url='http://datalaboratory.org:8020/mdaserver/franklab/results/20160426_r1_nt16/ms_20160605/pre2.mda';
    var firings_url='http://datalaboratory.org:8020/mdaserver/franklab/results/20160426_r1_nt16/ms_20160605/firings_new.mda';
    var mlproxy_url='http://datalaboratory.org:8020';

    var mvcontext=new MVContext();
    mvcontext.setTimeseries(new RemoteReadMda(timeseries_url));
    mvcontext.setFirings(new RemoteReadMda(firings_url));
    mvcontext.setMLProxyUrl(mlproxy_url);
    mvcontext.setOption('clip_size',150);

    var WW=new MVMainWindow(0,mvcontext);
    WW.showFullBrowser();

    //var VV=new MVTemplatesView(0,mvcontext);
    //WW.setView(VV);

    var VV=new MVAmpHistView(0,mvcontext);
    WW.setView(VV);

    var GCW=new GeneralControlWidget(0,mvcontext,WW);
    WW.addControlWidget(GCW);

    //var firings_url='http://localhost:8020/mdaserver/franklab/2016_04_08/sort_dl12_20151208_NNF_r1_tet16_17/output_tet16/firings.mda';

    /*
    var B=new RemoteReadMda();
    
    B.setPath(firings_url,function(res) {
    	B.readChunk(0,20,function(res) {
    		var chunk=res.chunk;
    	});
    });
    */


    /*
    {
        var X=new MountainProcessRunner();
        X.setProcessorName("mv_compute_templates");

        var params={};
        params["timeseries"] = timeseries_url;
        params["firings"] = firings_url;
        params["clip_size"] = 100;
        X.setInputParameters(params);
        X.setMLProxyUrl(mlproxy_url);

        var templates_fname = X.makeOutputFileUrl("templates");
        var stdevs_fname = X.makeOutputFileUrl("stdevs");

        X.runProcess(function(res) {
            var templates=new RemoteReadMda();
            templates.setPath(templates_fname);
            templates.toMda(function(res) {
                var templates0=res.mda;
                WW.setTemplates(templates0);
            });

            //templates_out.setPath(templates_fname);
            //stdevs_out.setPath(stdevs_fname);

            //templates_out.setRemoteDataType("float32_q8");
            //stdevs_out.setRemoteDataType("float32_q8");
        });
    }
    */




}