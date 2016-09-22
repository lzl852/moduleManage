!function(){"use strict";function isType(e){return function(o){return{}.toString.call(o)==="[object "+e+"]"}}var queue,reLineComments,reBlockComments,reRequire,moduleInTypeMap,moduleOutTypeMap,moduleInTypeMatches,getOutType,parseRequire,parseRequires,MODULE_STATE_LOADING,MODULE_STATE_LOADED,MODULE_STATE_EXECUTED,modulesCacheMap,moduleGid,nodeModulesNameMap,Module,moduleWrap,injectWindowDefine,loadModule,useModule,coolieAMDMode,coolieConfigs,coolieCallbacks,coolieCallbackArgs,coolieChunkMap,coolieNodeModuleMainPath,coolie,coolieMainPath,coolieMainModulesDir,coolieChunkModulesDir,coolieChunkModulesMap,coolieAsyncModulesDir,coolieAsyncModulesMap,coolieNodeModulesDir,VERSION="2.0.21",COOLIE="coolie",NODE_MODULES="node_modules",JS="js",INDEX_JS="index."+JS,MODULE_SPLIT="->",DEPENDENT_STR=" 依赖的 ",LOAD_ERROR_STR=" 资源加载失败",win=window,doc=win.document,headEl=doc.head||doc.getElementsByTagName("head")[0]||doc.documentElement,noop=function(){},isArray=isType("Array"),isFunction=isType("Function"),each=function(e,o,t){var n,i;if(isArray(e))for(n=t?e.length-1:0,i=t?0:e.length;(t?n>i:n<i)&&o(n,e[n])!==!1;t?n--:n++);else if("object"===typeof e)for(n in e)o(n,e[n])},once=function(e){var o=!1;return function(){if(!o){o=!0;e.apply(this,arguments)}}},ajaxText=function(e,o){var t=new XMLHttpRequest,n=once(function(){var e=null,n=t.responseText;200!==t.status&&304!==t.status&&(e=!0);t.onload=t.onreadystatechange=t.onerror=t.onabort=t.ontimeout=null;t=null;o(e,n)});t.onreadystatechange=function(){4===t.readyState&&n()};t.onload=t.onerror=t.onabort=t.ontimeout=n;t.open("GET",e);t.send(null)},evalJSON=function(e){try{return new Function("","return "+e)()}catch(e){return null}},ajaxJSON=function(e,o,t){ajaxText(o,function(n,i){if(n)throw new URIError((e?e.url+DEPENDENT_STR:"")+"JSON "+LOAD_ERROR_STR+"\n"+o);var a=evalJSON(i);if(!a)throw new URIError((e?e.url+DEPENDENT_STR:"")+"JSON 资源解析失败\n"+o);t(a)})},nextTick=function(e){setTimeout(function(){e()},1)},importStyle=function(){var e,o=doc.createElement("style");o.setAttribute("type","text/css");o.setAttribute("id",COOLIE+"-"+VERSION+"-style");headEl.appendChild(o);e=o.styleSheet;return function(t){e?e.cssText+=t:o.innerHTML+=t;return o}}(),loadScript=function(e,o){var t=doc.createElement("script"),n=function(e){t.onload=t.onerror=t.onreadystatechange=null;headEl.removeChild(t);t=null;o(e)};if("onload"in t){t.onload=n;t.onerror=function(){n(!0)}}else t.onreadystatechange=function(){/loaded|complete/.test(t.readyState)&&n()};t.async=!0;t.src=e;headEl.appendChild(t);return t},getAttributeDataSet=function(e,o){return e.getAttribute("data-"+o)},getScriptAbsoluteSrc=function(e){return e.hasAttribute?e.src:e.getAttribute("src",4)},getCoolieScript=function(){var e=doc.scripts;return e[e.length-1]},reExtname=/\.[^.]+$/,reStaticPath=/^(.*:)?\/\//,reAbsolutePath=/^\//,reRelativePath=/^\.{1,2}\//,reProtocol=/^.*:/,LOCATION_HREF=location.href,LOCATION_PROTOCOL=location.protocol,LOCATION_BASE=LOCATION_PROTOCOL+"//"+location.host,reThisPath=/\/\.\//g,reEndThisPath=/\/\.$/g,reNotURISlash=/\\/g,reStartWidthSlash=/^\//,reEndWidthSlash=/\/$/,rePathBase=/^~\//,rePathQuerystringHashstring=/[?#].*$/,reIgnoreProtocol=/^(about|blob):/,rePathSep=/\//,reURLBase=/^(.*):\/\/[^\/]*/,getPathProtocol=function(e){var o,t=e.match(reStaticPath);if(!t)return"";o=t[0];return reProtocol.test(o)?o:LOCATION_PROTOCOL+o},getURLBase=function(e){var o=e.match(reURLBase);return o?o[0]:""},normalizePath=function(e){var o,t,n,i,a,r,l,u;if(!e)return"";rePathBase.test(e)&&(e=LOCATION_BASE+e.slice(1));o=getPathProtocol(e);e=e.replace(rePathQuerystringHashstring,"").replace(reStaticPath,"").replace(reNotURISlash,"/").replace(reThisPath,"/").replace(reEndThisPath,"/");t=e.split(rePathSep);n="";i=[];a="..";r="/";l=reStartWidthSlash.test(e);u=reEndWidthSlash.test(e);each(t,function(e,o){o===a&&n&&n!==a?i.pop():i.push(o);e&&(n=i[i.length-1])});e=i.join(r);l&&!reStartWidthSlash.test(e)&&(e=r+e);u&&!reEndWidthSlash.test(e)&&(e+=r);return o+e},isStaticPath=function(e){return reStaticPath.test(e)},isAbsolutePath=function(e){return!isStaticPath(e)&&reAbsolutePath.test(e)},isRelativePath=function(e){return reRelativePath.test(e)},getPathDirname=function(e){if(!rePathSep.test(e))return e+"/";e+=reEndWidthSlash.test(e)?"":"/../";return normalizePath(e)},ensurePathDirname=function(e){return e+(reEndWidthSlash.test(e)?"":"/")},getPathExtname=function(e){return(e.toLowerCase().match(reExtname)||[""])[0]},resolvePath=function(e,o){e=normalizePath(e);o=normalizePath(o);if(!o)return e;if(isStaticPath(o))return o;if(isAbsolutePath(o))return getURLBase(e)+o;var t=getPathDirname(e);return normalizePath(t+o)},fixFilepathExtname=function(e){e=normalizePath(e);if(!e)return e;var o=getPathExtname(e);return e+(o==="."+JS?"":"."+JS)},fixFilePath=function(e,o){o&&(e=fixFilepathExtname(e));return e},resolveModulePath=function(e,o,t){return fixFilePath(resolvePath(e,o),t)},getCWDPath=function(){return reIgnoreProtocol.test(LOCATION_HREF)?"":getPathDirname(LOCATION_HREF)},cwd=getCWDPath(),coolieScriptEl=getCoolieScript(),cooliePath=getScriptAbsoluteSrc(coolieScriptEl)||cwd,coolieDirname=getPathDirname(cooliePath),coolieAttributeConfigName=getAttributeDataSet(coolieScriptEl,"config"),coolieAttributeMainName=getAttributeDataSet(coolieScriptEl,"main"),coolieConfigPath=coolieAttributeConfigName?resolvePath(coolieDirname,coolieAttributeConfigName):null,coolieConfigDirname=coolieConfigPath?getPathDirname(coolieConfigPath):coolieDirname,Queue=function(){var e=this;e.d=!1;e.list=[]};Queue.prototype={constructor:Queue,task:function(e,o){var t=this;o.id=e;t.list.push(o);t.start()},start:function(){var e,o=this;if(o.d)return o;e=o.list.shift();if(e){o.d=!0;o.last=e;e(function(){o.d=!1;o.start()})}else o.d=!1}};queue=new Queue;reLineComments=/^\s*\/\/.*$/gm;reBlockComments=/\/\*[\s\S]*?\*\//gm;reRequire=/(?:[^.\[]|)\brequire\((['"])([^'"]*)\1(\s*,\s*(['"])([^'"]*)\4)?/g;moduleInTypeMap={js:"js",image:"file",file:"file",text:"text",html:"text",json:"json",css:"css"};moduleOutTypeMap={js:{js:1,d:"js"},file:{url:1,base64:1,d:"url"},text:{text:1,url:2,base64:2,d:"text"},css:{text:1,url:2,base64:2,style:3,d:"text"},json:{js:1,text:2,url:3,base64:3,d:"js"}};moduleInTypeMatches=[[JS,/^js$/],["html",/^html$/],["css",/^css$/],["json",/^json$/],["text",/^txt$/]];getOutType=function(e,o){var t=moduleOutTypeMap[e],n=t[o];return n?o:t.d};parseRequire=function(e,o){var t,n,i=JS,a=getPathExtname(e).slice(1);if(isRelativePath(e)&&a&&!o){each(moduleInTypeMatches,function(e,o){var t=o[0],n=o[1];if(n.test(a)){i=t;return!1}});i=i||"file"}o=(o?o.toLowerCase():i).split("|");t=o[0];n=o[1];t=moduleInTypeMap[t];if(!t)throw new TypeError("不支持的模块类型："+t);n=getOutType(t,n);return[e,t,n]};parseRequires=function(e){var o=[];e.replace(reBlockComments,"").replace(reLineComments,"").replace(reRequire,function(e,t,n,i,a,r){o.push(parseRequire(n,r))});return o};MODULE_STATE_LOADING=0;MODULE_STATE_LOADED=1;MODULE_STATE_EXECUTED=2;modulesCacheMap={};moduleGid=0;nodeModulesNameMap={};Module=function(e,o,t,n,i){var a=this;a.parent=e;a.id=o;a.gid=moduleGid++;a.inType=t;a.outType=n;a.state=MODULE_STATE_LOADING;a.pkg=i;a.dependencies=[];a.resolvedMap={};a.callbacks=[]};Module.prototype={constructor:Module,save:function(e,o,t){var n=this,i=function(e,o){var t,i,a=resolvePath(coolieNodeModulesDir,e+"/");if(coolieNodeModuleMainPath){t=resolveModulePath(a,coolieNodeModuleMainPath,!0);o(t)}else if(nodeModulesNameMap[e])o.apply(win,nodeModulesNameMap[e]);else{i=resolveModulePath(coolieNodeModulesDir,e+"/package.json",!1);ajaxJSON(n.parent,i,function(e){t=resolveModulePath(i,e.main||INDEX_JS,!0);o(t,e,i)})}};n.build(o,t);each(e,function(e,o){var t,a=o.name,r=o.inType,l=o.outType,u=isRelativePath(a)||isAbsolutePath(a),c=a;if(u){c=n.resolve(a,r===JS);t=loadModule(n,c,r,l);n.dependencies[e]=t.id}else i(a,function(o,i,u){t=loadModule(n,o,r,l,i);t.pkgURL=u;n.resolvedMap[a]=o;nodeModulesNameMap[n.dependencies[e]]=arguments;n.dependencies[e]=t.id})});n.exec()},build:function(e,o){var t=this;t.dependencies=e;t.state=MODULE_STATE_LOADED;t.factory=o;t.expose=function(){var e,o,n;if(t.state===MODULE_STATE_EXECUTED)return t.exports;t.state=MODULE_STATE_EXECUTED;e=t.factory;o=t.factory;isFunction(e)||(o=function(){return e});n=o.call(win,t.require,t.exports,t);void 0!==n&&(t.exports=n);return t.exports};t.require=function(e,o){var n,i,a,r;if(coolieAMDMode)return modulesCacheMap[e].expose();n=parseRequire(e,o);i=n[1];a=n[2];r=t.resolve(e,"js"===i)+MODULE_SPLIT+a;return modulesCacheMap[r].expose()};t.require.resolve=t.resolve;t.require.async=function(e,o){var n,i,a;e=isArray(e)?e:[e];o=isFunction(o)?o:noop;n=e.length;i=[];a=function(e){i.push(e);n===i.length&&o.apply(win,i)};nextTick(function(){each(e,function(e,o){coolieAMDMode&&(o=o+"."+coolieAsyncModulesMap[o]+"."+JS);var n=coolieAMDMode?resolveModulePath(coolieAsyncModulesDir,o,!0):resolveModulePath(t.url,o,!0);useModule(null,n,JS,JS,t.pkg,a)})})};t.exports={}},resolve:function(e,o){var t=this,n=t.resolvedMap[e];return n?n:resolveModulePath(t.id,e,o)},exec:function(){var e,o,t,n=this,i=n.main;if(i){e=!0;o={};t=function(n){each(n.dependencies,function(n,i){var a=modulesCacheMap[i];if(!a||a.state<MODULE_STATE_LOADED){e=!1;return!1}if(!o[a.id]){o[a.id]=!0;t(a)}})};t(i);if(e){i.expose();nextTick(function(){each(i.callbacks,function(e,o){o(i.exports)})})}}}};moduleWrap=function(e,o,t,n){var i=t.join('","');i&&(i='"'+i+'"');return['define("'+o+'", ['+i+"], function(require, exports, module) {",n,"\n\n});","//# sourceURL="+e].join("")};injectWindowDefine=function(){if(!(win.define&&win.define.coolie||!coolieAMDMode)){var e=win.define=function(e,o,t){var n,i,a=modulesCacheMap[e];if("0"===e){e=queue.last.id;a=modulesCacheMap[e];a.main=a}n=modulesCacheMap[e]=a||new Module(null,e);if(n.state===MODULE_STATE_EXECUTED){n.exec();return n}i=n.parent;if(i){n.url=i.url;n.main=n.main||i.main}each(o,function(e,o){var t=modulesCacheMap[o]=modulesCacheMap[o]||new Module(n,o);t.url=n.url;t.main=n.main});n.build(o,t);n.exec();return n};e.coolie=e.amd=e.cmd=e.umd=coolie}};loadModule=function(parent,url,inType,outType,pkg,callback){var module,dependencyMetaList,dependencyNameList,define,moduleInType,moduleOutType,id=url+MODULE_SPLIT+outType,cacheModule=modulesCacheMap[id];if(cacheModule)return cacheModule;module=modulesCacheMap[id]=new Module(parent,id,inType,outType,pkg);module.url=url;if(parent)module.main=module.main||parent.main;else{module.main=module;isFunction(callback)&&module.callbacks.push(callback)}dependencyMetaList=[];dependencyNameList=[];define=function(e,o,t){var n,i=arguments,a=i.length;switch(a){case 0:throw new SyntaxError("模块书写语法不正确\n"+e);case 3:module.state!==MODULE_STATE_EXECUTED&&module.save(dependencyMetaList,o,t);break;default:if(module.state===MODULE_STATE_EXECUTED){n=i[a-1](module.require,module.exports,module);void 0!==n&&(module.exports=n)}}};moduleInType=module.inType;moduleOutType=module.outType;define.coolie=define.amd=define.cmd=define.umd=coolie;switch(moduleInType){case"js":ajaxText(url,function(err,code){var requires,moduleCode;if(err)throw new URIError((module.parent?module.parent.url+DEPENDENT_STR:"")+"JS"+LOAD_ERROR_STR+"\n"+url);requires=parseRequires(code);each(requires,function(e,o){var t=o[0],n=o[1],i=o[2];dependencyMetaList.push({name:t,inType:n,outType:i});dependencyNameList.push(t)});moduleCode=moduleWrap(url,id,dependencyNameList,code);eval(moduleCode)});break;case"css":case"text":case"json":switch(moduleOutType){case"url":case"base64":define(id,[],function(){return url});break;case"js":ajaxText(url,function(e,o){if(e)throw new URIError((module.parent?module.parent.url+DEPENDENT_STR:"")+moduleInType+LOAD_ERROR_STR+"\n"+url);define(id,[],function(){return evalJSON(o)})});break;case"style":ajaxText(url,function(e,o){if(e)throw new URIError((module.parent?module.parent.url+DEPENDENT_STR:"")+moduleInType+LOAD_ERROR_STR+"\n"+url);define(id,[],function(){return importStyle(o)})});break;default:ajaxText(url,function(e,o){if(e)throw new URIError((module.parent?module.parent.url+DEPENDENT_STR:"")+moduleInType+LOAD_ERROR_STR+"\n"+url);define(id,[],function(){return o})})}break;case"file":define(id,[],function(){return url})}return module};useModule=function(e,o,t,n,i,a){var r=o+(coolieAMDMode?"":MODULE_SPLIT+n),l=modulesCacheMap[r];if(l)return l.state===MODULE_STATE_EXECUTED?a(l.exports):l.callbacks.push(a);if(coolieAMDMode){l=modulesCacheMap[r]=new Module(e,r,t,n,i);l.url=o;l.callbacks.push(a);queue.task(o,function(e){loadScript(o,e)})}else loadModule(e,o,t,n,i,a)};coolieAMDMode=!1;coolieConfigs={};coolieCallbacks=[];coolieCallbackArgs=null;coolieChunkMap={};coolieNodeModuleMainPath=null;coolie=win.coolie={version:VERSION,url:cooliePath,configURL:coolieConfigPath,importStyle:importStyle,dirname:coolieDirname,configs:coolieConfigs,modules:modulesCacheMap,callbacks:coolieCallbacks,resolvePath:resolvePath,config:function(e){if(coolieConfigs.mode)return coolie;e=e||{};coolieConfigs.mode=e.mode||"CJS";coolieAMDMode="AMD"===coolieConfigs.mode;coolieConfigs.mainModulesDir=coolieMainModulesDir=ensurePathDirname(resolvePath(coolieConfigDirname,e.mainModulesDir||"."));coolieConfigs.nodeModulesDir=coolieNodeModulesDir=ensurePathDirname(resolvePath(coolieMainModulesDir,e.nodeModulesDir||"/"+NODE_MODULES+"/"));coolieConfigs.chunkModulesDir=coolieChunkModulesDir=ensurePathDirname(resolvePath(coolieMainModulesDir,e.chunkModulesDir||"."));coolieConfigs.chunkModulesMap=coolieChunkModulesMap=e.chunkModulesMap||{};coolieConfigs.asyncModulesDir=coolieAsyncModulesDir=ensurePathDirname(resolvePath(coolieMainModulesDir,e.asyncModulesDir||"."));coolieConfigs.asyncModulesMap=coolieAsyncModulesMap=e.asyncModulesMap||{};coolieConfigs.dirname=coolieDirname;coolieConfigs.configDirname=coolieConfigDirname;e.global=e.global||{};e.global.DEBUG=coolieConfigs.debug=e.debug!==!1;coolieNodeModuleMainPath=coolieConfigs.nodeModuleMainPath=e.nodeModuleMainPath;each(e.global,function(e,o){win[e]=o});return coolie},use:function(e,o){var t,n,i;o=isFunction(o)?o:noop;injectWindowDefine();t=0;n=[];i=function(e){n.push(e);if(n.length===t){coolieCallbackArgs=coolieCallbackArgs||n;o.apply(win,n);each(coolieCallbacks,function(e,o){o.apply(win,n)})}};if(!e&&coolieAttributeMainName){coolieMainPath=resolvePath(coolieMainModulesDir,coolieAttributeMainName);useModule(null,coolieMainPath,JS,JS,null,i);t=1;return coolie}if(!e)return coolie;e=isArray(e)?e:[e];t=e.length;each(e,function(e,o){var t=resolveModulePath(coolieMainModulesDir,o,!0);nextTick(function(){useModule(null,t,JS,JS,null,i)})});return coolie},callback:function(e){if(!isFunction(e))return coolie;coolieCallbackArgs?e.apply(win,coolieCallbackArgs):coolieCallbacks.push(e);return coolie},chunk:function(e){e=isArray(e)?e:[e];each(e,function(e,o){var t,n;if(!coolieChunkMap[o]){coolieChunkMap[o]=!0;t=o+"."+coolieChunkModulesMap[o]+"."+JS;n=resolvePath(coolieChunkModulesDir,t);loadScript(n,noop)}});return coolie}};coolieMainPath="";coolieMainModulesDir=coolieDirname;coolieChunkModulesDir=coolieDirname;coolieChunkModulesMap={};coolieAsyncModulesDir=coolieDirname;coolieAsyncModulesMap={};coolieNodeModulesDir=resolvePath(coolieDirname,"/"+NODE_MODULES+"/");coolieConfigPath&&loadScript(coolieConfigPath,noop)}();