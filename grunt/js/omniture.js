/* eexp-global-v1.2
 * moving to H26 and forced link tracking - date 07/05/2013 - AJG
 *
 */
if (typeof toolkit==='undefined') toolkit={};
if (typeof toolkit.omniture==='undefined') toolkit.omniture={};
toolkit.omniture = (function(config, utils, h26,
                             mediaModule,
                             testAndTarget,
                             channelManager,
                             newOrRepeatVisits
    ){

    var pluginsLoaded = false,
        s_objectID = h26.s_objectID,
        s_gi = h26.s_gi,
        s = {};

    var sky = sky ? sky : {};
    sky.tracking = {
        settings: config.settings,
        trackedDataValues: config.trackedDataValues,
        variables: config.trackedData,
        loadVariables: {},
        loadEvents: [],
        events: config.trackedEvents,
        setup: function(options){
            // Initial defaults:
            var prod = [],
                i, j, k, x, name;

            for (var data in sky.tracking.trackedDataValues){
                if (sky.tracking.trackedDataValues[data]) {
                    sky.tracking.trackedDataValues[data] = sky.tracking.trackedDataValues[data].toLowerCase();
                }
            }

            options.siteName = 'sky/portal/' + options.site;
            options.pageName = options.siteName + "/" + options.page;
            options.eVar19 = options.site + "/" + options.page;

    //            set page Description
            if (options.headline) {
                options.eVar55 = (options.site + '/' + options.section+ '/' + options.headline).substring(0,255);
            } else{
                options.eVar55 = options.pageName.substring(0,255);
            }

            options.channel = options.siteName + '/' + options.section;
            //setting section 0,1,2 to the split section value or all the same if only one section
            for (i = 0; i < 3 ; ++i) {
                options['section' + i] = options.siteName + '/' +  options.section.split('/').slice(0,i+1).join('/');
            }

            if (options.searchResults !== undefined ) {
                options.loadEvents.push(sky.tracking.events['searchResults']);
                if (options.searchResults == 0) {
                    options.loadEvents.push(sky.tracking.events['zeroResults']);
                }
            }

            if (options.errors) {
                options.loadEvents.push(sky.tracking.events['error']);
            }


            // Overwrite defaults with passed parameters
            for (name in options) {
                sky.tracking.settings[name] = options[name];
            }
        },

        addVariable: function(prop, val){
            if(!val){ return; }
            var map, vars = {};
            if (sky.tracking.variables[prop].length==1){
                s[sky.tracking.variables[prop][0]] = val;
            } else {
                map = 'D=' + sky.tracking.variables[prop][1].replace('eVar','v').replace('prop','c');
                s[sky.tracking.variables[prop][0]] = map;
                s[sky.tracking.variables[prop][1]] = val;
            }
        },

        pageView:  function (options) {

            sky.tracking.setup(options);
            s = s_gi(sky.tracking.settings.account);

            var prod = [],
                i, j, k, x, name;

            for (name in options.loadVariables){
                sky.tracking.addVariable(name,options.loadVariables[name]);
            }

            this.loadPlugins(s);

            window.s_bskyb = this.s = s;


            //todo: move. only used in time_part function
            // Change below if EU law on DST start/end dates changes
            s.currentYear=new Date().getFullYear();
            var d = new Date ( s.currentYear , 2 , 31 );
            s.dstStart = "03/"+(31-d.getDay())+"/"+s.currentYear;
            d = new Date ( s.currentYear , 9 , 31 );
            s.dstEnd = "10/"+(31-d.getDay())+"/"+s.currentYear;

            //todo: move into login stuff function
            if (options.LoggedIn === undefined) {
                this.setLoginVars(options);
            }else{
                if (options.LoggedIn === false) {sky.tracking.settings.loginStatus = 'not logged-in';}
                if (options.LoggedIn === true) {sky.tracking.settings.loginStatus = 'logged-in';}
            }

            s.getAndPersistValue(document.location.toString().toLowerCase(),'omni_prev_URL',0);
            var c_pastEv = s.clickThruQuality(
                s.eVar47,
                sky.tracking.events['firstPageVisited'],
                sky.tracking.events['secondPageVisited'],
                's_ctq'
            );
            if(c_pastEv) { options.loadEvents.push(c_pastEv); }
            s.eVar17 = s.getFullReferringDomains();

            if (sky.tracking.settings.setObjectIDs) {
                s.setupDynamicObjectIDs();
            }
            var refURL=document.referrer;
            if (refURL){
                var iURL=refURL.indexOf('?')>-1?refURL.indexOf('?'):refURL.length;
                var qURL=refURL.indexOf('//')>-1?refURL.indexOf('//')+2:0;
                var rURL=refURL.indexOf('/',qURL)>-1?refURL.indexOf('/',qURL):iURL;
                sky.tracking.settings.refDomain=refURL.substring(qURL,rURL);
            }

            //if (prod.length) s.products = prod.join(',');
            if (options.loadEvents.length)   s.events = options.loadEvents.join(',');
            for (var variable in options.loadVariables){
                s[variable] = options.loadVariables[variable];
            }
            for (k in sky.tracking.settings) this.setVar ( s , k , sky.tracking.settings[k]);

            //URL length optimisation
            s.pageURL="D=Referer";
            if(s.prop12){    s.eVar31="D=c12";  }
            if(s.prop1){    s.eVar1="D=c1";  }
            if(s.prop16){    s.eVar3="D=c16";  }
            if(s.prop17){    s.eVar8="D=c17";  }
            if(s.prop3){    s.eVar13="D=c3";  }
            if(s.prop2){    s.eVar2="D=c2";  }
            if(s.prop5){    s.eVar5="D=c5";  }
            if(s.prop9){    s.eVar9="D=c9";  }
            if(s.prop36){    s.eVar36="D=c36";  }
            if(s.prop20){    s.eVar20="D=c20";  }
            if(s.prop21){    s.eVar15="D=c21";  }
            if(s.prop23){    s.eVar14="D=c23";  }
            if(s.prop25){    s.eVar26="D=c25";  }
            if(s.prop27){    s.eVar29="D=c27";  }
            if(s.prop31){    s.eVar30="D=c31";  }
            if(s.prop26){    s.eVar28="D=c26";  }
            if(s.channel){ s.eVar24=s.hier1="D=ch";  }
            if(s.prop35){    s.eVar35="D=c35";  }
            if(s.eVar69){s.prop69=s.eVar69;}
            if(s.eVar70){s.prop70 = "D=v70";}
            if(s.eVar55){s.prop55 = "D=v55";}
            if(sky.tracking.settings.track){
                s.t();
            }
        },


        MovieStartManual: function(m_Name,m_Length,m_Player) {
            var s = sky.tracking.s;
            s.Media.open(m_Name,m_Length,m_Player);
            s.Media.play(m_Name,'0');
        },


        MovieEndManual: function(m_Name,m_Pos) {
            var s = sky.tracking.s;
            s.Media.stop(m_Name,m_Pos);
            s.Media.close(m_Name);
        },


        loadCookies: function() {
            var cl = document.cookie.split(';');
            var o = {};
            for (var i=0 ; i<cl.length ; i++) {
                var c = cl[i].split('=');
                //|--- this trims whitespace --------------|
                o[c[0].replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1')] = unescape(c[1]);
            }
            return o;
        },
        setVar: function ( s , vname , val ) {
            var vl = this.variables[vname];
            vl = vl ? vl : [vname];
            for (var i = 0 ; i < vl.length ; ++i ){
                s[vl[i]] = val;
            }
        },


        setLoginVars: function ( options ) {
            var c = this.loadCookies();
            if (c.skySSO) {
                sky.tracking.settings.loginStatus = 'logged-in';
                if (c.skySSOLast != c.skySSO) {
                    this.s.c_w ('skySSOLast' , c.skySSO);
                    var fl = c.skyLoginFrom ? c.skyLoginFrom.split(',') : ['generic','l'];
                    options.loadEvents.push ( fl[1] == 'l' ? this.events.loginComplete : this.events.regComplete);
                    sky.tracking.settings._loginFrom = fl[0];
                }
            } else {
                sky.tracking.settings.loginStatus = 'not logged-in';
                //     document.cookie = 'skySSOLast=0; expires=Fri, 02-Jan-1970 00:00:00 GMT';
            }
            if(c.just){ sky.tracking.settings.samId = c.just;}
            if (c.apd) sky.tracking.settings.ageGender = c.apd + '|' + c.gpd;
            if(c.custype){ sky.tracking.settings.customerType = c.custype;}
            if (c.ust) sky.tracking.settings.optIn = c.ust + '|' + c.sid_tsaoptin;
        },


        featuredContentClickManual: function(place,description) {
            var s = sky.tracking.s;
            s.prop15 = String(place)+"|"+String(description) + "|" + s.pageName.replace("sky/portal/","");
            s.eVar7 = "D=c15";
            s.events = sky.tracking.events['linkClick'];
            s.linkTrackVars='prop39,eVar39,prop15,eVar7,events';
            s.linkTrackEvents=sky.tracking.events['linkClick'];
            s.tl(this,'o','Link Click',null,'navigate');
        },

        clickSamePage: function(place,description) {
            var s = sky.tracking.s;
            s.prop15 = String(place)+"|"+String(description) + "|" + s.pageName.replace("sky/portal/","");
            s.eVar7 = "D=c15";
            s.events = sky.tracking.events['linkClick'];
            s.linkTrackVars='prop39,eVar39,prop15,eVar7,events';
            s.linkTrackEvents=sky.tracking.events['linkClick'];
            s.tl(this,'o','Link Click');
        },


        loadPlugins: function(s) {
            if(pluginsLoaded){ return; }

            /*extra*/
            s.c_rr = s.c_r;
            s.c_r = new Function("k", "" + "var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;if(v)ret" + "urn v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;i=" + "c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';'" + ",i);m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length,m<0?c.length:" + "m));if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.get" + "Time()){d.setTime(d.getTime()-60000);s.c_w(s.epa(k),'',d);v='';}ret" + "urn v;");
            s.c_wr = s.c_w;
            s.c_w = new Function("k", "v", "e", "" + "var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv," + "c,i,t;d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s" + ".ape(k);pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1){pv=pv.substr" + "ing(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);i=sv" + ".indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.i" + "ndexOf(';',i)+1);sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime())" + "{pv+=' '+k+'='+s.ape(v)+'|'+e.getTime()+';';pc=1;}}else{sv+=' '+k+'" + "='+s.ape(v)+';';sc=1;}if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t" + ".indexOf(';')!=-1){var t1=parseInt(t.substring(t.indexOf('|')+1,t.i" + "ndexOf(';')));t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.set" + "Time(ht);s.c_wr(pn,pv,d);}return v==s.c_r(s.epa(k));");

            s.getValOnce = new Function("v","c","e","" + "var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("+")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");
            s.clickThruQuality=function(scp,ct_ev,cp_ev,cpc){
                var s = this,
                    ev, tct;
                if (s.p_fo(ct_ev) == 1) {
                    if (!cpc) {
                        cpc = 's_cpc';
                    }
                    ev = s.events ? s.events + ',' : '';
                    if (scp) {
                        s.c_w(cpc, 1, 0);
                        return ct_ev;
                    } else {
                        if (s.c_r(cpc) >= 1) {
                            s.c_w(cpc, 0, 0);
                            return cp_ev;
                        }
                    }
                }
            };
            s.p_fo=new Function("n","" +"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="+"new Object;return 1;}else {return 0;}");
            s.apl = new Function("L", "v", "d", "u", "var s=this,m=0;if(!L)L='';if(u){var i,n,a=s.split(L,d);for(i=0;i<a.length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCase()));}}if(!m)L=L?L+d+v:v;return L");




            /*
             * Plugin: getQueryParam 2.3
             */
            s.getQueryParam=new Function("p","d","u",""+
                "var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"+
                "on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"+
                ".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"+
                "1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="+
                "=p.length?i:i+1)}return v");



            s.p_gpv=new Function("k","u",""+
                "var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=decodeURIComponent"+
                "(u.substring(i+1));v=s.pt(q,'&','p_gvf',k)}return v");




            s.p_gvf=new Function("t","k",""+
                "if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"+
                "rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."+
                "epa(v)}return ''");



            /* DynamicObjectIDs config */
            s.getObjectID = function (o) {
                var ID=o.href;
                return ID;
            }


// DEALS WITH DUPLICATE NAMES ON A SINGLE PAGE
            /*
             * DynamicObjectIDs v1.4: Setup Dynamic Object IDs based on URL
             */
            s.setupDynamicObjectIDs=new Function(""+
                "var s=this;if(!s.doi){s.doi=1;if(s.apv>3&&(!s.isie||!s.ismac||s.apv"+
                ">=5)){if(s.wd.attachEvent)s.wd.attachEvent('onload',s.setOIDs);else"+
                " if(s.wd.addEventListener)s.wd.addEventListener('load',s.setOIDs,fa"+
                "lse);else{s.doiol=s.wd.onload;s.wd.onload=s.setOIDs}}s.wd.s_semapho"+
                "re=1}");



            s.setOIDs=new Function("e",""+
                "var s=s_c_il["+s._in+"],b=s.eh(s.wd,'onload'),o='onclick',x,l,u,c,i"+
                ",a=new Array;if(s.doiol){if(b)s[b]=s.wd[b];s.doiol(e)}if(s.d.links)"+
                "{for(i=0;i<s.d.links.length;i++){l=s.d.links[i];c=l[o]?''+l[o]:'';b"+
                "=s.eh(l,o);z=l[b]?''+l[b]:'';u=s.getObjectID(l);if(u&&c.indexOf('s_"+
                "objectID')<0&&z.indexOf('s_objectID')<0){u=s.repl(u,'\"','');u=s.re"+
                "pl(u,'\\n','').substring(0,97);l.s_oc=l[o];a[u]=a[u]?a[u]+1:1;x='';"+
                "if(c.indexOf('.t(')>=0||c.indexOf('.tl(')>=0||c.indexOf('s_gs(')>=0"+
                ")x='var x=\".tl(\";';x+='s_objectID=\"'+u+'_'+a[u]+'\";return this."+
                "s_oc?this.s_oc(e):true';if(s.isns&&s.apv>=5)l.setAttribute(o,x);l[o"+
                "]=new Function('e',x)}}}s.wd.s_semaphore=0;return true");

//*/



            s.getAndPersistValue=new Function("v","c","e",""+
                "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("+
                "v)s.c_w(c,v,e?a:0);return s.c_r(c);");




            s.getFullReferringDomains=new Function(""+
                "var s=this,dr=window.document.referrer,n=s.linkInternalFilters.spli"+
                "t(',');if(dr){var r=dr.split('/')[2],l=n.length;for(i=0;i<=l;i++){i"+
                "f(r.indexOf(n[i])!=-1){r='';i=l+1;}}return r}");




            /*
             * Plugin Utility: Replace v1.0
             */
            s.repl=new Function("x","o","n",""
                +"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
                +"substring(i+o.length);i=x.indexOf(o,i+l)}return x");


            /*
             * Utility Function: split v1.5 (JS 1.0 compatible)
             */
            s.split=new Function("l","d",""
                +"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
                +"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");




            channelManager.load(s, sky.tracking);
            testAndTarget.load(s);
            mediaModule.load(s);
            newOrRepeatVisits.load(s, sky.tracking);

            pluginsLoaded = true;
        },
       reset: function(){
           if (!this.s){ return; }
           this.s.linkTrackVars = '';
           this.s.events = '';
           this.s.linkTrackEvents = '';
        },
        utils: utils
    };


    return sky.tracking;

}(toolkit.omniture.config,
    toolkit.omniture.utils,
    toolkit.omniture.h26,
    toolkit.omniture.plugins.mediaModule,
    toolkit.omniture.plugins.testAndTarget,
    toolkit.omniture.plugins.channelManager,
    toolkit.omniture.plugins.newOrRepeatVisits
));

//just for require
if (typeof window.define === "function" && window.define.amd) {
    define("omniture", [
        'omniture/config',
        'omniture/utils',
        'omniture/omniture-h26',
        'plugins/media-module',
        'plugins/test-and-target',
        'plugins/channel-manager',
        'plugins/new-or-repeat-visits'
    ], function(config, utils, mediaModule, testAndTarget, channelManager, newOrRepeatVisits) {
        return toolkit.omniture;
    });
}
