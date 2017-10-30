/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "9c943b6be96cfce3371d"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(17)(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(358);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(616);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = vendor_7ec43296b572b47d5ba5;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _goodsList = __webpack_require__(27);

var goodsList = _interopRequireWildcard(_goodsList);

var _categoriesList = __webpack_require__(28);

var categoriesList = _interopRequireWildcard(_categoriesList);

var _ordersList = __webpack_require__(29);

var ordersList = _interopRequireWildcard(_ordersList);

var _activeList = __webpack_require__(30);

var activeList = _interopRequireWildcard(_activeList);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports.goodsList = goodsList;
module.exports.categoriesList = categoriesList;
module.exports.ordersList = ordersList;
module.exports.activeList = activeList;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _common = __webpack_require__(6);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var token = localStorage.getItem('token') || '';

if (!token) {
  window.location.hash = '/login';
} else {
  if (window.location.hash === '#/login') {
    window.location.hash = '/main/goodsList';
  }
}

module.exports.request = function (url, option, data) {
  var token = localStorage.getItem('token') || '';
  var queryString = '';
  if (data) {
    Object.keys(data).forEach(function (value) {
      queryString += '&' + value + '=' + data[value];
    });
  }
  var opt = Object.assign({}, {
    headers: {
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  }, option);
  url += '?token=' + token + queryString;
  return new Promise(function (resolve, reject) {
    fetch('' + _common2.default.apiPrefix + url, opt).then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        reject(resolve);
      }
    }).then(function (res) {
      if (res.retCode === 0) {
        resolve(res);
      } else if (res.retCode === -13) {
        alert(res.msg);
        localStorage.removeItem('token');
        window.location.hash = '/login';
      } else {
        reject(res);
      }
    });
  }).catch(function (res) {
    alert('请求出错，请稍后重试！');
    return res;
  });
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  apiPrefix: 'https://www.qaformath.com/zbuniserver-api/',
  noDataGood: {
    goods_name: '',
    goods_image: '',
    goods_type_id: 0,
    goods_collect: 0,
    category_id: 0,
    goods_jingle: '',
    goods_price: 0,
    goods_marketprice: 0,
    goods_serial: '',
    goods_click: 0,
    goods_salenum: 0,
    goods_spec: [],
    goods_storage: 0,
    goods_state: 0,
    goods_verify: 0,
    create_time: '',
    update_time: '',
    goods_freight: 0,
    evaluation_good_star: 0,
    evaluation_count: 0
  },
  status: {
    1: '待付款',
    2: '待收货',
    3: '已取消',
    4: '退款中',
    5: '已退款',
    6: '退款失败',
    7: '已完成'
  },
  activeType: {
    1: '满减',
    2: '优惠券',
    3: '优惠'
  },
  noDataActive: {
    discount: 9,
    goods_list: [18],
    goods_count: [1],
    start_time: null,
    image_url: "https://image.qaformath.com/computer_superapp/banner01.jpg",
    create_time: "2017-10-16 16:10:14",
    end_time: null,
    active_type: 3,
    title: "丢丢丢",
    id: 4,
    sort: 4
  },
  discountType: {
    1: '1折优惠',
    2: '2折优惠',
    3: '3折优惠',
    4: '4折优惠',
    5: '5折优惠',
    6: '6折优惠',
    7: '7折优惠',
    8: '8折优惠',
    9: '9折优惠',
    10: '1元秒杀'
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.styles = {
  smallColumn: {
    width: '20px',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  bigColumn: {
    width: '100px',
    textAlign: 'center'
  },
  middleColumn: {
    width: '80px'
  },
  secImageItem: {
    marginTop: '12px',
    width: 150,
    float: 'left',
    marginRight: 12
  },
  fileSelect: {
    opacity: 0,
    filter: 'alpha(opacity=0)',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  fileSelectContent: {
    marginRight: 12,
    display: 'block',
    width: '150px',
    position: 'relative',
    margin: '0 auto 12px'
  },
  mainImage: {
    width: 600,
    height: 190,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block'
  },
  detailImage: {
    width: 150,
    height: 200,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block',
    marginRight: '12px'
  },
  specKey: {
    width: 150,
    marginRight: 12
  },
  specValue: {
    width: 300,
    marginLeft: 12
  },
  specItem: {
    width: 500,
    margin: '0 auto'
  },
  specAddBtn: {
    width: 100,
    height: 40,
    borderRadius: '2%'
  },
  categoryContent: {
    width: 100,
    float: 'left',
    height: 350,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  goodsListContent: {
    width: 460,
    float: 'left',
    height: 48
  },
  goodsCheckItem: {
    float: 'left',
    height: 48,
    width: 160,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(615);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.styles = {
  smallColumn: {
    width: '20px',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  bigColumn: {
    width: '100px',
    textAlign: 'center'
  },
  middleColumn: {
    width: '80px'
  },
  secImageItem: {
    marginTop: '12px',
    width: 150,
    float: 'left',
    marginRight: 12
  },
  fileSelect: {
    opacity: 0,
    filter: 'alpha(opacity=0)',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  fileSelectContent: {
    marginRight: 12,
    display: 'block',
    width: '150px',
    position: 'relative',
    marginBottom: '12px'
  },
  mainImage: {
    width: 300,
    height: 214,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block'
  },
  detailImage: {
    width: 150,
    height: 200,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block',
    marginRight: '12px'
  },
  specKey: {
    width: 150,
    marginRight: 12
  },
  specValue: {
    width: 300,
    marginLeft: 12
  },
  specItem: {
    width: 500,
    margin: '0 auto'
  },
  specAddBtn: {
    width: 100,
    height: 40,
    borderRadius: '2%'
  }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _materialUi = __webpack_require__(1);

var _PageStyle = __webpack_require__(35);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pagination = function (_React$Component) {
  _inherits(Pagination, _React$Component);

  function Pagination(props) {
    _classCallCheck(this, Pagination);

    var _this = _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, props));

    _this.parsePage = function (pages, index) {
      var res = [];
      if (pages <= 7) {
        for (var i = 1; i <= pages; i++) {
          res.push(i);
        }
        return res;
      } else if (index <= 2 || index > pages - 2) {
        return [1, 2, '...', pages - 1, pages];
      } else {
        return [1, '...', index - 1, index, index + 1, '...', pages];
      }
    };

    _this.skipTo = function (index) {
      var that = _this;
      _this.setState({
        index: index
      }, function () {
        that.props.pageChange(index);
      });
    };

    _this.state = {
      index: 1
    };
    return _this;
  }

  _createClass(Pagination, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          total = _props.total,
          limit = _props.limit;

      var index = this.state.index;
      var pages = Math.ceil(total / limit);
      var pageButtons = this.parsePage(pages, index);
      return _react2.default.createElement(
        'div',
        { style: _PageStyle.styles.pageContainer },
        _react2.default.createElement(_materialUi.FlatButton, {
          style: _PageStyle.styles.button,
          label: '<<',
          primary: true,
          onClick: function onClick() {
            _this2.skipTo(1);
          }
        }),
        _react2.default.createElement(_materialUi.FlatButton, {
          style: _PageStyle.styles.button,
          label: '<',
          primary: true,
          onClick: function onClick() {
            _this2.skipTo(index - 1);
          }
        }),
        pageButtons.map(function (item) {
          if (item === index) {
            return _react2.default.createElement(_materialUi.FlatButton, {
              style: _PageStyle.styles.button,
              label: item,
              secondary: true,
              onClick: function onClick() {
                _this2.skipTo(item);
              }
            });
          } else if (item !== '...') {
            return _react2.default.createElement(_materialUi.FlatButton, {
              style: _PageStyle.styles.button,
              label: item,
              onClick: function onClick() {
                _this2.skipTo(item);
              },
              primary: true
            });
          }
          return _react2.default.createElement(_materialUi.FlatButton, {
            style: _PageStyle.styles.button,
            disabled: true,
            label: item,
            primary: true
          });
        }),
        _react2.default.createElement(_materialUi.FlatButton, {
          style: _PageStyle.styles.button,
          label: '>',
          primary: true,
          onClick: function onClick() {
            _this2.skipTo(index + 1);
          }
        }),
        _react2.default.createElement(_materialUi.FlatButton, {
          style: _PageStyle.styles.button,
          label: '>>',
          primary: true,
          onClick: function onClick() {
            _this2.skipTo(pages);
          }
        })
      );
    }
  }]);

  return Pagination;
}(_react2.default.Component);

exports.default = Pagination;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(574);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(600);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _pure = __webpack_require__(33);

var _pure2 = _interopRequireDefault(_pure);

var _SvgIcon = __webpack_require__(34);

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AvPlaylistAdd = function AvPlaylistAdd(props) {
  return _react2.default.createElement(
    _SvgIcon2.default,
    props,
    _react2.default.createElement('path', { d: 'M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z' })
  );
};
AvPlaylistAdd = (0, _pure2.default)(AvPlaylistAdd);
AvPlaylistAdd.displayName = 'AvPlaylistAdd';
AvPlaylistAdd.muiName = 'SvgIcon';

exports.default = AvPlaylistAdd;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(249);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = printMe;
function printMe() {
  console.log('Updating print.js...');
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(18);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouterDom = __webpack_require__(11);

var _MuiThemeProvider = __webpack_require__(19);

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _Header = __webpack_require__(20);

var _Header2 = _interopRequireDefault(_Header);

var _Login = __webpack_require__(46);

var _Login2 = _interopRequireDefault(_Login);

var _reactRedux = __webpack_require__(2);

var _redux = __webpack_require__(15);

var _reducers = __webpack_require__(48);

var _reducers2 = _interopRequireDefault(_reducers);

var _print = __webpack_require__(16);

var _print2 = _interopRequireDefault(_print);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _redux.createStore)(_reducers2.default, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

_reactDom2.default.render(_react2.default.createElement(
  _MuiThemeProvider2.default,
  null,
  _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _reactRouterDom.HashRouter,
      null,
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_reactRouterDom.Route, { path: '/', render: function render() {
            return _react2.default.createElement(_reactRouterDom.Redirect, { to: '/main/goodsList' });
          } }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/main', component: _Header2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: '/login', component: _Login2.default })
      )
    )
  )
), document.getElementById('app-root'));

if (true) {
  module.hot.accept(16, function () {
    (0, _print2.default)();
  });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(17);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(492);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _materialUi = __webpack_require__(1);

var _HeaderStyle = __webpack_require__(21);

var _reactRouterDom = __webpack_require__(11);

var _HotList = __webpack_require__(22);

var _HotList2 = _interopRequireDefault(_HotList);

var _GoodsList = __webpack_require__(24);

var _GoodsList2 = _interopRequireDefault(_GoodsList);

var _Category = __webpack_require__(36);

var _Category2 = _interopRequireDefault(_Category);

var _ActiveList = __webpack_require__(38);

var _ActiveList2 = _interopRequireDefault(_ActiveList);

var _OrderList = __webpack_require__(44);

var _OrderList2 = _interopRequireDefault(_OrderList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_React$Component) {
  _inherits(Header, _React$Component);

  function Header(props) {
    _classCallCheck(this, Header);

    var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

    _this.menuOnchange = function (e, v) {
      _this.setState({
        menuSelected: v
      });
      _this.props.history.push('/main/' + v);
    };

    _this.logout = function () {
      localStorage.removeItem('token');
      _this.props.history.replace('/login');
    };

    var pathName = _this.props.location.pathname.split('/')[2];
    _this.state = {
      menuSelected: pathName
    };
    return _this;
  }

  _createClass(Header, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: { width: '100%' } },
        _react2.default.createElement(
          'div',
          { style: _HeaderStyle.styles.titleBarContent },
          _react2.default.createElement(_materialUi.AppBar, {
            style: _HeaderStyle.styles.titleBar,
            title: '\u5C0F\u7A0B\u5E8F\u540E\u53F0\u7BA1\u7406\u7CFB\u7EDF',
            iconStyleLeft: { display: 'none' },
            iconElementRight: _react2.default.createElement(_materialUi.FlatButton, { label: '\u767B\u51FA', onClick: this.logout })
          })
        ),
        _react2.default.createElement(
          'div',
          { style: { width: '1230px', margin: '0 auto' } },
          _react2.default.createElement(
            _materialUi.Paper,
            {
              style: _HeaderStyle.styles.paperStyle
            },
            _react2.default.createElement(
              _materialUi.Menu,
              {
                style: _HeaderStyle.styles.menu,
                selectedMenuItemStyle: {
                  backgroundColor: 'rgb(0, 188, 212)'
                },
                value: this.state.menuSelected,
                menuItemStyle: { width: '200px' },
                onChange: this.menuOnchange
              },
              _react2.default.createElement(_materialUi.MenuItem, { value: 'goodsList', primaryText: '\u5546\u54C1\u5217\u8868' }),
              _react2.default.createElement(_materialUi.MenuItem, { value: 'category', primaryText: '\u5206\u7C7B\u5217\u8868' }),
              _react2.default.createElement(_materialUi.MenuItem, { value: 'orderList', primaryText: '\u8BA2\u5355\u5217\u8868' }),
              _react2.default.createElement(_materialUi.MenuItem, { value: 'activeList', primaryText: '\u6D3B\u52A8\u5217\u8868' })
            )
          ),
          _react2.default.createElement(
            'div',
            { style: _HeaderStyle.styles.tableContainer },
            _react2.default.createElement(_reactRouterDom.Route, { path: '/main/goodsList', component: _GoodsList2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: '/main/hotList', component: _HotList2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: '/main/category', component: _Category2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: '/main/orderList', component: _OrderList2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: '/main/activeList', component: _ActiveList2.default })
          )
        )
      );
    }
  }]);

  return Header;
}(_react2.default.Component);

exports.default = Header;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.styles = {
  paperStyle: {
    display: 'inline-block',
    width: '200px',
    marginTop: '30px',
    float: 'left'
  },
  titleBarContent: {
    width: '100%',
    height: '64px',
    backgroundColor: 'rgb(0, 188, 212)'
  },
  titleBar: {
    maxWidth: '1230px',
    boxShadow: 'none',
    height: '64px',
    margin: '0 auto'
  },
  mainContainer: {
    width: '1230px',
    margin: '0 auto',
    position: 'relative'
  },
  menu: {
    width: '200px'
  },
  tableContainer: {
    float: 'left',
    width: '1000px',
    margin: '30px 0 30px 25px'
  }
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _request = __webpack_require__(5);

var _materialUi = __webpack_require__(1);

var _GoodsListStyles = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HotList = function (_React$Component) {
  _inherits(HotList, _React$Component);

  function HotList(props) {
    _classCallCheck(this, HotList);

    var _this = _possibleConstructorReturn(this, (HotList.__proto__ || Object.getPrototypeOf(HotList)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(HotList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _request.request)('admin/hot-goods/list', {}, { limit: 10, offset: 0 }).then(function () {});
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var dataRow = [];
      return _react2.default.createElement(
        _materialUi.Paper,
        null,
        _react2.default.createElement(
          _materialUi.RaisedButton,
          {
            primary: true,
            style: { margin: '8px' },
            onClick: function onClick() {
              _this2.showModal(null, 'addGoods');
            }
          },
          '\u6DFB\u52A0'
        ),
        _react2.default.createElement(
          _materialUi.Table,
          null,
          _react2.default.createElement(
            _materialUi.TableHeader,
            {
              displaySelectAll: false,
              adjustForCheckbox: false
            },
            _react2.default.createElement(
              _materialUi.TableRow,
              null,
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                'ID'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.bigColumn },
                '\u5546\u54C1\u540D\u79F0'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u5546\u54C1\u4EF7\u683C'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u5E93\u5B58'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u9500\u91CF'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.bigColumn },
                '\u64CD\u4F5C'
              )
            )
          ),
          _react2.default.createElement(
            _materialUi.TableBody,
            { displayRowCheckbox: false },
            dataRow.map(function (item) {
              return _react2.default.createElement(
                _materialUi.TableRow,
                { key: item.id, selectable: false },
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.id
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.bigColumn },
                  item.goods_name
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_price
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_storage
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_salenum
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.bigColumn },
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id, 'showDetail');
                      }
                    },
                    '\u67E5\u770B\u8BE6\u60C5'
                  ),
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id, 'editDetail');
                      }
                    },
                    '\u7F16\u8F91'
                  ),
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    { primary: true },
                    '\u5220\u9664'
                  )
                )
              );
            })
          )
        )
      );
    }
  }]);

  return HotList;
}(_react2.default.Component);

exports.default = HotList;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.styles = {
  smallColumn: {
    width: '20px',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  bigColumn: {
    width: '100px',
    textAlign: 'center'
  },
  middleColumn: {
    width: '80px'
  },
  secImageItem: {
    marginTop: '12px',
    width: 150,
    float: 'left',
    marginRight: 12
  },
  fileSelect: {
    opacity: 0,
    filter: 'alpha(opacity=0)',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  fileSelectContent: {
    marginRight: 12,
    display: 'block',
    width: '150px',
    position: 'relative',
    marginBottom: '12px'
  },
  mainImage: {
    width: 300,
    height: 214,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block'
  },
  detailImage: {
    width: 150,
    height: 200,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block',
    marginRight: '12px'
  },
  specKey: {
    width: 150,
    marginRight: 12
  },
  specValue: {
    width: 300,
    marginLeft: 12
  },
  specItem: {
    width: 500,
    margin: '0 auto'
  },
  specAddBtn: {
    width: 100,
    height: 40,
    borderRadius: '2%'
  }
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _request = __webpack_require__(5);

var _materialUi = __webpack_require__(1);

var _common = __webpack_require__(6);

var _common2 = _interopRequireDefault(_common);

var _DetailModal = __webpack_require__(25);

var _DetailModal2 = _interopRequireDefault(_DetailModal);

var _GoodsListStyles = __webpack_require__(9);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

var _Pagination = __webpack_require__(10);

var _Pagination2 = _interopRequireDefault(_Pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GoodsList = function (_React$Component) {
  _inherits(GoodsList, _React$Component);

  function GoodsList(props) {
    _classCallCheck(this, GoodsList);

    var _this = _possibleConstructorReturn(this, (GoodsList.__proto__ || Object.getPrototypeOf(GoodsList)).call(this, props));

    _this.showModal = function (id, key) {
      if (id !== null) {
        var that = _this;
        (0, _request.request)('admin/home/get-goods-info/' + id, {}).then(function (res) {
          if (res.retCode === 0) {
            that.props.pickGoodDetail(res.data);
          }
        });
      } else {
        _this.props.pickGoodDetail(_common2.default.noDataGood);
      }
      _this.setState({
        keyWord: key,
        modalShow: true
      });
    };

    _this.modalClose = function () {
      _this.setState({
        modalShow: false
      });
    };

    _this.pageChange = function (index) {
      var that = _this;
      (0, _request.request)('admin/home/goods-list', {}, { limit: 10, offset: (index - 1) * 10 }).then(function (res) {
        if (res.retCode === 0) {
          that.props.saveGoodsList(res.data.dataArr, res.data.total);
        }
      });
    };

    _this.state = {
      showData: {},
      modalShow: false,
      keyWord: ''
    };
    return _this;
  }

  _createClass(GoodsList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var that = this;
      (0, _request.request)('admin/home/goods-list', {}, { limit: 10, offset: 0 }).then(function (res) {
        if (res.retCode === 0) {
          that.props.saveGoodsList(res.data.dataArr, res.data.total);
        }
      });

      (0, _request.request)('category/get-categories-list', {}).then(function (res) {
        if (res.retCode === 0) {
          that.props.saveCategoriesList(res.data);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var dataRow = this.props.goodsList.goodsList;
      return _react2.default.createElement(
        _materialUi.Paper,
        null,
        _react2.default.createElement(
          _materialUi.RaisedButton,
          {
            primary: true,
            style: { margin: '8px' },
            onClick: function onClick() {
              _this2.showModal(null, 'addGoods');
            }
          },
          '\u6DFB\u52A0'
        ),
        _react2.default.createElement(
          _materialUi.Table,
          null,
          _react2.default.createElement(
            _materialUi.TableHeader,
            {
              displaySelectAll: false,
              adjustForCheckbox: false
            },
            _react2.default.createElement(
              _materialUi.TableRow,
              null,
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                'ID'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.bigColumn },
                '\u5546\u54C1\u540D\u79F0'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u5546\u54C1\u4EF7\u683C'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u5E93\u5B58'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u9500\u91CF'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.bigColumn },
                '\u64CD\u4F5C'
              )
            )
          ),
          _react2.default.createElement(
            _materialUi.TableBody,
            { displayRowCheckbox: false },
            dataRow.map(function (item) {
              return _react2.default.createElement(
                _materialUi.TableRow,
                { key: item.id, selectable: false },
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.id
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.bigColumn },
                  item.goods_name
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_price
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_storage
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_salenum
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.bigColumn },
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id, 'showDetail');
                      }
                    },
                    '\u67E5\u770B\u8BE6\u60C5'
                  ),
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id, 'editDetail');
                      }
                    },
                    '\u7F16\u8F91'
                  ),
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    { primary: true },
                    '\u5220\u9664'
                  )
                )
              );
            })
          )
        ),
        _react2.default.createElement(_Pagination2.default, {
          total: this.props.goodsList.goodsTotal,
          limit: 10,
          pageChange: this.pageChange
        }),
        _react2.default.createElement(_DetailModal2.default, {
          keyWord: this.state.keyWord,
          open: this.state.modalShow,
          handleClose: this.modalClose
        })
      );
    }
  }]);

  return GoodsList;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    goodsList: state.goodsList.toJS()
  };
}, function (dispatch) {
  return {
    saveGoodsList: function saveGoodsList(dataArr, total) {
      return dispatch(_actions.goodsList.saveGoodsList(dataArr, total));
    },
    saveCategoriesList: function saveCategoriesList(dataObj) {
      return dispatch(_actions.categoriesList.saveCategoriesList(dataObj));
    },
    pickGoodDetail: function pickGoodDetail(dataObj) {
      return dispatch(_actions.goodsList.pickGoodDetail(dataObj));
    }
  };
})(GoodsList);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _materialUi = __webpack_require__(1);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _AddGoodsDetail = __webpack_require__(26);

var _AddGoodsDetail2 = _interopRequireDefault(_AddGoodsDetail);

var _AddImage = __webpack_require__(31);

var _AddImage2 = _interopRequireDefault(_AddImage);

var _AddGoodSpec = __webpack_require__(32);

var _AddGoodSpec2 = _interopRequireDefault(_AddGoodSpec);

var _request = __webpack_require__(5);

var _reactRedux = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailModal = function (_React$Component) {
  _inherits(DetailModal, _React$Component);

  function DetailModal(props) {
    _classCallCheck(this, DetailModal);

    var _this = _possibleConstructorReturn(this, (DetailModal.__proto__ || Object.getPrototypeOf(DetailModal)).call(this, props));

    _this.handleClose = function () {
      _this.props.handleClose();
    };

    _this.getStepContent = function (stepIndex) {
      var keyWord = _this.props.keyWord;

      switch (stepIndex) {
        case 0:
          return _react2.default.createElement(_AddGoodsDetail2.default, { keyWord: keyWord });
        case 1:
          return _react2.default.createElement(_AddImage2.default, { keyWord: keyWord });
        case 2:
          return _react2.default.createElement(_AddGoodSpec2.default, { keyWord: keyWord });
        default:
          break;
      }
    };

    _this.handlePrev = function () {
      var stepIndex = _this.state.stepIndex;

      if (stepIndex > 0) {
        _this.setState({ stepIndex: stepIndex - 1 });
      }
    };

    _this.handleNext = function () {
      var stepIndex = _this.state.stepIndex;

      if (stepIndex === 2) {
        _this.handleConfirm();
      }
      _this.setState({
        stepIndex: stepIndex === 2 ? stepIndex : stepIndex + 1
      });
    };

    _this.handleConfirm = function () {
      var queryData = _this.props.goodsList.editGood;
      var keyWord = _this.props.keyWord;
      var url = '';
      switch (keyWord) {
        case 'showDetail':
          return;
        case 'editDetail':
          url = 'admin/goods/edit-goods';
          break;
        case 'addGoods':
          url = 'admin/goods/add-goods';
          break;
        default:
          return;
      }
      var goods_spec = queryData.goods_spec;
      var goodsSpec = {};
      goods_spec.forEach(function (item) {
        var key = item.key,
            value = item.value;

        goodsSpec[key] = value;
      });
      queryData.goods_spec = goodsSpec;
      // 数据校验
      var goods_name = queryData.goods_name,
          goods_price = queryData.goods_price,
          goods_marketprice = queryData.goods_marketprice,
          evaluation_count = queryData.evaluation_count,
          evaluation_good_star = queryData.evaluation_good_star,
          goods_storage = queryData.goods_storage,
          goods_salenum = queryData.goods_salenum,
          goods_freight = queryData.goods_freight,
          goods_click = queryData.goods_click,
          goods_image = queryData.goods_image;


      if (!goods_name) {
        alert('商品名称不能为空！');
        return;
      }
      if (!goods_price || typeof parseInt(goods_price) !== 'number') {
        alert('商品价格输入有误或未输入！');
        return;
      }
      if (!goods_marketprice || isNaN(parseInt(goods_marketprice))) {
        alert('商品市场价输入有误或未输入');
        return;
      }
      if (isNaN(parseInt(evaluation_good_star))) {
        alert('商品评星输入有误，必须为数字');
        return;
      }
      if (isNaN(parseInt(evaluation_count))) {
        alert('商品评价数输入有误，必须为数字');
        return;
      }
      if (isNaN(parseInt(goods_storage))) {
        alert('商品库存输入有误，必须为数字');
        return;
      }
      if (isNaN(parseInt(goods_salenum))) {
        alert('商品销量输入有误，必须为数字');
        return;
      }
      if (isNaN(parseInt(goods_freight))) {
        alert('商品运费输入有误，必须为数字');
        return;
      }
      if (isNaN(parseInt(goods_click))) {
        alert('商品点击量输入有误，必须为数字');
        return;
      }
      if (!goods_image) {
        alert('商品主图为必填项目');
        return;
      }

      (0, _request.request)(url, {
        method: 'POST',
        body: JSON.stringify(queryData)
      }).then(function () {});
    };

    _this.state = {
      stepIndex: 0,
      fileUrl: ''
    };
    return _this;
  }

  _createClass(DetailModal, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var keyWord = this.props.keyWord;
      var stepIndex = this.state.stepIndex;


      var modalTitle = '';
      switch (keyWord) {
        case 'showDetail':
          modalTitle = '商品详情';
          break;
        case 'editDetail':
          modalTitle = '编辑详情';
          break;
        case 'addGoods':
          modalTitle = '添加商品';
          break;
        default:
          break;
      }

      var actions = [_react2.default.createElement(
        'div',
        { style: { marginTop: 12 } },
        _react2.default.createElement(_materialUi.RaisedButton, {
          label: '\u53D6\u6D88',
          onClick: this.handleClose,
          style: { marginRight: 12 }
        }),
        _react2.default.createElement(_materialUi.RaisedButton, {
          label: '\u4E0A\u4E00\u6B65',
          disabled: stepIndex === 0,
          onClick: this.handlePrev,
          style: { marginRight: 12 }
        }),
        _react2.default.createElement(_materialUi.RaisedButton, {
          label: stepIndex === 2 ? '确认提交' : '下一步',
          primary: true,
          onClick: this.handleNext
        })
      )];
      var contentStyle = { margin: '0 16px' };

      return _react2.default.createElement(
        _materialUi.Dialog,
        {
          open: this.props.open,
          actions: actions,
          autoScrollBodyContent: true,
          title: modalTitle
        },
        _react2.default.createElement(
          'div',
          { style: { width: '100%', maxWidth: 700, margin: 'auto' } },
          _react2.default.createElement(
            _materialUi.Stepper,
            { linear: false, activeStep: stepIndex },
            _react2.default.createElement(
              _materialUi.Step,
              null,
              _react2.default.createElement(
                _materialUi.StepButton,
                { onClick: function onClick() {
                    _this2.setState({
                      stepIndex: 0
                    });
                  } },
                '\u57FA\u672C\u4FE1\u606F'
              )
            ),
            _react2.default.createElement(
              _materialUi.Step,
              null,
              _react2.default.createElement(
                _materialUi.StepButton,
                { onClick: function onClick() {
                    _this2.setState({
                      stepIndex: 1
                    });
                  } },
                '\u56FE\u7247\u4E0A\u4F20'
              )
            ),
            _react2.default.createElement(
              _materialUi.Step,
              null,
              _react2.default.createElement(
                _materialUi.StepButton,
                { onClick: function onClick() {
                    _this2.setState({
                      stepIndex: 2
                    });
                  } },
                '\u5546\u54C1\u89C4\u683C'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { style: contentStyle },
            _react2.default.createElement(
              'div',
              null,
              this.getStepContent(stepIndex)
            )
          )
        )
      );
    }
  }]);

  return DetailModal;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    goodsList: state.goodsList.toJS(),
    categoriesList: state.categoriesList.toJS()
  };
})(DetailModal);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _materialUi = __webpack_require__(1);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddGoodsDetail = function (_React$Component) {
  _inherits(AddGoodsDetail, _React$Component);

  function AddGoodsDetail(props) {
    _classCallCheck(this, AddGoodsDetail);

    return _possibleConstructorReturn(this, (AddGoodsDetail.__proto__ || Object.getPrototypeOf(AddGoodsDetail)).call(this, props));
  }

  _createClass(AddGoodsDetail, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          keyWord = _props.keyWord,
          categoriesList = _props.categoriesList,
          goodsList = _props.goodsList;


      var isDisabled = keyWord === 'showDetail';

      var editGood = goodsList.editGood;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u540D',
          floatingLabelText: '\u5546\u54C1\u540D',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.goods_name || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ goods_name: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(
          _materialUi.SelectField,
          {
            hintText: '\u8BF7\u9009\u62E9\u5546\u54C1\u7C7B\u578B',
            floatingLabelText: '\u5546\u54C1\u7C7B\u578B',
            style: { width: '100%' },
            underlineShow: false,
            disabled: isDisabled,
            value: editGood.category_id || 1,
            onChange: function onChange(e, i, v) {
              _this2.props.patchGoodDetail({ category_id: v });
            }
          },
          categoriesList.categoriesList.map(function (item) {
            return _react2.default.createElement(_materialUi.MenuItem, { value: item.id, key: item.id, primaryText: item.name });
          })
        ),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5E7F\u544A\u8BCD',
          floatingLabelText: '\u5E7F\u544A\u8BCD',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.goods_jingle || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ goods_jingle: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u4EF7\u683C',
          floatingLabelText: '\u5546\u54C1\u4EF7\u683C',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.goods_price || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ goods_price: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u5E02\u573A\u4EF7',
          floatingLabelText: '\u5E02\u573A\u4EF7',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.goods_marketprice || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ goods_marketprice: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u5E93\u5B58',
          floatingLabelText: '\u5546\u54C1\u5E93\u5B58',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.goods_storage || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ goods_storage: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u9500\u91CF',
          floatingLabelText: '\u5546\u54C1\u9500\u91CF',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.goods_salenum || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ goods_salenum: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u8BBF\u95EE\u91CF',
          floatingLabelText: '\u5546\u54C1\u8BBF\u95EE\u91CF',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.goods_click || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ goods_click: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u8FD0\u8D39',
          floatingLabelText: '\u5546\u54C1\u8FD0\u8D39',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.goods_freight || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ goods_freight: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u8BC4\u4EF7\u6570',
          floatingLabelText: '\u5546\u54C1\u8BC4\u4EF7\u6570',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.evaluation_count || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ evaluation_count: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u661F\u7EA7',
          floatingLabelText: '\u5546\u54C1\u661F\u7EA7',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editGood.evaluation_good_star || '',
          onChange: function onChange(e) {
            _this2.props.patchGoodDetail({ evaluation_good_star: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null)
      );
    }
  }]);

  return AddGoodsDetail;
}(_react2.default.Component);

var dispatchSaveGoodsList = function dispatchSaveGoodsList(dispatch) {
  return {
    saveGoodsList: function saveGoodsList(dataArr) {
      dispatch(_actions.goodsList.saveGoodsList(dataArr));
    },
    saveCategoriesList: function saveCategoriesList(dataArr) {
      dispatch(_actions.goodsList.saveCategoriesList(dataArr));
    },
    patchGoodDetail: function patchGoodDetail(dataObj) {
      dispatch(_actions.goodsList.patchGoodDetail(dataObj));
    }
  };
};

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    goodsList: state.goodsList.toJS(),
    categoriesList: state.categoriesList.toJS()
  };
}, dispatchSaveGoodsList)(AddGoodsDetail);

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var saveGoodsList = exports.saveGoodsList = function saveGoodsList(dataArr, total) {
  return {
    type: 'SAVE_GOODS_LIST',
    dataArr: dataArr,
    total: total
  };
};

var pickGoodDetail = exports.pickGoodDetail = function pickGoodDetail(dataObj) {
  return {
    type: 'PICK_GOOD_DETAIL',
    dataObj: dataObj
  };
};

var patchGoodDetail = exports.patchGoodDetail = function patchGoodDetail(dataObj) {
  return {
    type: 'PATCH_GOOD_DETAIL',
    dataObj: dataObj
  };
};

var patchGoodsList = exports.patchGoodsList = function patchGoodsList(id, dataObj) {
  return {
    type: 'PATCH_GOODS_LIST',
    id: id, dataObj: dataObj
  };
};

var addSpec = exports.addSpec = function addSpec() {
  return {
    type: 'ADD_SPEC'
  };
};

var editSpec = exports.editSpec = function editSpec(index, dataObj) {
  return {
    type: 'EDIT_SPEC',
    index: index, dataObj: dataObj
  };
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var saveCategoriesList = exports.saveCategoriesList = function saveCategoriesList(dataArr) {
  return {
    type: 'SAVE_CATEGORIES_LIST',
    dataArr: dataArr
  };
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var saveOrderList = exports.saveOrderList = function saveOrderList(dataArr, total) {
  return {
    type: 'SAVE_ORDER_LIST',
    dataArr: dataArr,
    total: total
  };
};

var pickOrderDetail = exports.pickOrderDetail = function pickOrderDetail(dataObj) {
  return {
    type: 'PICK_ORDER_DETAIL',
    dataObj: dataObj
  };
};

var patchOrderList = exports.patchOrderList = function patchOrderList(id, dataObj) {
  return {
    type: 'PATCH_ORDER_LIST',
    id: id, dataObj: dataObj
  };
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var saveActiveList = exports.saveActiveList = function saveActiveList(dataArr, total) {
  return {
    type: 'SAVE_ACTIVE_LIST',
    dataArr: dataArr,
    total: total
  };
};

var pickActiveDetail = exports.pickActiveDetail = function pickActiveDetail(dataObj) {
  return {
    type: 'PICK_ACTIVE_DETAIL',
    dataObj: dataObj
  };
};

var patchActiveDetail = exports.patchActiveDetail = function patchActiveDetail(dataObj) {
  return {
    type: 'PATCH_ACTIVE_DETAIL',
    dataObj: dataObj
  };
};

var patchActiveList = exports.patchActiveList = function patchActiveList(id, dataObj) {
  return {
    type: 'PATCH_ACTIVE_LIST',
    id: id,
    dataObj: dataObj
  };
};

var addActiveGoods = exports.addActiveGoods = function addActiveGoods(id) {
  return {
    type: 'ADD_ACTIVE_GOODS',
    id: id
  };
};

var editActiveGoods = exports.editActiveGoods = function editActiveGoods(number) {
  return {
    type: 'EDIT_ACTIVE_GOODS',
    number: number
  };
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

var _materialUi = __webpack_require__(1);

var _reactAvatarEditor = __webpack_require__(12);

var _reactAvatarEditor2 = _interopRequireDefault(_reactAvatarEditor);

var _GoodsListStyles = __webpack_require__(9);

var _upload = __webpack_require__(13);

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddImage = function (_React$Component) {
  _inherits(AddImage, _React$Component);

  function AddImage(props) {
    _classCallCheck(this, AddImage);

    var _this = _possibleConstructorReturn(this, (AddImage.__proto__ || Object.getPrototypeOf(AddImage)).call(this, props));

    _this.singleFileSelect = function (e) {
      var that = _this;
      var image = e.currentTarget.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = function (e) {
        that.setState({
          imgFieldOpen: true,
          fileUrl: e.target.result
        });
      };
    };

    _this.secFileSelect = function (e, key) {
      var that = _this;
      var image = e.currentTarget.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = function (e) {
        var obj = {};
        obj[key] = e.target.result;
        that.props.patchGoodDetail(obj);
      };
    };

    _this.setEditorRef = function (editor) {
      if (editor) _this.editor = editor;
    };

    _this.handleSave = function () {
      var img = _this.editor.getImageScaledToCanvas().toDataURL();
      _this.props.patchGoodDetail({ goods_image: img });
      _this.setState({ imgFieldOpen: false });
    };

    _this.state = {
      fileUrl: '',
      imgFieldOpen: false
    };
    return _this;
  }

  _createClass(AddImage, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var editGood = this.props.goodsList.editGood;
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('img', {
          src: editGood.goods_image || _upload2.default,
          style: _GoodsListStyles.styles.mainImage,
          alt: _upload2.default
        }),
        _react2.default.createElement(
          _materialUi.RaisedButton,
          {
            label: '',
            primary: true,
            style: _GoodsListStyles.styles.fileSelectContent
          },
          '\u4E0A\u4F20\u56FE\u7247',
          _react2.default.createElement('input', {
            style: _GoodsListStyles.styles.fileSelect,
            type: 'file',
            accept: 'image/gif,image/jpeg,image/png',
            onChange: this.singleFileSelect
          })
        ),
        _react2.default.createElement(
          'span',
          {
            style: { marginBottom: '12px', display: 'block' }
          },
          '\u8BF7\u4E0A\u4F20\u4EA7\u54C1\u4E3B\u56FE\uFF0C\u4E3B\u56FE\u4F1A\u5728\u4EA7\u54C1\u5217\u8868\u548C\u4EA7\u54C1\u8BE6\u60C5\u4E2D\u5448\u73B0\uFF0C\u5C3A\u5BF8\u5EFA\u8BAE\u4E3A\u5BBD\u5EA6\u4E3A750\u50CF\u7D20\uFF0C\u957F\u5EA6\u4E3A635\u50CF\u7D20\uFF0C\u56FE\u7247\u5927\u5C0F\u5EFA\u8BAE\u5C0F\u4E8E1M'
        ),
        _react2.default.createElement(
          'div',
          { style: { height: 272 } },
          _react2.default.createElement(
            'div',
            { style: _GoodsListStyles.styles.secImageItem },
            _react2.default.createElement('img', {
              src: editGood.image1 || _upload2.default,
              style: _GoodsListStyles.styles.detailImage,
              alt: _upload2.default
            }),
            _react2.default.createElement(
              _materialUi.RaisedButton,
              {
                label: '',
                primary: true,
                style: _GoodsListStyles.styles.fileSelectContent
              },
              '\u4E0A\u4F20\u56FE\u72471',
              _react2.default.createElement('input', {
                style: _GoodsListStyles.styles.fileSelect,
                type: 'file',
                accept: 'image/gif,image/jpeg,image/png',
                onChange: function onChange(e) {
                  return _this2.secFileSelect(e, 'image1');
                }
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { style: _GoodsListStyles.styles.secImageItem },
            _react2.default.createElement('img', {
              src: editGood.image2 || _upload2.default,
              style: _GoodsListStyles.styles.detailImage,
              alt: _upload2.default
            }),
            _react2.default.createElement(
              _materialUi.RaisedButton,
              {
                label: '',
                primary: true,
                style: _GoodsListStyles.styles.fileSelectContent
              },
              '\u4E0A\u4F20\u56FE\u72472',
              _react2.default.createElement('input', {
                style: _GoodsListStyles.styles.fileSelect,
                type: 'file',
                accept: 'image/gif,image/jpeg,image/png',
                onChange: function onChange(e) {
                  return _this2.secFileSelect(e, 'image2');
                }
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { style: _GoodsListStyles.styles.secImageItem },
            _react2.default.createElement('img', {
              src: editGood.image3 || _upload2.default,
              style: _GoodsListStyles.styles.detailImage,
              alt: _upload2.default
            }),
            _react2.default.createElement(
              _materialUi.RaisedButton,
              {
                label: '',
                primary: true,
                style: _GoodsListStyles.styles.fileSelectContent
              },
              '\u4E0A\u4F20\u56FE\u72473',
              _react2.default.createElement('input', {
                style: _GoodsListStyles.styles.fileSelect,
                type: 'file',
                accept: 'image/gif,image/jpeg,image/png',
                onChange: function onChange(e) {
                  return _this2.secFileSelect(e, 'image3');
                }
              })
            )
          )
        ),
        _react2.default.createElement(
          'span',
          {
            style: { display: 'block' }
          },
          '\u8BF7\u4E0A\u4F20\u4EA7\u54C1\u8BE6\u60C5\u56FE\u7247\uFF0C\u5EFA\u8BAE\u5BBD\u5EA6\u4E3A750\u50CF\u7D20\uFF0C\u957F\u5EA6\u4E0D\u9650\uFF0C\u56FE\u7247\u5927\u5C0F\u5EFA\u8BAE\u5C0F\u4E8E1M'
        ),
        _react2.default.createElement(
          _materialUi.Dialog,
          {
            contentStyle: { width: '668px' },
            open: this.state.imgFieldOpen },
          _react2.default.createElement(_reactAvatarEditor2.default, {
            ref: this.setEditorRef,
            onSave: this.handleSave,
            image: this.state.fileUrl,
            width: 600,
            height: 428,
            border: 10,
            color: [255, 255, 255, 0.6] // RGBA
            , scale: 1,
            rotate: 0
          }),
          _react2.default.createElement(
            _materialUi.RaisedButton,
            {
              style: { display: 'block' },
              primary: true,
              onClick: this.handleSave
            },
            '\u786E\u8BA4'
          )
        )
      );
    }
  }]);

  return AddImage;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    goodsList: state.goodsList.toJS()
  };
}, function (dispatch) {
  return {
    patchGoodDetail: function patchGoodDetail(dataObj) {
      return dispatch(_actions.goodsList.patchGoodDetail(dataObj));
    }
  };
})(AddImage);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

var _materialUi = __webpack_require__(1);

var _playlistAdd = __webpack_require__(14);

var _playlistAdd2 = _interopRequireDefault(_playlistAdd);

var _GoodsListStyles = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddGoodSpec = function (_React$Component) {
  _inherits(AddGoodSpec, _React$Component);

  function AddGoodSpec(props) {
    _classCallCheck(this, AddGoodSpec);

    var _this = _possibleConstructorReturn(this, (AddGoodSpec.__proto__ || Object.getPrototypeOf(AddGoodSpec)).call(this, props));

    _this.addSpec = function () {
      if (_this.props.keyWord !== 'showDetail') _this.props.addSpec();
    };

    _this.state = {
      fileUrl: '',
      imgFieldOpen: false
    };
    return _this;
  }

  _createClass(AddGoodSpec, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var goodSpec = this.props.goodsList.editGood.goods_spec;
      var keyWord = this.props.keyWord;
      var isDisabled = keyWord === 'showDetail';
      return _react2.default.createElement(
        'div',
        null,
        goodSpec.map(function (item, idx) {
          return _react2.default.createElement(
            'div',
            { style: _GoodsListStyles.styles.specItem },
            _react2.default.createElement(_materialUi.TextField, {
              hintText: '\u8BF7\u8F93\u5165\u89C4\u683C\u6807\u9898',
              floatingLabelText: '\u89C4\u683C\u6807\u9898',
              value: item.key,
              disabled: isDisabled,
              onChange: function onChange(e) {
                _this2.props.editSpec(idx, { key: e.target.value });
              },
              style: _GoodsListStyles.styles.specKey
            }),
            ':',
            _react2.default.createElement(_materialUi.TextField, {
              hintText: '\u8BF7\u8F93\u5165\u89C4\u683C\u503C',
              floatingLabelText: '\u89C4\u683C\u503C',
              value: item.value,
              disabled: isDisabled,
              onChange: function onChange(e) {
                _this2.props.editSpec(idx, { value: e.target.value });
              },
              style: _GoodsListStyles.styles.specValue
            })
          );
        }),
        _react2.default.createElement(
          'div',
          { style: { width: '100%', padding: '12px 46px', boxSizing: 'border-box' } },
          _react2.default.createElement(
            _materialUi.FloatingActionButton,
            {
              iconStyle: _GoodsListStyles.styles.specAddBtn,
              style: {
                width: 100
              },
              onClick: this.addSpec
            },
            _react2.default.createElement(_playlistAdd2.default, null)
          ),
          _react2.default.createElement(
            'span',
            {
              style: { display: 'inline-block', marginTop: 12 }
            },
            '\u9700\u8981\u6DFB\u52A0\u65B0\u7684\u89C4\u683C\u4FE1\u606F\uFF0C\u70B9\u51FB\u6DFB\u52A0\u6309\u94AE\uFF0C\u5DE6\u4FA7\u586B\u5199\u89C4\u683C\u6807\u9898\uFF0C\u53F3\u4FA7\u586B\u5199\u89C4\u683C\u4FE1\u606F\uFF01'
          )
        )
      );
    }
  }]);

  return AddGoodSpec;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    goodsList: state.goodsList.toJS()
  };
}, function (dispatch) {
  return {
    patchGoodDetail: function patchGoodDetail(dataObj) {
      return dispatch(_actions.goodsList.patchGoodDetail(dataObj));
    },
    addSpec: function addSpec() {
      return dispatch(_actions.goodsList.addSpec());
    },
    editSpec: function editSpec(index, dataObj) {
      return dispatch(_actions.goodsList.editSpec(index, dataObj));
    }
  };
})(AddGoodSpec);

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(21);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(3))(20);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.styles = {
  button: {
    width: 47,
    height: 47,
    minWidth: 47
  },
  pageContainer: {
    maxWidth: 517,
    height: 47,
    margin: '0 auto'
  }
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _request = __webpack_require__(5);

var _materialUi = __webpack_require__(1);

var _GoodsListStyles = __webpack_require__(37);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Category = function (_React$Component) {
  _inherits(Category, _React$Component);

  function Category(props) {
    _classCallCheck(this, Category);

    var _this = _possibleConstructorReturn(this, (Category.__proto__ || Object.getPrototypeOf(Category)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(Category, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      (0, _request.request)('category/get-categories-list', {}).then(function (res) {
        if (res.retCode === 0) {
          console.log(res);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var dataRow = [];
      return _react2.default.createElement(
        _materialUi.Paper,
        null,
        _react2.default.createElement(
          _materialUi.RaisedButton,
          {
            primary: true,
            style: { margin: '8px' },
            onClick: function onClick() {
              _this2.showModal(null, 'addGoods');
            }
          },
          '\u6DFB\u52A0'
        ),
        _react2.default.createElement(
          _materialUi.Table,
          null,
          _react2.default.createElement(
            _materialUi.TableHeader,
            {
              displaySelectAll: false,
              adjustForCheckbox: false
            },
            _react2.default.createElement(
              _materialUi.TableRow,
              null,
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                'ID'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.bigColumn },
                '\u5546\u54C1\u540D\u79F0'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u5546\u54C1\u4EF7\u683C'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u5E93\u5B58'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u9500\u91CF'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.bigColumn },
                '\u64CD\u4F5C'
              )
            )
          ),
          _react2.default.createElement(
            _materialUi.TableBody,
            { displayRowCheckbox: false },
            dataRow.map(function (item) {
              return _react2.default.createElement(
                _materialUi.TableRow,
                { key: item.id, selectable: false },
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.id
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.bigColumn },
                  item.goods_name
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_price
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_storage
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.goods_salenum
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.bigColumn },
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id, 'showDetail');
                      }
                    },
                    '\u67E5\u770B\u8BE6\u60C5'
                  ),
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id, 'editDetail');
                      }
                    },
                    '\u7F16\u8F91'
                  ),
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    { primary: true },
                    '\u5220\u9664'
                  )
                )
              );
            })
          )
        )
      );
    }
  }]);

  return Category;
}(_react2.default.Component);

exports.default = Category;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.styles = {
  smallColumn: {
    width: '20px',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  bigColumn: {
    width: '100px',
    textAlign: 'center'
  },
  middleColumn: {
    width: '80px'
  },
  secImageItem: {
    marginTop: '12px',
    width: 150,
    float: 'left',
    marginRight: 12
  },
  fileSelect: {
    opacity: 0,
    filter: 'alpha(opacity=0)',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  fileSelectContent: {
    marginRight: 12,
    display: 'block',
    width: '150px',
    position: 'relative',
    marginBottom: '12px'
  },
  mainImage: {
    width: 300,
    height: 214,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block'
  },
  detailImage: {
    width: 150,
    height: 200,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block',
    marginRight: '12px'
  },
  specKey: {
    width: 150,
    marginRight: 12
  },
  specValue: {
    width: 300,
    marginLeft: 12
  },
  specItem: {
    width: 500,
    margin: '0 auto'
  },
  specAddBtn: {
    width: 100,
    height: 40,
    borderRadius: '2%'
  }
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _request = __webpack_require__(5);

var _common = __webpack_require__(6);

var _materialUi = __webpack_require__(1);

var _GoodsListStyles = __webpack_require__(7);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

var _Pagination = __webpack_require__(10);

var _Pagination2 = _interopRequireDefault(_Pagination);

var _DetailModal = __webpack_require__(39);

var _DetailModal2 = _interopRequireDefault(_DetailModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActiveList = function (_React$Component) {
  _inherits(ActiveList, _React$Component);

  function ActiveList(props) {
    _classCallCheck(this, ActiveList);

    var _this = _possibleConstructorReturn(this, (ActiveList.__proto__ || Object.getPrototypeOf(ActiveList)).call(this, props));

    _this.showModal = function (id, key) {
      if (id !== null) {
        var that = _this;
      } else {
        _this.props.pickActiveDetail(_common.noDataActive);
      }
      _this.setState({
        keyWord: key,
        modalShow: true
      });
    };

    _this.modalClose = function () {
      _this.setState({
        modalShow: false
      });
    };

    _this.state = {
      modalShow: false,
      keyWord: ''
    };
    return _this;
  }

  _createClass(ActiveList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var that = this;
      (0, _request.request)('admin/activity/list', {}, { limit: 10, offset: 0 }).then(function (res) {
        if (res.retCode == 0) {
          that.props.saveActiveList(res.data, res.total);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var dataRow = this.props.activeList.activeList;
      return _react2.default.createElement(
        _materialUi.Paper,
        null,
        _react2.default.createElement(
          _materialUi.RaisedButton,
          {
            primary: true,
            style: { margin: '8px' },
            onClick: function onClick() {
              _this2.showModal(null, 'addActive');
            }
          },
          '\u6DFB\u52A0'
        ),
        _react2.default.createElement(
          _materialUi.Table,
          null,
          _react2.default.createElement(
            _materialUi.TableHeader,
            {
              displaySelectAll: false,
              adjustForCheckbox: false
            },
            _react2.default.createElement(
              _materialUi.TableRow,
              null,
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                'ID'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u6D3B\u52A8\u540D\u79F0'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u6D3B\u52A8\u7C7B\u578B'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u6D3B\u52A8\u529B\u5EA6'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u5F00\u59CB\u65F6\u95F4'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.smallColumn },
                '\u7ED3\u675F\u65F6\u95F4'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _GoodsListStyles.styles.bigColumn },
                '\u64CD\u4F5C'
              )
            )
          ),
          _react2.default.createElement(
            _materialUi.TableBody,
            { displayRowCheckbox: false },
            dataRow.map(function (item) {
              return _react2.default.createElement(
                _materialUi.TableRow,
                { key: item.id, selectable: false },
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.id
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.title
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  _common.activeType[item.active_type]
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.discount
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.start_time
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.smallColumn },
                  item.end_time
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _GoodsListStyles.styles.bigColumn },
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id, 'showDetail');
                      }
                    },
                    '\u67E5\u770B\u8BE6\u60C5'
                  ),
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id, 'editDetail');
                      }
                    },
                    '\u7F16\u8F91'
                  ),
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    { primary: true },
                    '\u5220\u9664'
                  )
                )
              );
            })
          )
        ),
        _react2.default.createElement(_Pagination2.default, {
          total: this.props.activeList.total,
          limit: 10,
          pageChange: this.pageChange
        }),
        _react2.default.createElement(_DetailModal2.default, {
          keyWord: this.state.keyWord,
          open: this.state.modalShow,
          handleClose: this.modalClose
        })
      );
    }
  }]);

  return ActiveList;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    activeList: state.activeList.toJS()
  };
}, function (dispatch) {
  return {
    saveActiveList: function saveActiveList(dataArr, total) {
      return dispatch(_actions.activeList.saveActiveList(dataArr, total));
    },
    pickActiveDetail: function pickActiveDetail(dataObj) {
      return dispatch(_actions.activeList.pickActiveDetail(dataObj));
    }
  };
})(ActiveList);

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _materialUi = __webpack_require__(1);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _AddActiveDetail = __webpack_require__(40);

var _AddActiveDetail2 = _interopRequireDefault(_AddActiveDetail);

var _AddActiveImage = __webpack_require__(41);

var _AddActiveImage2 = _interopRequireDefault(_AddActiveImage);

var _AddActiveGoods = __webpack_require__(42);

var _AddActiveGoods2 = _interopRequireDefault(_AddActiveGoods);

var _EditGoodsCount = __webpack_require__(43);

var _EditGoodsCount2 = _interopRequireDefault(_EditGoodsCount);

var _request = __webpack_require__(5);

var _reactRedux = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DetailModal = function (_React$Component) {
  _inherits(DetailModal, _React$Component);

  function DetailModal(props) {
    _classCallCheck(this, DetailModal);

    var _this = _possibleConstructorReturn(this, (DetailModal.__proto__ || Object.getPrototypeOf(DetailModal)).call(this, props));

    _this.handleClose = function () {
      _this.props.handleClose();
    };

    _this.getStepContent = function (stepIndex) {
      var keyWord = _this.props.keyWord;

      switch (stepIndex) {
        case 0:
          return _react2.default.createElement(_AddActiveDetail2.default, { keyWord: keyWord });
        case 1:
          return _react2.default.createElement(_AddActiveImage2.default, { keyWord: keyWord });
        case 2:
          return _react2.default.createElement(_AddActiveGoods2.default, { keyWord: keyWord });
        case 3:
          return _react2.default.createElement(_EditGoodsCount2.default, { keyWord: keyWord });
        default:
          break;
      }
    };

    _this.handlePrev = function () {
      var stepIndex = _this.state.stepIndex;

      if (stepIndex > 0) {
        _this.setState({ stepIndex: stepIndex - 1 });
      }
    };

    _this.handleNext = function () {
      var stepIndex = _this.state.stepIndex;

      if (stepIndex === 2) {
        _this.handleConfirm();
      }
      _this.setState({
        stepIndex: stepIndex === 2 ? stepIndex : stepIndex + 1
      });
    };

    _this.handleConfirm = function () {
      var queryData = _this.props.activeList.editActive;
      queryData.sort = _this.props.activeList.activeList.length + 1;
      var keyWord = _this.props.keyWord;
      var url = '';
      switch (keyWord) {
        case 'showDetail':
          return;
        case 'editDetail':
          url = 'admin/activity/edit';
          break;
        case 'addActive':
          url = 'admin/activity/add';
          break;
        default:
          return;
      }
      // 数据校验
      var title = queryData.title,
          active_type = queryData.active_type,
          discount = queryData.discount,
          start_time = queryData.start_time,
          end_time = queryData.end_time,
          goods_list = queryData.goods_list,
          goods_count = queryData.goods_count,
          image_url = queryData.image_url;


      if (!title) {
        alert('活动名不能为空！');
        return;
      }
      if (!active_type || typeof parseInt(active_type) !== 'number') {
        alert('活动类型输入有误或未输入！');
        return;
      }
      if (!discount || isNaN(parseInt(discount))) {
        alert('优惠力度输入有误或未输入');
        return;
      }
      if (!image_url) {
        alert('活动主图为必填项目');
        return;
      }

      queryData.active_type = parseInt(queryData.active_type);
      queryData.discount = parseInt(queryData.discount);

      (0, _request.request)(url, {
        method: 'POST',
        body: JSON.stringify(queryData)
      }).then(function () {});
    };

    _this.state = {
      stepIndex: 0,
      fileUrl: ''
    };
    return _this;
  }

  _createClass(DetailModal, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var keyWord = this.props.keyWord;
      var stepIndex = this.state.stepIndex;


      var modalTitle = '';
      switch (keyWord) {
        case 'showDetail':
          modalTitle = '活动详情';
          break;
        case 'editDetail':
          modalTitle = '编辑详情';
          break;
        case 'addActive':
          modalTitle = '添加活动';
          break;
        default:
          break;
      }

      var actions = [_react2.default.createElement(
        'div',
        { style: { marginTop: 12 } },
        _react2.default.createElement(_materialUi.RaisedButton, {
          label: '\u53D6\u6D88',
          onClick: this.handleClose,
          style: { marginRight: 12 }
        }),
        _react2.default.createElement(_materialUi.RaisedButton, {
          label: '\u4E0A\u4E00\u6B65',
          disabled: stepIndex === 0,
          onClick: this.handlePrev,
          style: { marginRight: 12 }
        }),
        _react2.default.createElement(_materialUi.RaisedButton, {
          label: stepIndex === 2 ? '确认提交' : '下一步',
          primary: true,
          onClick: this.handleNext
        })
      )];
      var contentStyle = { margin: '0 16px' };

      return _react2.default.createElement(
        _materialUi.Dialog,
        {
          open: this.props.open,
          actions: actions,
          autoScrollBodyContent: true,
          title: modalTitle
        },
        _react2.default.createElement(
          'div',
          { style: { width: '100%', maxWidth: 700, margin: 'auto' } },
          _react2.default.createElement(
            _materialUi.Stepper,
            { linear: false, activeStep: stepIndex },
            _react2.default.createElement(
              _materialUi.Step,
              null,
              _react2.default.createElement(
                _materialUi.StepButton,
                { onClick: function onClick() {
                    _this2.setState({
                      stepIndex: 0
                    });
                  } },
                '\u57FA\u672C\u4FE1\u606F'
              )
            ),
            _react2.default.createElement(
              _materialUi.Step,
              null,
              _react2.default.createElement(
                _materialUi.StepButton,
                { onClick: function onClick() {
                    _this2.setState({
                      stepIndex: 1
                    });
                  } },
                '\u56FE\u7247\u4E0A\u4F20'
              )
            ),
            _react2.default.createElement(
              _materialUi.Step,
              null,
              _react2.default.createElement(
                _materialUi.StepButton,
                { onClick: function onClick() {
                    _this2.setState({
                      stepIndex: 2
                    });
                  } },
                '\u9009\u5B9A\u5546\u54C1'
              )
            ),
            _react2.default.createElement(
              _materialUi.Step,
              null,
              _react2.default.createElement(
                _materialUi.StepButton,
                { onClick: function onClick() {
                    _this2.setState({
                      stepIndex: 3
                    });
                  } },
                '\u8BBE\u5B9A\u6570\u91CF'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { style: contentStyle },
            _react2.default.createElement(
              'div',
              null,
              this.getStepContent(stepIndex)
            )
          )
        )
      );
    }
  }]);

  return DetailModal;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    activeList: state.activeList.toJS(),
    categoriesList: state.categoriesList.toJS()
  };
})(DetailModal);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _materialUi = __webpack_require__(1);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

var _common = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddActiveDetail = function (_React$Component) {
  _inherits(AddActiveDetail, _React$Component);

  function AddActiveDetail(props) {
    _classCallCheck(this, AddActiveDetail);

    return _possibleConstructorReturn(this, (AddActiveDetail.__proto__ || Object.getPrototypeOf(AddActiveDetail)).call(this, props));
  }

  _createClass(AddActiveDetail, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          keyWord = _props.keyWord,
          activeList = _props.activeList;


      var isDisabled = keyWord === 'showDetail';

      var editActive = activeList.editActive;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u6D3B\u52A8\u540D\u79F0',
          floatingLabelText: '\u6D3B\u52A8\u540D\u79F0',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editActive.title || '',
          onChange: function onChange(e) {
            _this2.props.patchActiveDetail({ title: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(
          _materialUi.SelectField,
          {
            hintText: '\u8BF7\u9009\u62E9\u6D3B\u52A8\u7C7B\u578B',
            floatingLabelText: '\u6D3B\u52A8\u7C7B\u578B',
            style: { width: '100%' },
            underlineShow: false,
            disabled: isDisabled,
            value: editActive.active_type || '1',
            onChange: function onChange(e, i, v) {
              _this2.props.patchActiveDetail({ active_type: v });
            }
          },
          Object.keys(_common.activeType).map(function (item) {
            return _react2.default.createElement(_materialUi.MenuItem, { value: item, key: item, primaryText: _common.activeType[item] });
          })
        ),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(
          _materialUi.SelectField,
          {
            hintText: '\u8BF7\u9009\u62E9\u6D3B\u52A8\u4F18\u60E0\u529B\u5EA6',
            floatingLabelText: '\u4F18\u60E0\u529B\u5EA6',
            style: { width: '100%' },
            underlineShow: false,
            disabled: isDisabled,
            value: editActive.discount || '1',
            onChange: function onChange(e, i, v) {
              _this2.props.patchActiveDetail({ discount: v });
            }
          },
          Object.keys(_common.discountType).map(function (item) {
            return _react2.default.createElement(_materialUi.MenuItem, { value: item, key: item, primaryText: _common.discountType[item] });
          })
        ),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u6D3B\u52A8\u5F00\u59CB\u65F6\u95F4',
          floatingLabelText: '\u5F00\u59CB\u65F6\u95F4(yyyy-mm-dd hh:mm:ss)',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editActive.start_time || '',
          onChange: function onChange(e) {
            _this2.props.patchActiveDetail({ start_time: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null),
        _react2.default.createElement(_materialUi.TextField, {
          hintText: '\u8BF7\u8F93\u5165\u6D3B\u52A8\u7ED3\u675F\u65F6\u95F4',
          floatingLabelText: '\u7ED3\u675F\u65F6\u95F4(yyyy-mm-dd hh:mm:ss)',
          style: { width: '100%' },
          underlineShow: false,
          disabled: isDisabled,
          value: editActive.end_time || '',
          onChange: function onChange(e) {
            _this2.props.patchActiveDetail({ end_time: e.target.value });
          }
        }),
        _react2.default.createElement(_materialUi.Divider, null)
      );
    }
  }]);

  return AddActiveDetail;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    activeList: state.activeList.toJS()
  };
}, function (dispatch) {
  return {
    saveActiveList: function saveActiveList(dataArr) {
      dispatch(_actions.activeList.saveActiveList(dataArr));
    },
    patchActiveDetail: function patchActiveDetail(dataObj) {
      dispatch(_actions.activeList.patchActiveDetail(dataObj));
    }
  };
})(AddActiveDetail);

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

var _materialUi = __webpack_require__(1);

var _reactAvatarEditor = __webpack_require__(12);

var _reactAvatarEditor2 = _interopRequireDefault(_reactAvatarEditor);

var _GoodsListStyles = __webpack_require__(7);

var _upload = __webpack_require__(13);

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddActiveImage = function (_React$Component) {
  _inherits(AddActiveImage, _React$Component);

  function AddActiveImage(props) {
    _classCallCheck(this, AddActiveImage);

    var _this = _possibleConstructorReturn(this, (AddActiveImage.__proto__ || Object.getPrototypeOf(AddActiveImage)).call(this, props));

    _this.singleFileSelect = function (e) {
      var that = _this;
      var image = e.currentTarget.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = function (e) {
        that.setState({
          imgFieldOpen: true,
          fileUrl: e.target.result
        });
      };
    };

    _this.secFileSelect = function (e, key) {
      var that = _this;
      var image = e.currentTarget.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = function (e) {
        var obj = {};
        obj[key] = e.target.result;
        that.props.patchActiveDetail(obj);
      };
    };

    _this.setEditorRef = function (editor) {
      if (editor) _this.editor = editor;
    };

    _this.handleSave = function () {
      var img = _this.editor.getImageScaledToCanvas().toDataURL();
      _this.props.patchActiveDetail({ image_url: img });
      _this.setState({ imgFieldOpen: false });
    };

    _this.state = {
      fileUrl: '',
      imgFieldOpen: false
    };
    return _this;
  }

  _createClass(AddActiveImage, [{
    key: 'render',
    value: function render() {
      var editActive = this.props.activeList.editActive;
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('img', {
          src: editActive.image_url || _upload2.default,
          style: _GoodsListStyles.styles.mainImage,
          alt: _upload2.default
        }),
        _react2.default.createElement(
          _materialUi.RaisedButton,
          {
            label: '',
            primary: true,
            style: _GoodsListStyles.styles.fileSelectContent
          },
          '\u4E0A\u4F20\u56FE\u7247',
          _react2.default.createElement('input', {
            style: _GoodsListStyles.styles.fileSelect,
            type: 'file',
            accept: 'image/gif,image/jpeg,image/png',
            onChange: this.singleFileSelect
          })
        ),
        _react2.default.createElement(
          'span',
          {
            style: { marginBottom: '12px', display: 'block' }
          },
          '\u8BF7\u4E0A\u4F20\u4EA7\u54C1\u4E3B\u56FE\uFF0C\u4E3B\u56FE\u4F1A\u5728\u5C0F\u7A0B\u5E8F\u9996\u9875\u7684\u8F6E\u64AD\u56FE\u4E2D\u5C55\u793A\uFF0C\u5C3A\u5BF8\u5EFA\u8BAE\u4E3A\u5BBD\u5EA6\u4E3A528\u50CF\u7D20\uFF0C\u957F\u5EA6\u4E3A167\u50CF\u7D20\uFF0C\u56FE\u7247\u5927\u5C0F\u5EFA\u8BAE\u5C0F\u4E8E1M'
        ),
        _react2.default.createElement(
          _materialUi.Dialog,
          {
            contentStyle: { width: '668px' },
            open: this.state.imgFieldOpen },
          _react2.default.createElement(_reactAvatarEditor2.default, {
            ref: this.setEditorRef,
            onSave: this.handleSave,
            image: this.state.fileUrl,
            width: 600,
            height: 190,
            border: 10,
            color: [255, 255, 255, 0.6] // RGBA
            , scale: 1,
            rotate: 0
          }),
          _react2.default.createElement(
            _materialUi.RaisedButton,
            {
              style: { display: 'block' },
              primary: true,
              onClick: this.handleSave
            },
            '\u786E\u8BA4'
          )
        )
      );
    }
  }]);

  return AddActiveImage;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    activeList: state.activeList.toJS()
  };
}, function (dispatch) {
  return {
    patchActiveDetail: function patchActiveDetail(dataObj) {
      return dispatch(_actions.activeList.patchActiveDetail(dataObj));
    }
  };
})(AddActiveImage);

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(2);

var _materialUi = __webpack_require__(1);

var _actions = __webpack_require__(4);

var _playlistAdd = __webpack_require__(14);

var _playlistAdd2 = _interopRequireDefault(_playlistAdd);

var _GoodsListStyles = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddActiveGoods = function (_React$Component) {
  _inherits(AddActiveGoods, _React$Component);

  function AddActiveGoods(props) {
    _classCallCheck(this, AddActiveGoods);

    var _this = _possibleConstructorReturn(this, (AddActiveGoods.__proto__ || Object.getPrototypeOf(AddActiveGoods)).call(this, props));

    _this.addSpec = function () {
      if (_this.props.keyWord !== 'showDetail') _this.props.addSpec();
    };

    _this.menuOnchange = function (e, v) {
      _this.setState({
        menuSelected: v
      });
    };

    _this.goodCheck = function (e) {
      _this.props.addActiveGoods(parseInt(e.target.value));
    };

    _this.state = {
      fileUrl: '',
      imgFieldOpen: false,
      menuSelected: _this.props.categoriesList.categoriesList[0].id
    };
    return _this;
  }

  _createClass(AddActiveGoods, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var goodList = this.props.activeList.editActive.goods_list;
      var goodCount = this.props.activeList.editActive.goods_count;
      var categoriesList = this.props.categoriesList.categoriesList;
      var goodsList = this.props.goodsList.goodsList;
      var keyWord = this.props.keyWord;
      var isDisabled = keyWord === 'showDetail';
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { style: _GoodsListStyles.styles.categoryContent },
          _react2.default.createElement(
            _materialUi.Menu,
            {
              selectedMenuItemStyle: {
                backgroundColor: 'rgb(0, 188, 212)'
              },
              value: this.state.menuSelected,
              menuItemStyle: { width: '100px' },
              onChange: this.menuOnchange
            },
            categoriesList.map(function (item) {
              return _react2.default.createElement(_materialUi.MenuItem, { value: item.id, key: item.id, primaryText: item.name });
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { style: _GoodsListStyles.styles.goodsListContent },
          goodsList.map(function (item) {
            if (item.category_id === _this2.state.menuSelected) {
              return _react2.default.createElement(_materialUi.Checkbox, {
                label: item.goods_name,
                title: item.goods_name,
                value: item.id,
                key: item.id,
                style: _GoodsListStyles.styles.goodsCheckItem,
                labelStyle: _GoodsListStyles.styles.goodsCheckItem,
                checked: goodList.indexOf(item.id) >= 0,
                onCheck: _this2.goodCheck.bind(_this2)
              });
            }
          })
        )
      );
    }
  }]);

  return AddActiveGoods;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    goodsList: state.goodsList.toJS(),
    activeList: state.activeList.toJS(),
    categoriesList: state.categoriesList.toJS()
  };
}, function (dispatch) {
  return {
    addActiveGoods: function addActiveGoods(id) {
      return dispatch(_actions.activeList.addActiveGoods(id));
    }
  };
})(AddActiveGoods);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

var _materialUi = __webpack_require__(1);

var _GoodsListStyles = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditGoodsCount = function (_React$Component) {
  _inherits(EditGoodsCount, _React$Component);

  function EditGoodsCount(props) {
    _classCallCheck(this, EditGoodsCount);

    var _this = _possibleConstructorReturn(this, (EditGoodsCount.__proto__ || Object.getPrototypeOf(EditGoodsCount)).call(this, props));

    _this.addSpec = function () {
      if (_this.props.keyWord !== 'showDetail') _this.props.addSpec();
    };

    _this.state = {
      fileUrl: '',
      imgFieldOpen: false
    };
    return _this;
  }

  _createClass(EditGoodsCount, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var editActive = this.props.activeList.editActive;
      var goodsList = this.props.goodsList.goodsList;
      var goods_list = editActive.goods_list;
      var goods_count = editActive.goods_count;
      var goods_name = [];
      goods_list.forEach(function (item) {
        for (var i = 0; i < goodsList.length; i++) {
          if (goodsList[i].id === item) {
            goods_name.push(goodsList[i].goods_name);
          }
        }
      });

      var keyWord = this.props.keyWord;
      var isDisabled = keyWord === 'showDetail';
      return _react2.default.createElement(
        'div',
        null,
        goods_name.map(function (item, idx) {
          return _react2.default.createElement(
            'div',
            { style: _GoodsListStyles.styles.specItem },
            _react2.default.createElement(_materialUi.TextField, {
              hintText: '\u5546\u54C1\u540D',
              floatingLabelText: '\u5546\u54C1\u540D',
              value: item,
              key: idx,
              disabled: true,
              onChange: function onChange(e) {
                _this2.props.editSpec(idx, { key: e.target.value });
              },
              style: _GoodsListStyles.styles.specKey
            }),
            ':',
            _react2.default.createElement(_materialUi.TextField, {
              hintText: '\u8BF7\u8F93\u5165\u5546\u54C1\u6570\u91CF',
              floatingLabelText: '\u5546\u54C1\u6570\u91CF',
              value: goods_count[idx],
              disabled: isDisabled,
              onChange: function onChange(e) {
                _this2.props.editSpec(idx, { value: e.target.value });
              },
              style: _GoodsListStyles.styles.specValue
            })
          );
        }),
        _react2.default.createElement(
          'div',
          { style: { width: '100%', padding: '12px 46px', boxSizing: 'border-box' } },
          _react2.default.createElement(
            'span',
            {
              style: { display: 'inline-block', marginTop: 12 }
            },
            '\u9700\u8981\u6DFB\u52A0\u65B0\u7684\u89C4\u683C\u4FE1\u606F\uFF0C\u70B9\u51FB\u6DFB\u52A0\u6309\u94AE\uFF0C\u5DE6\u4FA7\u586B\u5199\u89C4\u683C\u6807\u9898\uFF0C\u53F3\u4FA7\u586B\u5199\u89C4\u683C\u4FE1\u606F\uFF01'
          )
        )
      );
    }
  }]);

  return EditGoodsCount;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    activeList: state.activeList.toJS(),
    goodsList: state.goodsList.toJS()
  };
}, function (dispatch) {
  return {};
})(EditGoodsCount);

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _request = __webpack_require__(5);

var _common = __webpack_require__(6);

var _materialUi = __webpack_require__(1);

var _OrderListStyles = __webpack_require__(45);

var _reactRedux = __webpack_require__(2);

var _actions = __webpack_require__(4);

var _Pagination = __webpack_require__(10);

var _Pagination2 = _interopRequireDefault(_Pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OrderList = function (_React$Component) {
  _inherits(OrderList, _React$Component);

  function OrderList(props) {
    _classCallCheck(this, OrderList);

    var _this = _possibleConstructorReturn(this, (OrderList.__proto__ || Object.getPrototypeOf(OrderList)).call(this, props));

    _this.pageChange = function (index) {
      var that = _this;
      (0, _request.request)('admin/order/order-list', {}, { limit: 10, offset: (index - 1) * 10 }).then(function (res) {
        if (res.retCode === 0) {
          that.props.saveOrdersList(res.data.dataArr, res.data.total);
        }
      });
    };

    _this.refund = function (orderNo) {
      (0, _request.request)('admin/order/refund', {
        method: 'POST',
        body: JSON.stringify({ orderNo: orderNo })
      }).then(function (res) {
        if (res.retCode === 0) {
          alert('退款成功');
        }
      });
    };

    _this.deliver = function () {
      var _this$state = _this.state,
          orderId = _this$state.orderId,
          trackingNo = _this$state.trackingNo;

      (0, _request.request)('admin/order/send/' + orderId, {
        method: 'PATCH',
        body: JSON.stringify({ trackingNo: trackingNo })
      }).then(function (res) {
        if (res.retCode === 0) {
          alert('确认发货');
        }
      });
    };

    _this.handleClose = function () {
      _this.setState({
        modalShow: false
      });
    };

    _this.showModal = function (id) {
      var that = _this;
      var ordersList = _this.props.ordersList.ordersList;
      ordersList.forEach(function (item) {
        if (item.id === id) {
          that.setState({
            modalShow: true,
            method: 'detail'
          }, function () {
            that.props.pickOrderDetail(item);
          });
        }
      });
    };

    _this.openDeliver = function (id) {
      _this.setState({
        orderId: id,
        modalShow: true,
        method: 'deliver'
      });
    };

    _this.state = {
      showData: {},
      modalShow: false,
      keyWord: ''
    };
    return _this;
  }

  _createClass(OrderList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var that = this;
      (0, _request.request)('admin/order/order-list', {}, { limit: 10, offset: 0 }).then(function (res) {
        if (res.retCode === 0) {
          that.props.saveOrdersList(res.data.dataArr, res.data.total);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var dataRow = this.props.ordersList.ordersList;
      var orderDetail = this.props.ordersList.orderDetail;
      var detailAddr = orderDetail.userAddressInfo;
      var addressDetail = detailAddr ? '' + detailAddr.province + (detailAddr.province === detailAddr.city ? '' : detailAddr.city) + '\n    ' + detailAddr.district + detailAddr.detail : '';
      var actions = [_react2.default.createElement(_materialUi.RaisedButton, {
        label: '\u53D6\u6D88',
        onClick: this.handleClose,
        style: { marginRight: 12 }
      }), this.state.method === 'deliver' ? _react2.default.createElement(_materialUi.RaisedButton, {
        label: '\u786E\u5B9A',
        onClick: this.deliver,
        style: { marginRight: 12 }
      }) : null];
      return _react2.default.createElement(
        _materialUi.Paper,
        null,
        _react2.default.createElement(
          _materialUi.Table,
          null,
          _react2.default.createElement(
            _materialUi.TableHeader,
            {
              displaySelectAll: false,
              adjustForCheckbox: false
            },
            _react2.default.createElement(
              _materialUi.TableRow,
              null,
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _OrderListStyles.styles.smallColumn },
                'ID'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _OrderListStyles.styles.smallColumn },
                '\u6536\u8D27\u4EBA'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _OrderListStyles.styles.middleColumn },
                '\u7535\u8BDD'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _OrderListStyles.styles.middleColumn },
                '\u6536\u8D27\u5730\u5740'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _OrderListStyles.styles.smallColumn },
                '\u8BA2\u5355\u72B6\u6001'
              ),
              _react2.default.createElement(
                _materialUi.TableHeaderColumn,
                { style: _OrderListStyles.styles.middleColumn },
                '\u64CD\u4F5C'
              )
            )
          ),
          _react2.default.createElement(
            _materialUi.TableBody,
            { displayRowCheckbox: false },
            dataRow.map(function (item) {
              var address = item.userAddressInfo;
              var addressDetail = '' + address.province + (address.province === address.city ? '' : address.city) + '\n                ' + address.district + address.detail;
              return _react2.default.createElement(
                _materialUi.TableRow,
                { key: item.id, selectable: false },
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _OrderListStyles.styles.smallColumn },
                  item.id
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _OrderListStyles.styles.smallColumn },
                  address.receiver
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _OrderListStyles.styles.middleColumn },
                  _react2.default.createElement(
                    'span',
                    { title: address.phone },
                    address.phone
                  )
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _OrderListStyles.styles.middleColumn },
                  _react2.default.createElement(
                    'span',
                    { title: addressDetail },
                    addressDetail
                  )
                ),
                _react2.default.createElement(
                  _materialUi.TableHeaderColumn,
                  { style: _OrderListStyles.styles.smallColumn },
                  _common.status[item.status]
                ),
                _react2.default.createElement(
                  _materialUi.TableRowColumn,
                  { style: _OrderListStyles.styles.middleColumn },
                  _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.showModal(item.id);
                      }
                    },
                    '\u67E5\u770B\u8BE6\u60C5'
                  ),
                  item.status === 4 ? _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.refund(item.orderNo);
                      }
                    },
                    '\u786E\u8BA4\u9000\u8D27'
                  ) : null,
                  item.status === 2 ? _react2.default.createElement(
                    _materialUi.RaisedButton,
                    {
                      primary: true,
                      onClick: function onClick() {
                        _this2.openDeliver(item.id);
                      }
                    },
                    '\u786E\u8BA4\u53D1\u8D27'
                  ) : null
                )
              );
            })
          )
        ),
        _react2.default.createElement(_Pagination2.default, {
          total: this.props.ordersList.ordersTotal,
          limit: 10,
          pageChange: this.pageChange
        }),
        _react2.default.createElement(
          _materialUi.Dialog,
          {
            open: this.state.modalShow,
            actions: actions
          },
          this.state.method === 'deliver' ? _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(_materialUi.TextField, {
              hintText: '\u8BF7\u8F93\u5165\u5FEB\u9012\u5355\u53F7',
              floatingLabelText: '\u5FEB\u9012\u5355\u53F7',
              style: { width: '100%' },
              value: this.state.trackingNo || '',
              onChange: function onChange(e) {
                _this2.setState({
                  trackingNo: e.target.value
                });
              }
            })
          ) : _react2.default.createElement(
            _materialUi.List,
            null,
            _react2.default.createElement(_materialUi.ListItem, { primaryText: '\u8BA2\u5355\u65F6\u95F4: ' + orderDetail.createTime }),
            _react2.default.createElement(_materialUi.ListItem, { primaryText: '\u8BA2\u5355\u4EF7\u683C: ' + orderDetail.actual_price / 100 }),
            _react2.default.createElement(_materialUi.ListItem, { primaryText: '\u8BA2\u5355\u539F\u4EF7: ' + orderDetail.original_price / 100 }),
            _react2.default.createElement(_materialUi.ListItem, { primaryText: '\u53D1\u8D27\u5730\u5740: ' + addressDetail }),
            _react2.default.createElement(_materialUi.ListItem, { primaryText: '\u5FEB\u9012\u5355\u53F7: ' + (orderDetail.trackingNo || '未发货') })
          )
        )
      );
    }
  }]);

  return OrderList;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    ordersList: state.ordersList.toJS()
  };
}, function (dispatch) {
  return {
    saveOrdersList: function saveOrdersList(dataArr, total) {
      return dispatch(_actions.ordersList.saveOrderList(dataArr, total));
    },
    pickOrderDetail: function pickOrderDetail(dataObj) {
      return dispatch(_actions.ordersList.pickOrderDetail(dataObj));
    }
  };
})(OrderList);

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.styles = {
  smallColumn: {
    width: '20px',
    textAlign: 'center',
    boxSizing: 'border-box'
  },
  bigColumn: {
    width: '100px',
    textAlign: 'center'
  },
  middleColumn: {
    width: '80px',
    textAlign: 'center'
  },
  secImageItem: {
    marginTop: '12px',
    width: 150,
    float: 'left',
    marginRight: 12
  },
  fileSelect: {
    opacity: 0,
    filter: 'alpha(opacity=0)',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  fileSelectContent: {
    marginRight: 12,
    display: 'block',
    width: '150px',
    position: 'relative',
    marginBottom: '12px'
  },
  mainImage: {
    width: 300,
    height: 214,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block'
  },
  detailImage: {
    width: 150,
    height: 200,
    marginBottom: '12px',
    backgroundColor: '#fff',
    display: 'block',
    marginRight: '12px'
  },
  specKey: {
    width: 150,
    marginRight: 12
  },
  specValue: {
    width: 300,
    marginLeft: 12
  },
  specItem: {
    width: 500,
    margin: '0 auto'
  },
  specAddBtn: {
    width: 100,
    height: 40,
    borderRadius: '2%'
  }
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _materialUi = __webpack_require__(1);

var _LoginStyle = __webpack_require__(47);

var _request = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login(props) {
    _classCallCheck(this, Login);

    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

    _this.inputChange = function (key) {
      var obj = {};
      return function (e) {
        obj[key] = e.target.value;
        _this.setState(obj);
      };
    };

    _this.clickLogin = function () {
      var _this$state = _this.state,
          username = _this$state.username,
          password = _this$state.password;

      var that = _this;
      (0, _request.request)('admin/admin-info', {
        method: 'POST',
        body: JSON.stringify({
          admin: username,
          password: password
        })
      }).then(function (res) {
        if (res.retCode === 0) {
          localStorage.setItem('token', res.token);
          that.props.history.push('/main/goodsList');
        } else {
          alert(res.msg);
        }
      });
    };

    _this.state = {
      username: '',
      password: ''
    };
    return _this;
  }

  _createClass(Login, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { style: _LoginStyle.styles.title },
          '\u5C0F\u7A0B\u5E8F\u540E\u53F0\u6570\u636E\u7EF4\u62A4\u7CFB\u7EDF'
        ),
        _react2.default.createElement(_materialUi.TextField, {
          style: _LoginStyle.styles.input,
          hintText: '\u8BF7\u8F93\u5165\u7528\u6237\u540D',
          floatingLabelText: '\u7528\u6237\u540D',
          value: this.state.username,
          onChange: this.inputChange('username')
        }),
        _react2.default.createElement(_materialUi.TextField, {
          style: _LoginStyle.styles.input,
          hintText: '\u8BF7\u8F93\u5165\u5BC6\u7801',
          floatingLabelText: '\u5BC6\u7801',
          value: this.state.password,
          type: 'password',
          onChange: this.inputChange('password')
        }),
        _react2.default.createElement(_materialUi.RaisedButton, {
          style: _LoginStyle.styles.button,
          label: '\u786E\u5B9A\u767B\u9646',
          primary: true,
          onClick: this.clickLogin
        }),
        _react2.default.createElement(
          'span',
          { style: _LoginStyle.styles.tips },
          '\u5982\u679C\u767B\u9646\u6709\u95EE\u9898\u8BF7\u8054\u7CFB\u6280\u672F\u4EBA\u5458\u3002'
        )
      );
    }
  }]);

  return Login;
}(_react2.default.Component);

exports.default = Login;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports.styles = {
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 100,
    color: '#ccc'
  },
  input: {
    display: 'block',
    margin: '10px auto'
  },
  button: {
    display: 'block',
    margin: '30px auto',
    width: 256,
    height: 40
  },
  tips: {
    fontSize: 14,
    display: 'block',
    textAlign: 'center',
    color: '#ccc'
  }
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__(15);

var _goodsList = __webpack_require__(49);

var _goodsList2 = _interopRequireDefault(_goodsList);

var _categoriesList = __webpack_require__(50);

var _categoriesList2 = _interopRequireDefault(_categoriesList);

var _ordersList = __webpack_require__(51);

var _ordersList2 = _interopRequireDefault(_ordersList);

var _activeList = __webpack_require__(52);

var _activeList2 = _interopRequireDefault(_activeList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var smallApp = (0, _redux.combineReducers)({
  goodsList: _goodsList2.default,
  categoriesList: _categoriesList2.default,
  ordersList: _ordersList2.default,
  activeList: _activeList2.default
});

exports.default = smallApp;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = __webpack_require__(8);

var iniState = {
  goodsList: [],
  editGood: {
    goods_name: '',
    goods_image: '',
    goods_type_id: 0,
    goods_collect: 0,
    category_id: 0,
    goods_jingle: '',
    goods_price: 0,
    goods_marketprice: 0,
    goods_serial: '',
    goods_click: 0,
    goods_salenum: 0,
    goods_spec: [],
    goods_storage: 0,
    goods_state: 0,
    goods_verify: 0,
    create_time: '',
    update_time: '',
    goods_freight: 0,
    evaluation_good_star: 0,
    evaluation_count: 0
  }
};

var goodsList = function goodsList() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.fromJS)(iniState);
  var action = arguments[1];

  switch (action.type) {
    case 'SAVE_GOODS_LIST':
      return state.merge((0, _immutable.fromJS)({ goodsList: action.dataArr, goodsTotal: action.total }));
    case 'PATCH_GOOD_DETAIL':
      return state.mergeDeep((0, _immutable.fromJS)({ editGood: action.dataObj }));
    case 'PICK_GOOD_DETAIL':
      return state.set('editGood', (0, _immutable.fromJS)(action.dataObj));
    case 'PATCH_GOODS_LIST':
      return state;
    case 'ADD_SPEC':
      return state.updateIn(['editGood', 'goods_spec'], function (arr) {
        return arr.push((0, _immutable.fromJS)({ key: '', value: '' }));
      });
    case 'EDIT_SPEC':
      return state.updateIn(['editGood', 'goods_spec', action.index], function (value) {
        return value.merge(action.dataObj);
      });
    default:
      return state;
  }
};

exports.default = goodsList;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = __webpack_require__(8);

var iniState = {
  categoriesList: []
};

var categoriesList = function categoriesList() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.fromJS)(iniState);
  var action = arguments[1];

  switch (action.type) {
    case 'SAVE_CATEGORIES_LIST':
      return state.set('categoriesList', action.dataArr);
    case 'PATCH_GOOD_DETAIL':
      return state;
    case 'PATCH_GOODS_LIST':
      return state;
    default:
      return state;
  }
};

exports.default = categoriesList;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = __webpack_require__(8);

var iniState = {
  ordersList: [],
  orderDetail: {},
  ordersTotal: 0
};

var goodsList = function goodsList() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.fromJS)(iniState);
  var action = arguments[1];

  switch (action.type) {
    case 'SAVE_ORDER_LIST':
      return state.merge((0, _immutable.fromJS)({ ordersList: action.dataArr, ordersTotal: action.total }));
    case 'PICK_ORDER_DETAIL':
      return state.set('orderDetail', (0, _immutable.fromJS)(action.dataObj));
    default:
      return state;
  }
};

exports.default = goodsList;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = __webpack_require__(8);

var iniState = {
  activeList: [],
  editActive: {
    discount: 9,
    goods_list: [],
    goods_count: [],
    start_time: null,
    image_url: "https://image.qaformath.com/computer_superapp/banner01.jpg",
    create_time: "2017-10-16 16:10:14",
    end_time: null,
    active_type: 3,
    title: "丢丢丢",
    id: 4,
    sort: 4

  }
};

var activeList = function activeList() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.fromJS)(iniState);
  var action = arguments[1];

  switch (action.type) {
    case 'SAVE_ACTIVE_LIST':
      return state.merge((0, _immutable.fromJS)({ activeList: action.dataArr, total: action.total }));
    case 'PICK_ACTIVE_DETAIL':
      return state.set('editActive', (0, _immutable.fromJS)(action.dataObj));
    case 'PATCH_ACTIVE_DETAIL':
      return state.mergeDeep((0, _immutable.fromJS)({ editActive: action.dataObj }));
    case 'PATCH_ACTIVE_LIST':
      return state;
    case 'ADD_ACTIVE_GOODS':
      var index = state.getIn(['editActive', 'goods_list']).indexOf(action.id);
      if (index >= 0) {
        state = state.updateIn(['editActive', 'goods_list'], function (arr) {
          return arr.delete(index);
        });
        state = state.updateIn(['editActive', 'goods_count'], function (arr) {
          return arr.delete(index);
        });
      } else {
        state = state.updateIn(['editActive', 'goods_list'], function (arr) {
          return arr.push(action.id);
        });
        state = state.updateIn(['editActive', 'goods_count'], function (arr) {
          return arr.push(1);
        });
      }
      return state;
    case 'EDIT_ACTIVE_GOODS':
      return state;
    default:
      return state;
  }
};

exports.default = activeList;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWM5NDNiNmJlOTZjZmNlMzM3MWQiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC9yZWFjdC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzdlYzQzMjk2YjU3MmI0N2Q1YmE1Iiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvbWF0ZXJpYWwtdWkvaW5kZXguZXMuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNSIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LXJlZHV4L2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfN2VjNDMyOTZiNTcyYjQ3ZDViYTUiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidmVuZG9yXzdlYzQzMjk2YjU3MmI0N2Q1YmE1XCIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9yZXF1ZXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2ZUxpc3QvR29vZHNMaXN0U3R5bGVzLmpzIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvaW1tdXRhYmxlL2Rpc3QvaW1tdXRhYmxlLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfN2VjNDMyOTZiNTcyYjQ3ZDViYTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvZ29vZHNMaXN0L0dvb2RzTGlzdFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jb21tb24vUGFnaW5hdGlvbi5qcyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci1kb20vZXMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNSIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LWF2YXRhci1lZGl0b3IvZGlzdC9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzdlYzQzMjk2YjU3MmI0N2Q1YmE1Iiwid2VicGFjazovLy8uL3NyYy9jb21tb24vaW1hZ2UvdXBsb2FkLnBuZyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWF0ZXJpYWwtdWkvc3ZnLWljb25zL2F2L3BsYXlsaXN0LWFkZC5qcyIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlZHV4L2VzL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfN2VjNDMyOTZiNTcyYjQ3ZDViYTUiLCJ3ZWJwYWNrOi8vLy4vcHJpbnQuanMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNSIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL21hdGVyaWFsLXVpL3N0eWxlcy9NdWlUaGVtZVByb3ZpZGVyLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfN2VjNDMyOTZiNTcyYjQ3ZDViYTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0hlYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jb21tb24vSGVhZGVyU3R5bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaG90TGlzdC9Ib3RMaXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2hvdExpc3QvR29vZHNMaXN0U3R5bGVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2dvb2RzTGlzdC9Hb29kc0xpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvZ29vZHNMaXN0L0RldGFpbE1vZGFsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2dvb2RzTGlzdC9BZGRHb29kc0RldGFpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9nb29kc0xpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvY2F0ZWdvcmllc0xpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvb3JkZXJzTGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9hY3RpdmVMaXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2dvb2RzTGlzdC9BZGRJbWFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9nb29kc0xpc3QvQWRkR29vZFNwZWMuanMiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWNvbXBvc2UvcHVyZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzdlYzQzMjk2YjU3MmI0N2Q1YmE1Iiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvbWF0ZXJpYWwtdWkvU3ZnSWNvbi9pbmRleC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzdlYzQzMjk2YjU3MmI0N2Q1YmE1Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9QYWdlU3R5bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2F0ZWdvcnkvQ2F0ZWdvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY2F0ZWdvcnkvR29vZHNMaXN0U3R5bGVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2ZUxpc3QvQWN0aXZlTGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hY3RpdmVMaXN0L0RldGFpbE1vZGFsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2ZUxpc3QvQWRkQWN0aXZlRGV0YWlsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FjdGl2ZUxpc3QvQWRkQWN0aXZlSW1hZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYWN0aXZlTGlzdC9BZGRBY3RpdmVHb29kcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hY3RpdmVMaXN0L0VkaXRHb29kc0NvdW50LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL29yZGVyTGlzdC9PcmRlckxpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvb3JkZXJMaXN0L09yZGVyTGlzdFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9jb21tb24vTG9naW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0xvZ2luU3R5bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlZHVjZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9yZWR1Y2Vycy9nb29kc0xpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlZHVjZXJzL2NhdGVnb3JpZXNMaXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9yZWR1Y2Vycy9vcmRlcnNMaXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9yZWR1Y2Vycy9hY3RpdmVMaXN0LmpzIl0sIm5hbWVzIjpbImdvb2RzTGlzdCIsImNhdGVnb3JpZXNMaXN0Iiwib3JkZXJzTGlzdCIsImFjdGl2ZUxpc3QiLCJtb2R1bGUiLCJleHBvcnRzIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwicmVxdWVzdCIsInVybCIsIm9wdGlvbiIsImRhdGEiLCJxdWVyeVN0cmluZyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwidmFsdWUiLCJvcHQiLCJhc3NpZ24iLCJoZWFkZXJzIiwibWV0aG9kIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmZXRjaCIsImFwaVByZWZpeCIsInRoZW4iLCJyZXNwb25zZSIsInN0YXR1cyIsImpzb24iLCJyZXMiLCJyZXRDb2RlIiwiYWxlcnQiLCJtc2ciLCJyZW1vdmVJdGVtIiwiY2F0Y2giLCJub0RhdGFHb29kIiwiZ29vZHNfbmFtZSIsImdvb2RzX2ltYWdlIiwiZ29vZHNfdHlwZV9pZCIsImdvb2RzX2NvbGxlY3QiLCJjYXRlZ29yeV9pZCIsImdvb2RzX2ppbmdsZSIsImdvb2RzX3ByaWNlIiwiZ29vZHNfbWFya2V0cHJpY2UiLCJnb29kc19zZXJpYWwiLCJnb29kc19jbGljayIsImdvb2RzX3NhbGVudW0iLCJnb29kc19zcGVjIiwiZ29vZHNfc3RvcmFnZSIsImdvb2RzX3N0YXRlIiwiZ29vZHNfdmVyaWZ5IiwiY3JlYXRlX3RpbWUiLCJ1cGRhdGVfdGltZSIsImdvb2RzX2ZyZWlnaHQiLCJldmFsdWF0aW9uX2dvb2Rfc3RhciIsImV2YWx1YXRpb25fY291bnQiLCJhY3RpdmVUeXBlIiwibm9EYXRhQWN0aXZlIiwiZGlzY291bnQiLCJnb29kc19saXN0IiwiZ29vZHNfY291bnQiLCJzdGFydF90aW1lIiwiaW1hZ2VfdXJsIiwiZW5kX3RpbWUiLCJhY3RpdmVfdHlwZSIsInRpdGxlIiwiaWQiLCJzb3J0IiwiZGlzY291bnRUeXBlIiwic3R5bGVzIiwic21hbGxDb2x1bW4iLCJ3aWR0aCIsInRleHRBbGlnbiIsImJveFNpemluZyIsImJpZ0NvbHVtbiIsIm1pZGRsZUNvbHVtbiIsInNlY0ltYWdlSXRlbSIsIm1hcmdpblRvcCIsImZsb2F0IiwibWFyZ2luUmlnaHQiLCJmaWxlU2VsZWN0Iiwib3BhY2l0eSIsImZpbHRlciIsImN1cnNvciIsImhlaWdodCIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsImZpbGVTZWxlY3RDb250ZW50IiwiZGlzcGxheSIsIm1hcmdpbiIsIm1haW5JbWFnZSIsIm1hcmdpbkJvdHRvbSIsImJhY2tncm91bmRDb2xvciIsImRldGFpbEltYWdlIiwic3BlY0tleSIsInNwZWNWYWx1ZSIsIm1hcmdpbkxlZnQiLCJzcGVjSXRlbSIsInNwZWNBZGRCdG4iLCJib3JkZXJSYWRpdXMiLCJjYXRlZ29yeUNvbnRlbnQiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJnb29kc0xpc3RDb250ZW50IiwiZ29vZHNDaGVja0l0ZW0iLCJvdmVyZmxvdyIsInRleHRPdmVyZmxvdyIsIndoaXRlU3BhY2UiLCJQYWdpbmF0aW9uIiwicHJvcHMiLCJwYXJzZVBhZ2UiLCJwYWdlcyIsImluZGV4IiwiaSIsInB1c2giLCJza2lwVG8iLCJ0aGF0Iiwic2V0U3RhdGUiLCJwYWdlQ2hhbmdlIiwic3RhdGUiLCJ0b3RhbCIsImxpbWl0IiwiTWF0aCIsImNlaWwiLCJwYWdlQnV0dG9ucyIsInBhZ2VDb250YWluZXIiLCJidXR0b24iLCJtYXAiLCJpdGVtIiwiQ29tcG9uZW50IiwicHJpbnRNZSIsImNvbnNvbGUiLCJsb2ciLCJzdG9yZSIsIl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18iLCJyZW5kZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaG90IiwiYWNjZXB0IiwiSGVhZGVyIiwibWVudU9uY2hhbmdlIiwiZSIsInYiLCJtZW51U2VsZWN0ZWQiLCJoaXN0b3J5IiwibG9nb3V0IiwicmVwbGFjZSIsInBhdGhOYW1lIiwicGF0aG5hbWUiLCJzcGxpdCIsInRpdGxlQmFyQ29udGVudCIsInRpdGxlQmFyIiwicGFwZXJTdHlsZSIsIm1lbnUiLCJ0YWJsZUNvbnRhaW5lciIsIm1heFdpZHRoIiwiYm94U2hhZG93IiwibWFpbkNvbnRhaW5lciIsIkhvdExpc3QiLCJvZmZzZXQiLCJkYXRhUm93Iiwic2hvd01vZGFsIiwiR29vZHNMaXN0Iiwia2V5IiwicGlja0dvb2REZXRhaWwiLCJrZXlXb3JkIiwibW9kYWxTaG93IiwibW9kYWxDbG9zZSIsInNhdmVHb29kc0xpc3QiLCJkYXRhQXJyIiwic2hvd0RhdGEiLCJzYXZlQ2F0ZWdvcmllc0xpc3QiLCJnb29kc1RvdGFsIiwidG9KUyIsImRpc3BhdGNoIiwiZGF0YU9iaiIsIkRldGFpbE1vZGFsIiwiaGFuZGxlQ2xvc2UiLCJnZXRTdGVwQ29udGVudCIsInN0ZXBJbmRleCIsImhhbmRsZVByZXYiLCJoYW5kbGVOZXh0IiwiaGFuZGxlQ29uZmlybSIsInF1ZXJ5RGF0YSIsImVkaXRHb29kIiwiZ29vZHNTcGVjIiwicGFyc2VJbnQiLCJpc05hTiIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiZmlsZVVybCIsIm1vZGFsVGl0bGUiLCJhY3Rpb25zIiwiY29udGVudFN0eWxlIiwib3BlbiIsIkFkZEdvb2RzRGV0YWlsIiwiaXNEaXNhYmxlZCIsInBhdGNoR29vZERldGFpbCIsInRhcmdldCIsIm5hbWUiLCJkaXNwYXRjaFNhdmVHb29kc0xpc3QiLCJ0eXBlIiwicGF0Y2hHb29kc0xpc3QiLCJhZGRTcGVjIiwiZWRpdFNwZWMiLCJzYXZlT3JkZXJMaXN0IiwicGlja09yZGVyRGV0YWlsIiwicGF0Y2hPcmRlckxpc3QiLCJzYXZlQWN0aXZlTGlzdCIsInBpY2tBY3RpdmVEZXRhaWwiLCJwYXRjaEFjdGl2ZURldGFpbCIsInBhdGNoQWN0aXZlTGlzdCIsImFkZEFjdGl2ZUdvb2RzIiwiZWRpdEFjdGl2ZUdvb2RzIiwibnVtYmVyIiwiQWRkSW1hZ2UiLCJzaW5nbGVGaWxlU2VsZWN0IiwiaW1hZ2UiLCJjdXJyZW50VGFyZ2V0IiwiZmlsZXMiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwicmVhZEFzRGF0YVVSTCIsIm9ubG9hZCIsImltZ0ZpZWxkT3BlbiIsInJlc3VsdCIsInNlY0ZpbGVTZWxlY3QiLCJvYmoiLCJzZXRFZGl0b3JSZWYiLCJlZGl0b3IiLCJoYW5kbGVTYXZlIiwiaW1nIiwiZ2V0SW1hZ2VTY2FsZWRUb0NhbnZhcyIsInRvRGF0YVVSTCIsImltYWdlMSIsImltYWdlMiIsImltYWdlMyIsIkFkZEdvb2RTcGVjIiwiZ29vZFNwZWMiLCJpZHgiLCJwYWRkaW5nIiwibWluV2lkdGgiLCJDYXRlZ29yeSIsIkFjdGl2ZUxpc3QiLCJlZGl0QWN0aXZlIiwibGVuZ3RoIiwiQWRkQWN0aXZlRGV0YWlsIiwiQWRkQWN0aXZlSW1hZ2UiLCJBZGRBY3RpdmVHb29kcyIsImdvb2RDaGVjayIsImdvb2RMaXN0IiwiZ29vZENvdW50IiwiaW5kZXhPZiIsImJpbmQiLCJFZGl0R29vZHNDb3VudCIsIk9yZGVyTGlzdCIsInNhdmVPcmRlcnNMaXN0IiwicmVmdW5kIiwib3JkZXJObyIsImRlbGl2ZXIiLCJvcmRlcklkIiwidHJhY2tpbmdObyIsIm9wZW5EZWxpdmVyIiwib3JkZXJEZXRhaWwiLCJkZXRhaWxBZGRyIiwidXNlckFkZHJlc3NJbmZvIiwiYWRkcmVzc0RldGFpbCIsInByb3ZpbmNlIiwiY2l0eSIsImRpc3RyaWN0IiwiZGV0YWlsIiwiYWRkcmVzcyIsInJlY2VpdmVyIiwicGhvbmUiLCJvcmRlcnNUb3RhbCIsImNyZWF0ZVRpbWUiLCJhY3R1YWxfcHJpY2UiLCJvcmlnaW5hbF9wcmljZSIsIkxvZ2luIiwiaW5wdXRDaGFuZ2UiLCJjbGlja0xvZ2luIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImFkbWluIiwic2V0SXRlbSIsImlucHV0IiwidGlwcyIsImZvbnRTaXplIiwiY29sb3IiLCJzbWFsbEFwcCIsImluaVN0YXRlIiwiYWN0aW9uIiwibWVyZ2UiLCJtZXJnZURlZXAiLCJzZXQiLCJ1cGRhdGVJbiIsImFyciIsImdldEluIiwiZGVsZXRlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQTtBQUNBLG9DQUE0QjtBQUM1QixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOENBQXNDO0FBQ3RDO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUFpQiw4QkFBOEI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBLDREQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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TztBQUNMTyxnQkFBUUEsTUFBTWtMLFFBQU4sQ0FBZSxDQUFDLFlBQUQsRUFBZSxZQUFmLENBQWYsRUFBNkM7QUFBQSxpQkFBT0MsSUFBSXhMLElBQUosQ0FBU21MLE9BQU9wTyxFQUFoQixDQUFQO0FBQUEsU0FBN0MsQ0FBUjtBQUNBc0QsZ0JBQVFBLE1BQU1rTCxRQUFOLENBQWUsQ0FBQyxZQUFELEVBQWUsYUFBZixDQUFmLEVBQThDO0FBQUEsaUJBQU9DLElBQUl4TCxJQUFKLENBQVMsQ0FBVCxDQUFQO0FBQUEsU0FBOUMsQ0FBUjtBQUNEO0FBQ0QsYUFBT0ssS0FBUDtBQUNGLFNBQUssbUJBQUw7QUFDRSxhQUFPQSxLQUFQO0FBQ0Y7QUFDRSxhQUFPQSxLQUFQO0FBdEJKO0FBd0JELENBekJEOztrQkEyQmUxSCxVIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXF1ZXN0VGltZW91dCA9IHJlcXVlc3RUaW1lb3V0IHx8IDEwMDAwO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IHJlcXVlc3RUaW1lb3V0O1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI5Yzk0M2I2YmU5NmNmY2UzMzcxZFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xyXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXHJcbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XHJcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XHJcbiBcdFx0XHR9KS50aGVuKFxyXG4gXHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHQpO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdFx0aWYoY2IpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMTcpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDE3KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5Yzk0M2I2YmU5NmNmY2UzMzcxZCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDEpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWFjdC9yZWFjdC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzdlYzQzMjk2YjU3MmI0N2Q1YmE1XG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDM1OCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL21hdGVyaWFsLXVpL2luZGV4LmVzLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfN2VjNDMyOTZiNTcyYjQ3ZDViYTVcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoNjE2KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVhY3QtcmVkdXgvZXMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNVxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNVwiXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIGdvb2RzTGlzdCBmcm9tICcuL2dvb2RzTGlzdCc7XG5pbXBvcnQgKiBhcyBjYXRlZ29yaWVzTGlzdCBmcm9tICcuL2NhdGVnb3JpZXNMaXN0JztcbmltcG9ydCAqIGFzIG9yZGVyc0xpc3QgZnJvbSAnLi9vcmRlcnNMaXN0JztcbmltcG9ydCAqIGFzIGFjdGl2ZUxpc3QgZnJvbSAnLi9hY3RpdmVMaXN0JztcblxubW9kdWxlLmV4cG9ydHMuZ29vZHNMaXN0ID0gZ29vZHNMaXN0O1xubW9kdWxlLmV4cG9ydHMuY2F0ZWdvcmllc0xpc3QgPSBjYXRlZ29yaWVzTGlzdDtcbm1vZHVsZS5leHBvcnRzLm9yZGVyc0xpc3QgPSBvcmRlcnNMaXN0O1xubW9kdWxlLmV4cG9ydHMuYWN0aXZlTGlzdCA9IGFjdGl2ZUxpc3Q7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FjdGlvbnMvaW5kZXguanMiLCJpbXBvcnQgY29tbW9uIGZyb20gJy4vY29tbW9uJztcblxuY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKSB8fCAnJztcblxuaWYgKCF0b2tlbikge1xuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbG9naW4nO1xufSBlbHNlIHtcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoID09PSAnIy9sb2dpbicpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbWFpbi9nb29kc0xpc3QnO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLnJlcXVlc3QgPSBmdW5jdGlvbiAodXJsLCBvcHRpb24sIGRhdGEpIHtcbiAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKXx8Jyc7XG4gIGxldCBxdWVyeVN0cmluZyA9ICcnO1xuICBpZiAoZGF0YSkge1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICBxdWVyeVN0cmluZyArPSBgJiR7dmFsdWV9PSR7ZGF0YVt2YWx1ZV19YDtcbiAgICB9KTtcbiAgfVxuICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9LFxuICAgIG1ldGhvZDogJ0dFVCdcbiAgfSwgb3B0aW9uKTtcbiAgdXJsICs9IGA/dG9rZW49JHt0b2tlbn0ke3F1ZXJ5U3RyaW5nfWA7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZmV0Y2goYCR7Y29tbW9uLmFwaVByZWZpeH0ke3VybH1gLCBvcHQpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QocmVzb2x2ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmIChyZXMucmV0Q29kZSA9PT0gMCkge1xuICAgICAgICAgIHJlc29sdmUocmVzKTtcbiAgICAgICAgfWVsc2UgaWYocmVzLnJldENvZGUgPT09IC0xMyl7XG4gICAgICAgICAgYWxlcnQocmVzLm1zZyk7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuJyk7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL2xvZ2luJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZWplY3QocmVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIGFsZXJ0KCfor7fmsYLlh7rplJnvvIzor7fnqI3lkI7ph43or5XvvIEnKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSk7XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24vcmVxdWVzdC5qcyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBhcGlQcmVmaXg6ICdodHRwczovL3d3dy5xYWZvcm1hdGguY29tL3pidW5pc2VydmVyLWFwaS8nLFxuICBub0RhdGFHb29kOiB7XG4gICAgZ29vZHNfbmFtZTogJycsXG4gICAgZ29vZHNfaW1hZ2U6ICcnLFxuICAgIGdvb2RzX3R5cGVfaWQ6IDAsXG4gICAgZ29vZHNfY29sbGVjdDogMCxcbiAgICBjYXRlZ29yeV9pZDogMCxcbiAgICBnb29kc19qaW5nbGU6ICcnLFxuICAgIGdvb2RzX3ByaWNlOiAwLFxuICAgIGdvb2RzX21hcmtldHByaWNlOiAwLFxuICAgIGdvb2RzX3NlcmlhbDogJycsXG4gICAgZ29vZHNfY2xpY2s6IDAsXG4gICAgZ29vZHNfc2FsZW51bTogMCxcbiAgICBnb29kc19zcGVjOiBbXSxcbiAgICBnb29kc19zdG9yYWdlOiAwLFxuICAgIGdvb2RzX3N0YXRlOiAwLFxuICAgIGdvb2RzX3ZlcmlmeTogMCxcbiAgICBjcmVhdGVfdGltZTogJycsXG4gICAgdXBkYXRlX3RpbWU6ICcnLFxuICAgIGdvb2RzX2ZyZWlnaHQ6IDAsXG4gICAgZXZhbHVhdGlvbl9nb29kX3N0YXI6IDAsXG4gICAgZXZhbHVhdGlvbl9jb3VudDogMCxcbiAgfSxcbiAgc3RhdHVzOiB7XG4gICAgMTogJ+W+heS7mOasvicsXG4gICAgMjogJ+W+heaUtui0pycsXG4gICAgMzogJ+W3suWPlua2iCcsXG4gICAgNDogJ+mAgOasvuS4rScsXG4gICAgNTogJ+W3sumAgOasvicsXG4gICAgNjogJ+mAgOasvuWksei0pScsXG4gICAgNzogJ+W3suWujOaIkCdcbiAgfSxcbiAgYWN0aXZlVHlwZToge1xuICAgIDE6ICfmu6Hlh48nLFxuICAgIDI6ICfkvJjmg6DliLgnLFxuICAgIDM6ICfkvJjmg6AnXG4gIH0sXG4gIG5vRGF0YUFjdGl2ZToge1xuICAgIGRpc2NvdW50OiA5LFxuICAgIGdvb2RzX2xpc3Q6IFsxOF0sXG4gICAgZ29vZHNfY291bnQ6IFsxXSxcbiAgICBzdGFydF90aW1lOiBudWxsLFxuICAgIGltYWdlX3VybDogXCJodHRwczovL2ltYWdlLnFhZm9ybWF0aC5jb20vY29tcHV0ZXJfc3VwZXJhcHAvYmFubmVyMDEuanBnXCIsXG4gICAgY3JlYXRlX3RpbWU6IFwiMjAxNy0xMC0xNiAxNjoxMDoxNFwiLFxuICAgIGVuZF90aW1lOiBudWxsLFxuICAgIGFjdGl2ZV90eXBlOiAzLFxuICAgIHRpdGxlOiBcIuS4ouS4ouS4olwiLFxuICAgIGlkOiA0LFxuICAgIHNvcnQ6IDQsXG4gIH0sXG4gIGRpc2NvdW50VHlwZToge1xuICAgIDE6JzHmipjkvJjmg6AnLFxuICAgIDI6JzLmipjkvJjmg6AnLFxuICAgIDM6JzPmipjkvJjmg6AnLFxuICAgIDQ6JzTmipjkvJjmg6AnLFxuICAgIDU6JzXmipjkvJjmg6AnLFxuICAgIDY6JzbmipjkvJjmg6AnLFxuICAgIDc6JzfmipjkvJjmg6AnLFxuICAgIDg6JzjmipjkvJjmg6AnLFxuICAgIDk6JznmipjkvJjmg6AnLFxuICAgIDEwOicx5YWD56eS5p2AJ1xuICB9XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24vY29tbW9uLmpzIiwibW9kdWxlLmV4cG9ydHMuc3R5bGVzID0ge1xuICBzbWFsbENvbHVtbjoge1xuICAgIHdpZHRoOiAnMjBweCcsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94J1xuICB9LFxuICBiaWdDb2x1bW46IHtcbiAgICB3aWR0aDogJzEwMHB4JyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gIH0sXG4gIG1pZGRsZUNvbHVtbjoge1xuICAgIHdpZHRoOiAnODBweCcsXG4gIH0sXG4gIHNlY0ltYWdlSXRlbToge1xuICAgIG1hcmdpblRvcDogJzEycHgnLFxuICAgIHdpZHRoOiAxNTAsXG4gICAgZmxvYXQ6ICdsZWZ0JyxcbiAgICBtYXJnaW5SaWdodDogMTJcbiAgfSxcbiAgZmlsZVNlbGVjdDoge1xuICAgIG9wYWNpdHk6IDAsXG4gICAgZmlsdGVyOiAnYWxwaGEob3BhY2l0eT0wKScsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6ICcwcHgnLFxuICAgIGxlZnQ6ICcwcHgnXG4gIH0sXG4gIGZpbGVTZWxlY3RDb250ZW50OiB7XG4gICAgbWFyZ2luUmlnaHQ6IDEyLFxuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgd2lkdGg6ICcxNTBweCcsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgbWFyZ2luOiAnMCBhdXRvIDEycHgnLFxuICB9LFxuICBtYWluSW1hZ2U6IHtcbiAgICB3aWR0aDogNjAwLFxuICAgIGhlaWdodDogMTkwLFxuICAgIG1hcmdpbkJvdHRvbTogJzEycHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gIH0sXG4gIGRldGFpbEltYWdlOiB7XG4gICAgd2lkdGg6IDE1MCxcbiAgICBoZWlnaHQ6IDIwMCxcbiAgICBtYXJnaW5Cb3R0b206ICcxMnB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIG1hcmdpblJpZ2h0OiAnMTJweCdcbiAgfSxcbiAgc3BlY0tleToge1xuICAgIHdpZHRoOiAxNTAsXG4gICAgbWFyZ2luUmlnaHQ6IDEyXG4gIH0sXG4gIHNwZWNWYWx1ZToge1xuICAgIHdpZHRoOiAzMDAsXG4gICAgbWFyZ2luTGVmdDogMTJcbiAgfSxcbiAgc3BlY0l0ZW06IHtcbiAgICB3aWR0aDogNTAwLFxuICAgIG1hcmdpbjogJzAgYXV0bydcbiAgfSxcbiAgc3BlY0FkZEJ0bjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiA0MCxcbiAgICBib3JkZXJSYWRpdXM6ICcyJScsXG4gIH0sXG4gIGNhdGVnb3J5Q29udGVudDoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgZmxvYXQ6ICdsZWZ0JyxcbiAgICBoZWlnaHQ6IDM1MCxcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gIH0sXG4gIGdvb2RzTGlzdENvbnRlbnQ6IHtcbiAgICB3aWR0aDogNDYwLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgaGVpZ2h0OiA0OFxuICB9LFxuICBnb29kc0NoZWNrSXRlbToge1xuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgaGVpZ2h0OiA0OCxcbiAgICB3aWR0aDogMTYwLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICB0ZXh0T3ZlcmZsb3c6ICdlbGxpcHNpcycsXG4gICAgd2hpdGVTcGFjZTogJ25vd3JhcCdcbiAgfVxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9hY3RpdmVMaXN0L0dvb2RzTGlzdFN0eWxlcy5qcyIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDYxNSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2ltbXV0YWJsZS9kaXN0L2ltbXV0YWJsZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzdlYzQzMjk2YjU3MmI0N2Q1YmE1XG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzLnN0eWxlcyA9IHtcbiAgc21hbGxDb2x1bW46IHtcbiAgICB3aWR0aDogJzIwcHgnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCdcbiAgfSxcbiAgYmlnQ29sdW1uOiB7XG4gICAgd2lkdGg6ICcxMDBweCcsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJ1xuICB9LFxuICBtaWRkbGVDb2x1bW46IHtcbiAgICB3aWR0aDogJzgwcHgnLFxuICB9LFxuICBzZWNJbWFnZUl0ZW06IHtcbiAgICBtYXJnaW5Ub3A6ICcxMnB4JyxcbiAgICB3aWR0aDogMTUwLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgbWFyZ2luUmlnaHQ6IDEyXG4gIH0sXG4gIGZpbGVTZWxlY3Q6IHtcbiAgICBvcGFjaXR5OiAwLFxuICAgIGZpbHRlcjogJ2FscGhhKG9wYWNpdHk9MCknLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAnMHB4JyxcbiAgICBsZWZ0OiAnMHB4J1xuICB9LFxuICBmaWxlU2VsZWN0Q29udGVudDoge1xuICAgIG1hcmdpblJpZ2h0OiAxMixcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIHdpZHRoOiAnMTUwcHgnLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIG1hcmdpbkJvdHRvbTogJzEycHgnLFxuICB9LFxuICBtYWluSW1hZ2U6IHtcbiAgICB3aWR0aDogMzAwLFxuICAgIGhlaWdodDogMjE0LFxuICAgIG1hcmdpbkJvdHRvbTogJzEycHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gIH0sXG4gIGRldGFpbEltYWdlOiB7XG4gICAgd2lkdGg6IDE1MCxcbiAgICBoZWlnaHQ6IDIwMCxcbiAgICBtYXJnaW5Cb3R0b206ICcxMnB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIG1hcmdpblJpZ2h0OiAnMTJweCdcbiAgfSxcbiAgc3BlY0tleToge1xuICAgIHdpZHRoOiAxNTAsXG4gICAgbWFyZ2luUmlnaHQ6IDEyXG4gIH0sXG4gIHNwZWNWYWx1ZToge1xuICAgIHdpZHRoOiAzMDAsXG4gICAgbWFyZ2luTGVmdDogMTJcbiAgfSxcbiAgc3BlY0l0ZW06IHtcbiAgICB3aWR0aDogNTAwLFxuICAgIG1hcmdpbjogJzAgYXV0bydcbiAgfSxcbiAgc3BlY0FkZEJ0bjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiA0MCxcbiAgICBib3JkZXJSYWRpdXM6ICcyJScsXG4gIH1cbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvZ29vZHNMaXN0L0dvb2RzTGlzdFN0eWxlcy5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge0ZsYXRCdXR0b259IGZyb20gJ21hdGVyaWFsLXVpJztcbmltcG9ydCB7c3R5bGVzfSBmcm9tICcuL1BhZ2VTdHlsZSc7XG5cbmNsYXNzIFBhZ2luYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaW5kZXg6IDFcbiAgICB9O1xuICB9XG5cbiAgcGFyc2VQYWdlID0gKHBhZ2VzLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHJlcyA9IFtdO1xuICAgIGlmIChwYWdlcyA8PSA3KSB7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBwYWdlczsgaSsrKSB7XG4gICAgICAgIHJlcy5wdXNoKGkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2UgaWYgKGluZGV4IDw9IDIgfHwgaW5kZXggPiBwYWdlcyAtIDIpIHtcbiAgICAgIHJldHVybiBbMSwgMiwgJy4uLicsIHBhZ2VzIC0gMSwgcGFnZXNdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gWzEsICcuLi4nLCBpbmRleCAtIDEsIGluZGV4LCBpbmRleCArIDEsICcuLi4nLCBwYWdlc107XG4gICAgfVxuXG4gIH07XG5cbiAgc2tpcFRvID0gKGluZGV4KSA9PiB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbmRleFxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoYXQucHJvcHMucGFnZUNoYW5nZShpbmRleCk7XG4gICAgfSk7XG5cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3RvdGFsLCBsaW1pdH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zdGF0ZS5pbmRleDtcbiAgICBjb25zdCBwYWdlcyA9IE1hdGguY2VpbCh0b3RhbCAvIGxpbWl0KTtcbiAgICBjb25zdCBwYWdlQnV0dG9ucyA9IHRoaXMucGFyc2VQYWdlKHBhZ2VzLCBpbmRleCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5wYWdlQ29udGFpbmVyfT5cbiAgICAgICAgPEZsYXRCdXR0b25cbiAgICAgICAgICBzdHlsZT17c3R5bGVzLmJ1dHRvbn1cbiAgICAgICAgICBsYWJlbD1cIjw8XCJcbiAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2tpcFRvKDEpO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxGbGF0QnV0dG9uXG4gICAgICAgICAgc3R5bGU9e3N0eWxlcy5idXR0b259XG4gICAgICAgICAgbGFiZWw9XCI8XCJcbiAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2tpcFRvKGluZGV4IC0gMSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAge3BhZ2VCdXR0b25zLm1hcChpdGVtID0+IHtcbiAgICAgICAgICBpZiAoaXRlbSA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxGbGF0QnV0dG9uXG4gICAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5idXR0b259XG4gICAgICAgICAgICAgICAgbGFiZWw9e2l0ZW19XG4gICAgICAgICAgICAgICAgc2Vjb25kYXJ5PXt0cnVlfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2tpcFRvKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbSAhPT0gJy4uLicpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxGbGF0QnV0dG9uXG4gICAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5idXR0b259XG4gICAgICAgICAgICAgICAgbGFiZWw9e2l0ZW19XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5za2lwVG8oaXRlbSk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxGbGF0QnV0dG9uXG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMuYnV0dG9ufVxuICAgICAgICAgICAgICBkaXNhYmxlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgbGFiZWw9e2l0ZW19XG4gICAgICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgICA8RmxhdEJ1dHRvblxuICAgICAgICAgIHN0eWxlPXtzdHlsZXMuYnV0dG9ufVxuICAgICAgICAgIGxhYmVsPVwiPlwiXG4gICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNraXBUbyhpbmRleCArIDEpO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxGbGF0QnV0dG9uXG4gICAgICAgICAgc3R5bGU9e3N0eWxlcy5idXR0b259XG4gICAgICAgICAgbGFiZWw9XCI+PlwiXG4gICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNraXBUbyhwYWdlcyk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFnaW5hdGlvbjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9jb21tb24vUGFnaW5hdGlvbi5qcyIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDU3NCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL3JlYWN0LXJvdXRlci1kb20vZXMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNVxuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoNjAwKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVhY3QtYXZhdGFyLWVkaXRvci9kaXN0L2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfN2VjNDMyOTZiNTcyYjQ3ZDViYTVcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU9VQUFBRElDQVlBQUFBWCt5YitBQUFTOUVsRVFWUjRYdTJkWDNiVXRoZkhwZWs1NGJGMEJhVXJhRmdCeVFxYXJvQmtCWVFIN0hranZJMmRoNFlWRUZaQVdBR3dBc0lLU0ZkUThzYTQ1MWkvYzRzbnYyR1lzYTVrV2YvOHpWTkxaRXY2M3Z1SlpGM3BTZ3I4UUFFb0VKVUNNcXJXb0RGUUFBb0lRQWtuZ0FLUktRQW9Jek1JbWdNRkFDVjhBQXBFcGdDZ2pNd2dhQTRVQUpUd0FTZ1FtUUtBTWpLRG9EbFFBRkRDQjZCQVpBb0F5c2dNZ3VaQUFVQUpINEFDa1NrQUtDTXpDSm9EQllKQytlelpzLzNaYlBaSUtYVmZTbm13Wm83MS80YVZvRUNmQXU5WHYxUktYVXNwYjlxMi9YQitmbjZkcW16ZW9leEFmS0tVT3BKUzNrOVZPTFE3YmdXVVVsK2tsRmRTeXRlTHhlSU8zTGhiL2ExMTNxQXNpdUt4bFBKTUNQRWdCV0hReHF3VXVGRktuZFYxL1RxRlhvME81WHcrUDFCS3ZRS01LYmhEOW0wa09KL1dkWDBWYzA5SGcvTDA5UFQrM3Q3ZUt5bmxVY3dDb0czVFUwQXBkZFUwemNuRnhjV1hHSHMvQ3BUZGQrTWJqSTR4bWh4dDZoU2dCYUUvWTF3UWNnNGxUVmZidG4yRFJSdzRmd29LU0NsUEZvdkZaVXh0ZFFybGZENC83cjRmWStvajJnSUZlaFdJRFV4blVIWlQxbyt3UHhSSVVRR2wxSit4TEFBNWdYSStuejlvMi9hajVaVDFMY1dUaEJBM3FjV1RVblMrWE50TW4wMjBoa0h4YnlIRUg2YjlwTGltVXVvd2htOU1KMUFXUlVGQTdoc0ljYXVVdW1pYTVpTFdGVENEdnFCb1pBcDBLLytuVXNwVEljVFAzT2JSanFDbWFRNUQrK1JnS0l1aU9KTlNQamZvK091bWFVNURkNXpiWHBSTFY0RTFPTm4rS1lSNFdWVVZ3UnpzWnhDVU5HMVZTbjNtdGo2MkQycHV1MUV1YlFXNkJjZ0w3cWdwcFR3TStTazFDTXF5TE44SklUaWJ4Mi9idGoySVliNmV0bnVoOWJZS2RBdVJ0QWVXTTUxOVgxWFZvVzFkUTUremh0Smt0VFgwWDU2aEl1SDVQQlJJeFdldG9TeUs0bEpLK1ZobkxreFpkUXJoOXo0Vk1JaWx2NjJxS3NnV1VTc282UVA2M3IxNy8rakVWRXA5cU91YU03M1Z2UXEvaHdMT0ZEQVlVSDViTEJZM3ppcG12c2dLU3U1Zm03WnRIK0k3a21rSkZQT21BSGVCc2p0UlFndEVYbitzb0N6TGtvTDl2UUZhcGRUcnVxNlB2ZllHbFVFQnBnS2MwVExVVE04S3lxSW8vdEh0M3NFb3lmUU9GQXVpQUhmUnA2b3FLMGFHZE1xNFFtWm5icXVxUXFxUElaYkJzNk1yVUJURmpaVHkxNzZLUWtRT2pLRXNpb0p5NjlCWnlaMC9xVTlkdTUwZ05EMS9JS1drOUNWM0tVeG9qNlFRZ2hJMFVRNll0eUVXQWtiMzFvbFVVSllsZlM4KzBVRHAvV2lYRFpUYWJYVktxUmQxWFZNK25tUit1aFhseDBxcFk1Tjl2TFJmVWdqeGZqYWJ2UVNneVpqN3Y0WVdSVUg3WS8vU0RERGVmWGtVS0VNTStVUGNvU2dLMmh0SkJobzY1YjVjTHBkUHNhOTNpRFg4UGR2bGo2SmRhWDJ6dnZpaFpBNzVRZmNPY3MwNlJ0b1NtdDdPWnJPbnNaMW01Mm95cFhJY0tJVVEzamNSMkl5VTc2V1VqMkw3T0RaMUptNnMxZlM5YStVdnE2bzZHZkE4SHZXZ1FGbVdTak5TZXQ4QU0wa295N0trbEplangxQmpPWi9ud2JlVHJRSlFSbUE2RHlQa1ppOHhZa1pnOTExTkFKU0JqY01KNTZ3M1VTbjFONjJzVXFxUzFiOTNpMEcwbi9kM2JuZFNYSTNtOWkzMWNvQXlvQVc3Mk9Obnpnb3J4VmtwWFVuZnZ0MXUveVNkVU8rTmM2M0JuTVRpVjBBVEJha2FVQWFSL1Z1bHpMUWxuOXEyUFRiWlJOL0JTWHVCZFNObjBJT3pBYVdQdW1wQUdjZzh6Rk1CbjViTDVZRk5qTEViaFM5MDUwdHh0alNRQS9SVUN5Z0QyWVFSVzdVR2NyMUxaVm5TN3A2ZEl5YXR4dFoxL1RDUURLaDJpd0tBTXBCYmxHVkp5YjEyWHNIbjZrUkx0MVdQRm9WMjVvR1JVZ1k1T0J0SSt1aXJCWlFCVEtRNzFlSjY4N3p1MnpYVXdka0EwaWRSSmFBTVlDWWRKSzVHeVZYWGRLbFNRaDJjRFNCOUVsVUN5Z0JtNmp0aFRuSEl1cTZkM3l5dHljeHdVMVhWYndHa1FKWDRwb3pqbnZtaUtIYnUxUjFyMU5LTnppRk9zNFBJN1FwZ3BBemdHWDFRanBXaVhyZHpDRkFHY0lRZFZRTEtBTFlveTVJeUJXeGREUjFyKzV2dVNKRHI3OWdBc21aVEphQU1ZRXJOOUhXVWpIdTZUZThZS1FNNEFrYktzQmVrck91UGI4cDRBSWl4SlJncEExaEZ0NXRudVZ6K1lyTzFycThyZmZkMWpyVzRGRURhTEtvRWxBSE1xSnRLdXI1V214R25IR1hLSEVEYUxLb0VsQUhNeU5pTTdqUnVxTXU4N2ZxUFFBQko3NnFrUDBDdVp4bSsrd01vZlN2ZTFjZllLUDYwcnV2QmQwYm90dlFKSWJKSlVrMTlsVksrU3oxSkdLQU1CQ1VuditmUU1FVTNiZjNZdC9IZDlUN2JRSEtLN3FqYXUxViszSlJIZjBBWnlvdStIWEx1VFZIZlpUNC9xZXVhRGl3Yi9YU2p4aXRORXVkYituME9DWnMzRjdKSU82WFVvY25oY0NPQlJ5d01LRWNVVi9kcTNZTFA2bm1sMUZuVE5DKzUzMHBGVWRERnVYVEF1VGVSODFnYkZYVDlkdjM3WFprQVV3VVRVTHIyRU1QMzZiNHQxOENrWFVDWFNxbXI4L1B6RDV2VmROK09sUHVXY3ZSb043VFR4dmVtYWZhNW9CdDJ5MXR4M1o3ZUZNRUVsTjdjWjN0Rm5FUEkyNTRrWjVOU1VsYUI3eTc3WVhibnRtM2JneFNuZHV2OU01aHBKRFdWQlpSTUx4NnpXRGZLVWRySW5ka0JYTmFmMnIwcTIvck9XRlgrN3JHVVJreEE2ZExiQjd6TEU1aTBzSE9hK3AwaXE5Q0g3cHQ1MHh5cGdBa29CNERrK2xHRDFKREdWZE0zcEZMcUtQVXA2MmJvdzFTSUZNQUVsS1pXSGJsODk0MUo5Mml5RWlwem1rT3h5S1pwVGxOZjFLRys5dTNoNVdoQlpXSUhFMUJ5TGVtNUhJMmFiZHZTWmJnVTNyRDZJUmhuczlsWkRuRklFb0I3Q1JMTkNuUlhsSGZYQXo2TVVSdEFhZVh1L2g3cTRLVHI0K211RUxwZXZmZUhUbndJSWE1bXM5bFZqQTZuYS8rdTMrdENIMnZQZlpKU0hsSG9TSmNoUHRZYnlBQ2xyWmNFZW80eUNIUlYwMGhLNFJDNkVKWkNJK0xyMTYvWE9VeFJONlhsaGo2RUVIY0pyTHZQQUZyUjdyMjZJVVl3QVdVZ3VGQXRUd0dEME1jUHNWZnVpblpzWUFKS25tK2dWQUFGVEVJZnV6YnZjNkdPQ1V4QUdjRFpVS1ZlQVpQUWgrNlNJdTcwTnhZd0FhWGVQMURDc3dJbVFIS3ZYT0F1Rk1VQUpxRDA3SENvVHErQVFlakRLSTJKTGdQRHFtV2h3UVNVZWg5QkNZOEs2SktLclRYbGJWVlZSNlpOMHlUQ3ZudGRTREFCcGFsVlVYNDBCYmpmZnV1aEQ5UEdjRU1sOU41UWQzY0NTbE9yb3Z3b0N1Z3l1SzlWZXJ0Y0xoOE1pY2QyZTR3cHRzczVsWE5aVmRYSktKM2U4VkpBNlZOdDFMVlZBWVBRaDdOem9Od1ladGRncjJBQ1NvQVNWQUZPY3E5VkExMmZBOVZkZXJRaGpEY3dBV1ZRbDV4MjVTYWhEMTBzMGxaSmcrOVlxc0lMbUlEUzFwcDRickFDM05ESFdOY0RyanJBRFpYNG1zb0N5c0d1WmYrQ29paWVtMlNwczY4cHZpZTVvUTlmZVdsakFoTlFCdkxYMVNnUk1oNFdxT3ZDWU1yNHFhcXFmUi90TkFtVmpEMWlBa29mRnQrb1kzUGFOaVV3RFVJZmQ4ZXdmSm1vKzhhOTFoMlFYbXZQS04rWWdOS1h4YnQ2ZWhJSFh6ZE5jemdrL3VhNUs4YlZtWVErUW1WdU53eVZrQVl2cTZxaVhMdk9mZ0NsTXluMUw5SXRiT1E4WWhxRVBwekZJdlVXMlY3Q1lEVC83d1d1VjRZQnBhM2xESi9UQWJsNlhZNWd4aEQ2TURTWHlYZXZjekFCcGFtMUxNcHpnY3dWVEc3L1hZODRGcWI2N2hIdWNhL1ZRNjdhRHlpSFdrN3p2S2xoY3dNenR0Q0hxYmtOUXlWT3ByS0EwdFJLQnVVTmx2NjN2algxcVN5My83NWlrUWFtKzY0bzl4SW1WeU1tb0xTMWxPWTVya1BxcWs4VlRJTjlwZDVESHpyTk4zOXZFY01jTkdJQ1NsTUxNY29iQUhuTE9UNlVHcGpjMEVkSzEvRVpIdmNhdFBnREtCbVFtUlF4QVpLdW8vdnBwNS8ybFZLdmRIV2tBbWEzMHZxWmNmbE84TkNIVHZQTjMxdkVNSzFHVEVCcGFwbWU4cVpBcmk3YjRUNFhPNWdtb1k5ZEtTRWRtbU9VVjNGdHRWNjVVdXJQdXE0cFl6dnJCMUN5Wk5JWE1qRFcxaEdDKzN6TVlCWkY4WWF1RE5DcDVTcDBvS3NuMWQ4RFNnZVc0d0pGVmZVZDFPVytKMFl3dWJGSXBkU0x1cTdwVmpIODdGQUFVQTUwRFM1SUhaQW51Z3RidWUrTENVeUROaHVsaEJ4b21tUWZCNVFEVE1kMVJpNlFxNlp3M3hzRG1OelFCOTBHVnRmMTZuS2lBYXJuL3lpZ3RMUXhGeHhUSUZNQ2t4djZHSklTMHRJOFNUOEdLQzNNTnphUUtZQnBFdm9ZbWhMU3drUkpQd0lvRGMzSG5hN1pqcENiemVIK0FmQTVsVFVJZlNRWGl6UjBoMUdLQTBvRFdRMm1hMVpCNDExTmlRMU1idWpETkQ1bllJcXNpd0pLcG5sREFSbmJWSlliK2tBc2t1bFlXNG9CU29aMm9ZRzBBYk91NjRlTXJoa1Y0WTdZWTZUSU1HcG80b1VCcGNhQXNRQnBDcWJyeE1IY2IrbllqMkdsd0N1ZzdMRlNiRUNHQXROQUIyOHBJVk9BeTdhTmdIS0hjZ2FPNkhSUmgydElnNm5rb0RTSUJxR1A2TTlGY3JVTlhZNnlWZlMxWVRhYjNlaDJocm51Z3pSOUllY2lVSlBMWVdJSDB0ZUlpZENIcVNmbVd6NG9sS2tBNlFQTXNpemZDU0YwVytNUWk4eVh4YnVlQllNeU5TREhCQk9oandtUVp0REZJRkNtQ3VRWVlCWkZjU3FsL0V0bk04UWlkUXJsODN2dlVLWU9wRXN3dVF0SUNIMThEMXlYWE91UlVtcGZTbm05WEM0LzVIUUZoVmNvY3dIU0JaZ0dXcnl0cWtxYllTQ2ZjYUsvSi9TSHJHM2J2OWJ6RWltbHZnZ2hMdXE2ZnBHRER0NmdOTGpmSWtqWXc5YVkzTkZ1ZllNQlpXdHIyL1lqSStFVlFoOXJobUZNOVoxZkFHVHJGME9lOHdLbHdYSy9TREdGaFFtWXkrWHk2ZDdlM2p1NjZhclBjQ21saEJ6aWdOeG51N1NUbjNYbFRjSnh1bmVGK3Yzb1VCb0NtV3dLQ3k2WU5OVmlqSkFJZld3UXdSZ2xWMDhrUDFxT0N1VlVnTFQ0eHV6OUk1ekRYM3ZYb3d6M25wZ2NVcUdNQnVYWHIxK3ZPZE0wTWw1T3E0dmNFWE9YMHlMMHNWMFpRTm56WjQ2enpZNE8zQW9obnV1K20zSURjdWlJbWVMM3RPc1JjZGY3QU9Wd0tEbmZUVm1Oa0p1U21ZNllPYzBXeGdBVlVBNkVrbU9VS1RnaEY4d2N2b000Tmg5U0JsQ09ET1VVZ0RTWXlpSVd5YUFWVUk0STVaU0FaSUI1UzkvZGk4WGlodUdYa3k0Q0tFZUNjb3BBOW9DSldLVEJueGxBT1FLVVV3WnlHNWhJQ1dsQXBCQUNVRHFHRWtEK1gxQmEvS0gvODUxaXdneUIrRW9EU29kUUFzajRIRHpGRmdGS1IxQUN5QlRkUDg0MkEwb0hVQUxJT0owNzFWWUJ5b0ZRQXNoVVhUL2VkZ1BLZ1ZEaWxFTzh6cDFxeXdBbG9FelZkN050TjZBRWxOazZkNm9kQTVTQU1sWGZ6YmJkZ0JKUVp1dmNxWFlNVUFMS1ZIMDMyM1lEU2tDWnJYT24yakZBQ1NoVDlkMXMydzBvQVdXMnpwMXF4d0Fsb0V6VmQ3TnRONkFFbE5rNmQ2b2RBNVNBTWxYZnpiYmRnQkpRWnV2Y3FYWU1VQUxLVkgwMzIzWURTa0NaclhNUDdkaDhQajlvMi9hSmxCSjNablppS3FXdWhCQlhkVjIvSHFvdlBUL2FYU0tMeGVLOWl3YmlIZkVvWUhEelZUeU45dHVTeTZxcVRvWldDU2lIS2ppUjU0dWlPSkpTdnBsSWQ2Mjc2ZUkrR0VCcExmKzBIaXlLZ202ZTdyM29kbHFLYk84dDNUOWExL1V2UTdRQWxFUFVtOUN6WlZtcUNYVjNVRmZidG4xNGZuNStiZnNTUUdtcjNNU2VBNVI4Z3c5Tmh3TW8rVnBQdW1SUkZEZFN5bDhuTFFLejg4dmw4cGVMaTRzdnpPSS9GQU9VdHNwTjdEbHVuSEJpc3Z6UVhSZVpIQUhsMUwySTJmL1QwOVA3OSs3ZG96RFg3OHhIcGxqc2RybGNQaGd5U3BKb2dIS0tybVBaWndKemIyL3ZRa3I1MlBJVjJUNUdGLy9PWnJOakY5Y2FBc3BzM1dTOGpzM244d2RDaUFkdDJ4Nk1WOHNQYno2UVVqN1MxYWVVK2xzSWNha3I1L0QzMTdQWjdOb0ZqS3MyQVVxSDFzR3J4bE9BKzAyYncxWDFnSEk4UDhLYkhTb0FLSHZFTElyaXZXNGFNVFJPNDlDV2VGVW1DZ0JLUUptSksrZlREVUFKS1BQeDVreDZBaWdCWlNhdW5FODNBQ1dnek1lYk0ra0pvT3d4WkZtV0YwS0lKMzIyeGtKUEppUkUxQTFBMlQ5U25ra3Bud1BLaUR4MkFrMEJsQU9oZEhINmVnSitoaTRhS0FBbys2SFVwb1Z3c1ZQZXdGNG9PZ0VGQUdXUGtaODllN1kvbTgwKzl2bUJpNVFJRS9BemRORkFBVUNwRWFzc1N6ckErVE8rS3cyOENrVUhLUUFvOVZCU25zcy9OS1BsNjdxdWp3ZFpBZzlEZ1U0QlFLbHhoZmw4ZnF5VWVxWHptS0VKaEhUdngrK25vd0NnMU5pNk80WCtEOE1sM2xkVmRjZ29oeUpRb0ZjQlFNbHdrS0lvTGprbjBKVlNUK3U2cGcwSCtJRUMxZ29BU29aMG5GWFkxV3V3dzRjaEtJcGdwT3dVTUQ3a3ZLNGM1MndsbGFjUWlWTHFjRWlDV3Zqc3RCWEFTTW0wUCtWcVVVcDlaaFlYVXNxVHhXTGhNMzhLdDJrb0Y3a0NnTkxBUUZ5eDFsNUozNkl2WENZYU1tZ3VpaWFxQU5mUEpwbWpaNXROeTdLa2V4UFkrVUJwT2l1RXVHaWE1dVhRSEptSitoaWFiYWdBb0RRVXJKdkdFcGk5dTN4MnZKWVMvRjYxYlh2OTc3Ly9mZ0traHVKUHBEaWd0REIwdHhwTGdObUFhVkVqSHZHcFFGVlZneFlGaDdZVlVGb3F5TjNwWS9sNlBCWlFBVURwVDN6bmYvMHdZdm96bnMrYUFLVS90WjFEU1UzdndLVFFCM3Z4eDErWFVaT05Bb0RTUmpXN1owYUJrcHJTN1k4OTArWHpzV3MybnZLdFFDcFFDaUhlVmxWMTVGc2ZsL1dOQnVXcWtmUDUvS0J0VzRwTjRzSlJsNWJ6L0s3UVVKSWZLYVhlNmJxZHd3YVYwYUZjZy9PNGJWdEt1Z1U0ZFo0VjRlOURRMG1TTUxaMWZxcXFhajlDK1l5YTVBM0tWYXZvZTFOS2VTcUVvS3ZOQUtpUnVjSVZqZ0hLdm90cjZRbzhwZFJSRHZ1cnZVTzU3bGJkUFljMHZhWDdEdS91T3BSUzBsODd4RHZETWZoRHpURkF1VEhyV3M5cWNkVTB6V1V1RzArQ1FobVJ6NkVwVUNBYUJRQmxOS1pBUTZEQU53VUFKVHdCQ2tTbUFLQ016Q0JvRGhRQWxQQUJLQkNaQW9BeU1vT2dPVkFBVU1JSG9FQmtDZ0RLeUF5QzVrQUJRQWtmZ0FLUktRQW9Jek1JbWdNRkFDVjhBQXBFcGdDZ2pNd2dhQTRVK0I4NU5PSzVTYUNDZEFBQUFBQkpSVTVFcmtKZ2dnPT1cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbW1vbi9pbWFnZS91cGxvYWQucG5nXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9wdXJlID0gcmVxdWlyZSgncmVjb21wb3NlL3B1cmUnKTtcblxudmFyIF9wdXJlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3B1cmUpO1xuXG52YXIgX1N2Z0ljb24gPSByZXF1aXJlKCcuLi8uLi9TdmdJY29uJyk7XG5cbnZhciBfU3ZnSWNvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TdmdJY29uKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEF2UGxheWxpc3RBZGQgPSBmdW5jdGlvbiBBdlBsYXlsaXN0QWRkKHByb3BzKSB7XG4gIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICBfU3ZnSWNvbjIuZGVmYXVsdCxcbiAgICBwcm9wcyxcbiAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgncGF0aCcsIHsgZDogJ00xNCAxMEgydjJoMTJ2LTJ6bTAtNEgydjJoMTJWNnptNCA4di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00ek0yIDE2aDh2LTJIMnYyeicgfSlcbiAgKTtcbn07XG5BdlBsYXlsaXN0QWRkID0gKDAsIF9wdXJlMi5kZWZhdWx0KShBdlBsYXlsaXN0QWRkKTtcbkF2UGxheWxpc3RBZGQuZGlzcGxheU5hbWUgPSAnQXZQbGF5bGlzdEFkZCc7XG5BdlBsYXlsaXN0QWRkLm11aU5hbWUgPSAnU3ZnSWNvbic7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEF2UGxheWxpc3RBZGQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbWF0ZXJpYWwtdWkvc3ZnLWljb25zL2F2L3BsYXlsaXN0LWFkZC5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoMjQ5KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVkdXgvZXMvaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNVxuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJpbnRNZSgpIHtcbiAgY29uc29sZS5sb2coJ1VwZGF0aW5nIHByaW50LmpzLi4uJylcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wcmludC5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7SGFzaFJvdXRlciwgUm91dGUsIFJlZGlyZWN0fSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCBNdWlUaGVtZVByb3ZpZGVyIGZyb20gJ21hdGVyaWFsLXVpL3N0eWxlcy9NdWlUaGVtZVByb3ZpZGVyJztcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9zcmMvY29tcG9uZW50cy9jb21tb24vSGVhZGVyJztcbmltcG9ydCBMb2dpbiBmcm9tICcuL3NyYy9jb21wb25lbnRzL2NvbW1vbi9Mb2dpbic7XG5pbXBvcnQge1Byb3ZpZGVyfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2NyZWF0ZVN0b3JlfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgc21hbGxBcHAgZnJvbSAnLi9zcmMvcmVkdWNlcnMnO1xuaW1wb3J0IHByaW50TWUgZnJvbSAnLi9wcmludC5qcyc7XG5cbmxldCBzdG9yZSA9IGNyZWF0ZVN0b3JlKFxuICBzbWFsbEFwcCxcbiAgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18gJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18oKVxuKTtcblxuUmVhY3RET00ucmVuZGVyKChcbiAgPE11aVRoZW1lUHJvdmlkZXI+XG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICA8SGFzaFJvdXRlcj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8Um91dGUgcGF0aD1cIi9cIiByZW5kZXI9eygpPT4oPFJlZGlyZWN0IHRvPVwiL21haW4vZ29vZHNMaXN0XCIgLz4pfS8+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWFpblwiIGNvbXBvbmVudD17SGVhZGVyfS8+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvbG9naW5cIiBjb21wb25lbnQ9e0xvZ2lufS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9IYXNoUm91dGVyPlxuICAgIDwvUHJvdmlkZXI+XG4gIDwvTXVpVGhlbWVQcm92aWRlcj5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAtcm9vdCcpKTtcblxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vcHJpbnQuanMnLCAoKSA9PiB7XG4gICAgcHJpbnRNZSgpO1xuICB9KTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDE3KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcmVhY3QtZG9tL2luZGV4LmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfN2VjNDMyOTZiNTcyYjQ3ZDViYTVcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMykpKDQ5Mik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL21hdGVyaWFsLXVpL3N0eWxlcy9NdWlUaGVtZVByb3ZpZGVyLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3JfN2VjNDMyOTZiNTcyYjQ3ZDViYTVcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge01lbnUsIE1lbnVJdGVtLCBQYXBlciwgQXBwQmFyLCBGbGF0QnV0dG9ufSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQge3N0eWxlc30gZnJvbSAnLi9IZWFkZXJTdHlsZSc7XG5pbXBvcnQge1JvdXRlfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCBIb3RMaXN0IGZyb20gJy4vLi4vaG90TGlzdC9Ib3RMaXN0JztcbmltcG9ydCBHb29kc0xpc3QgZnJvbSAnLi8uLi9nb29kc0xpc3QvR29vZHNMaXN0JztcbmltcG9ydCBDYXRlZ29yeSBmcm9tICcuLy4uL2NhdGVnb3J5L0NhdGVnb3J5JztcbmltcG9ydCBBY3RpdmVMaXN0IGZyb20gJy4vLi4vYWN0aXZlTGlzdC9BY3RpdmVMaXN0JztcbmltcG9ydCBPcmRlckxpc3QgZnJvbSAnLi8uLi9vcmRlckxpc3QvT3JkZXJMaXN0JztcblxuY2xhc3MgSGVhZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgY29uc3QgcGF0aE5hbWUgPSB0aGlzLnByb3BzLmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJylbMl07XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lbnVTZWxlY3RlZDogcGF0aE5hbWVcbiAgICB9O1xuICB9XG5cbiAgbWVudU9uY2hhbmdlID0gKGUsIHYpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1lbnVTZWxlY3RlZDogdlxuICAgIH0pO1xuICAgIHRoaXMucHJvcHMuaGlzdG9yeS5wdXNoKGAvbWFpbi8ke3Z9YCk7XG4gIH07XG5cbiAgbG9nb3V0ID0gKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpO1xuICAgIHRoaXMucHJvcHMuaGlzdG9yeS5yZXBsYWNlKCcvbG9naW4nKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3t3aWR0aDogJzEwMCUnfX0+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLnRpdGxlQmFyQ29udGVudH0+XG4gICAgICAgICAgPEFwcEJhclxuICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy50aXRsZUJhcn1cbiAgICAgICAgICAgIHRpdGxlPVwi5bCP56iL5bqP5ZCO5Y+w566h55CG57O757ufXCJcbiAgICAgICAgICAgIGljb25TdHlsZUxlZnQ9e3tkaXNwbGF5OiAnbm9uZSd9fVxuICAgICAgICAgICAgaWNvbkVsZW1lbnRSaWdodD17XG4gICAgICAgICAgICAgIDxGbGF0QnV0dG9uIGxhYmVsPVwi55m75Ye6XCIgb25DbGljaz17dGhpcy5sb2dvdXR9Lz5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17e3dpZHRoOiAnMTIzMHB4JywgbWFyZ2luOiAnMCBhdXRvJ319PlxuICAgICAgICAgIDxQYXBlclxuICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5wYXBlclN0eWxlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxNZW51XG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMubWVudX1cbiAgICAgICAgICAgICAgc2VsZWN0ZWRNZW51SXRlbVN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiKDAsIDE4OCwgMjEyKScsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLm1lbnVTZWxlY3RlZH1cbiAgICAgICAgICAgICAgbWVudUl0ZW1TdHlsZT17e3dpZHRoOiAnMjAwcHgnfX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMubWVudU9uY2hhbmdlfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8TWVudUl0ZW0gdmFsdWU9XCJnb29kc0xpc3RcIiBwcmltYXJ5VGV4dD1cIuWVhuWTgeWIl+ihqFwiLz5cbiAgICAgICAgICAgICAgPE1lbnVJdGVtIHZhbHVlPVwiY2F0ZWdvcnlcIiBwcmltYXJ5VGV4dD1cIuWIhuexu+WIl+ihqFwiLz5cbiAgICAgICAgICAgICAgPE1lbnVJdGVtIHZhbHVlPVwib3JkZXJMaXN0XCIgcHJpbWFyeVRleHQ9XCLorqLljZXliJfooahcIi8+XG4gICAgICAgICAgICAgIDxNZW51SXRlbSB2YWx1ZT1cImFjdGl2ZUxpc3RcIiBwcmltYXJ5VGV4dD1cIua0u+WKqOWIl+ihqFwiLz5cbiAgICAgICAgICAgICAgey8qPE1lbnVJdGVtIHZhbHVlPVwiaG90TGlzdFwiIHByaW1hcnlUZXh0PVwi54Ot5Y2W5Lqn5ZOBXCIvPiovfVxuICAgICAgICAgICAgICB7Lyo8TWVudUl0ZW0gdmFsdWU9XCJudWxsXCIgcHJpbWFyeVRleHQ9XCLmmoLmnKrlvIDlj5FcIi8+Ki99XG4gICAgICAgICAgICA8L01lbnU+XG4gICAgICAgICAgPC9QYXBlcj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMudGFibGVDb250YWluZXJ9PlxuICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWFpbi9nb29kc0xpc3RcIiBjb21wb25lbnQ9e0dvb2RzTGlzdH0vPlxuICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWFpbi9ob3RMaXN0XCIgY29tcG9uZW50PXtIb3RMaXN0fS8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9tYWluL2NhdGVnb3J5XCIgY29tcG9uZW50PXtDYXRlZ29yeX0vPlxuICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWFpbi9vcmRlckxpc3RcIiBjb21wb25lbnQ9e09yZGVyTGlzdH0vPlxuICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvbWFpbi9hY3RpdmVMaXN0XCIgY29tcG9uZW50PXtBY3RpdmVMaXN0fS8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIZWFkZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0hlYWRlci5qcyIsIm1vZHVsZS5leHBvcnRzLnN0eWxlcyA9IHtcbiAgcGFwZXJTdHlsZToge1xuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIHdpZHRoOiAnMjAwcHgnLFxuICAgIG1hcmdpblRvcDogJzMwcHgnLFxuICAgIGZsb2F0OiAnbGVmdCdcbiAgfSxcbiAgdGl0bGVCYXJDb250ZW50OiB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICc2NHB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2IoMCwgMTg4LCAyMTIpJ1xuICB9LFxuICB0aXRsZUJhcjoge1xuICAgIG1heFdpZHRoOiAnMTIzMHB4JyxcbiAgICBib3hTaGFkb3c6ICdub25lJyxcbiAgICBoZWlnaHQ6ICc2NHB4JyxcbiAgICBtYXJnaW46ICcwIGF1dG8nXG4gIH0sXG4gIG1haW5Db250YWluZXI6IHtcbiAgICB3aWR0aDogJzEyMzBweCcsXG4gICAgbWFyZ2luOiAnMCBhdXRvJyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICB9LFxuICBtZW51OiB7XG4gICAgd2lkdGg6ICcyMDBweCdcbiAgfSxcbiAgdGFibGVDb250YWluZXI6IHtcbiAgICBmbG9hdDogJ2xlZnQnLFxuICAgIHdpZHRoOiAnMTAwMHB4JyxcbiAgICBtYXJnaW46ICczMHB4IDAgMzBweCAyNXB4J1xuICB9XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL2NvbW1vbi9IZWFkZXJTdHlsZS5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3JlcXVlc3R9IGZyb20gJy4vLi4vLi4vY29tbW9uL3JlcXVlc3QnO1xuaW1wb3J0IHtcbiAgVGFibGUsXG4gIFRhYmxlQm9keSxcbiAgVGFibGVIZWFkZXIsXG4gIFRhYmxlSGVhZGVyQ29sdW1uLFxuICBUYWJsZVJvdyxcbiAgVGFibGVSb3dDb2x1bW4sXG4gIFJhaXNlZEJ1dHRvbixcbiAgUGFwZXJcbn0gZnJvbSAnbWF0ZXJpYWwtdWknO1xuaW1wb3J0IHtzdHlsZXN9IGZyb20gJy4vR29vZHNMaXN0U3R5bGVzJztcblxuY2xhc3MgSG90TGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHJlcXVlc3QoJ2FkbWluL2hvdC1nb29kcy9saXN0Jywge30sIHtsaW1pdDogMTAsIG9mZnNldDogMH0pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkYXRhUm93ID0gW107XG4gICAgcmV0dXJuIChcbiAgICAgIDxQYXBlcj5cbiAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgc3R5bGU9e3ttYXJnaW46ICc4cHgnfX1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNob3dNb2RhbChudWxsLCAnYWRkR29vZHMnKTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAg5re75YqgXG4gICAgICAgIDwvUmFpc2VkQnV0dG9uPlxuICAgICAgICA8VGFibGU+XG4gICAgICAgICAgPFRhYmxlSGVhZGVyXG4gICAgICAgICAgICBkaXNwbGF5U2VsZWN0QWxsPXtmYWxzZX1cbiAgICAgICAgICAgIGFkanVzdEZvckNoZWNrYm94PXtmYWxzZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VGFibGVSb3c+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT5JRDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLmJpZ0NvbHVtbn0+5ZWG5ZOB5ZCN56ewPC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PuWVhuWTgeS7t+agvDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT7lupPlrZg8L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+6ZSA6YePPC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuYmlnQ29sdW1ufT7mk43kvZw8L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgPC9UYWJsZVJvdz5cbiAgICAgICAgICA8L1RhYmxlSGVhZGVyPlxuICAgICAgICAgIDxUYWJsZUJvZHkgZGlzcGxheVJvd0NoZWNrYm94PXtmYWxzZX0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRhdGFSb3cubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8VGFibGVSb3cga2V5PXtpdGVtLmlkfSBzZWxlY3RhYmxlPXtmYWxzZX0+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT57aXRlbS5pZH08L1RhYmxlUm93Q29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8VGFibGVSb3dDb2x1bW4gc3R5bGU9e3N0eWxlcy5iaWdDb2x1bW59PntpdGVtLmdvb2RzX25hbWV9PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmdvb2RzX3ByaWNlfTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT57aXRlbS5nb29kc19zdG9yYWdlfTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT57aXRlbS5nb29kc19zYWxlbnVtfTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLmJpZ0NvbHVtbn0+XG4gICAgICAgICAgICAgICAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TW9kYWwoaXRlbS5pZCwgJ3Nob3dEZXRhaWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPuafpeeci+ivpuaDhTwvUmFpc2VkQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd01vZGFsKGl0ZW0uaWQsICdlZGl0RGV0YWlsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgID7nvJbovpE8L1JhaXNlZEJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8UmFpc2VkQnV0dG9uIHByaW1hcnk9e3RydWV9PuWIoOmZpDwvUmFpc2VkQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L1RhYmxlUm93Q29sdW1uPlxuICAgICAgICAgICAgICAgICAgPC9UYWJsZVJvdz5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvVGFibGVCb2R5PlxuICAgICAgICA8L1RhYmxlPlxuICAgICAgPC9QYXBlcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhvdExpc3Q7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvaG90TGlzdC9Ib3RMaXN0LmpzIiwibW9kdWxlLmV4cG9ydHMuc3R5bGVzID0ge1xuICBzbWFsbENvbHVtbjoge1xuICAgIHdpZHRoOiAnMjBweCcsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94J1xuICB9LFxuICBiaWdDb2x1bW46IHtcbiAgICB3aWR0aDogJzEwMHB4JyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gIH0sXG4gIG1pZGRsZUNvbHVtbjoge1xuICAgIHdpZHRoOiAnODBweCcsXG4gIH0sXG4gIHNlY0ltYWdlSXRlbToge1xuICAgIG1hcmdpblRvcDogJzEycHgnLFxuICAgIHdpZHRoOiAxNTAsXG4gICAgZmxvYXQ6ICdsZWZ0JyxcbiAgICBtYXJnaW5SaWdodDogMTJcbiAgfSxcbiAgZmlsZVNlbGVjdDoge1xuICAgIG9wYWNpdHk6IDAsXG4gICAgZmlsdGVyOiAnYWxwaGEob3BhY2l0eT0wKScsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6ICcwcHgnLFxuICAgIGxlZnQ6ICcwcHgnXG4gIH0sXG4gIGZpbGVTZWxlY3RDb250ZW50OiB7XG4gICAgbWFyZ2luUmlnaHQ6IDEyLFxuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgd2lkdGg6ICcxNTBweCcsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgbWFyZ2luQm90dG9tOiAnMTJweCcsXG4gIH0sXG4gIG1haW5JbWFnZToge1xuICAgIHdpZHRoOiAzMDAsXG4gICAgaGVpZ2h0OiAyMTQsXG4gICAgbWFyZ2luQm90dG9tOiAnMTJweCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgfSxcbiAgZGV0YWlsSW1hZ2U6IHtcbiAgICB3aWR0aDogMTUwLFxuICAgIGhlaWdodDogMjAwLFxuICAgIG1hcmdpbkJvdHRvbTogJzEycHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgbWFyZ2luUmlnaHQ6ICcxMnB4J1xuICB9LFxuICBzcGVjS2V5OiB7XG4gICAgd2lkdGg6IDE1MCxcbiAgICBtYXJnaW5SaWdodDogMTJcbiAgfSxcbiAgc3BlY1ZhbHVlOiB7XG4gICAgd2lkdGg6IDMwMCxcbiAgICBtYXJnaW5MZWZ0OiAxMlxuICB9LFxuICBzcGVjSXRlbToge1xuICAgIHdpZHRoOiA1MDAsXG4gICAgbWFyZ2luOiAnMCBhdXRvJ1xuICB9LFxuICBzcGVjQWRkQnRuOiB7XG4gICAgd2lkdGg6IDEwMCxcbiAgICBoZWlnaHQ6IDQwLFxuICAgIGJvcmRlclJhZGl1czogJzIlJyxcbiAgfVxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9ob3RMaXN0L0dvb2RzTGlzdFN0eWxlcy5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3JlcXVlc3R9IGZyb20gJy4vLi4vLi4vY29tbW9uL3JlcXVlc3QnO1xuaW1wb3J0IHtcbiAgVGFibGUsXG4gIFRhYmxlQm9keSxcbiAgVGFibGVIZWFkZXIsXG4gIFRhYmxlSGVhZGVyQ29sdW1uLFxuICBUYWJsZVJvdyxcbiAgVGFibGVSb3dDb2x1bW4sXG4gIFJhaXNlZEJ1dHRvbixcbiAgUGFwZXJcbn0gZnJvbSAnbWF0ZXJpYWwtdWknO1xuaW1wb3J0IGNvbW1vbiBmcm9tICcuLy4uLy4uL2NvbW1vbi9jb21tb24nO1xuaW1wb3J0IERldGFpbE1vZGFsIGZyb20gJy4vRGV0YWlsTW9kYWwnO1xuaW1wb3J0IHtzdHlsZXN9IGZyb20gJy4vR29vZHNMaXN0U3R5bGVzJztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtnb29kc0xpc3QsIGNhdGVnb3JpZXNMaXN0fSBmcm9tICcuLy4uLy4uL2FjdGlvbnMnO1xuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnLi8uLi9jb21tb24vUGFnaW5hdGlvbic7XG5cbmNsYXNzIEdvb2RzTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzaG93RGF0YToge30sXG4gICAgICBtb2RhbFNob3c6IGZhbHNlLFxuICAgICAga2V5V29yZDogJydcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgcmVxdWVzdCgnYWRtaW4vaG9tZS9nb29kcy1saXN0Jywge30sIHtsaW1pdDogMTAsIG9mZnNldDogMH0pXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICBpZiAocmVzLnJldENvZGUgPT09IDApIHtcbiAgICAgICAgICB0aGF0LnByb3BzLnNhdmVHb29kc0xpc3QocmVzLmRhdGEuZGF0YUFyciwgcmVzLmRhdGEudG90YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJlcXVlc3QoJ2NhdGVnb3J5L2dldC1jYXRlZ29yaWVzLWxpc3QnLCB7fSlcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMucmV0Q29kZSA9PT0gMCkge1xuICAgICAgICAgIHRoYXQucHJvcHMuc2F2ZUNhdGVnb3JpZXNMaXN0KHJlcy5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBzaG93TW9kYWwgPSAoaWQsIGtleSkgPT4ge1xuICAgIGlmIChpZCAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICByZXF1ZXN0KGBhZG1pbi9ob21lL2dldC1nb29kcy1pbmZvLyR7aWR9YCwge30pXG4gICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgaWYgKHJlcy5yZXRDb2RlID09PSAwKSB7XG4gICAgICAgICAgICB0aGF0LnByb3BzLnBpY2tHb29kRGV0YWlsKHJlcy5kYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb3BzLnBpY2tHb29kRGV0YWlsKGNvbW1vbi5ub0RhdGFHb29kKTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBrZXlXb3JkOiBrZXksXG4gICAgICBtb2RhbFNob3c6IHRydWVcbiAgICB9KTtcbiAgfTtcblxuICBtb2RhbENsb3NlID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kYWxTaG93OiBmYWxzZVxuICAgIH0pO1xuICB9O1xuXG4gIHBhZ2VDaGFuZ2UgPSBpbmRleCA9PiB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgcmVxdWVzdCgnYWRtaW4vaG9tZS9nb29kcy1saXN0Jywge30sIHtsaW1pdDogMTAsIG9mZnNldDogKGluZGV4IC0gMSkgKiAxMH0pXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICBpZiAocmVzLnJldENvZGUgPT09IDApIHtcbiAgICAgICAgICB0aGF0LnByb3BzLnNhdmVHb29kc0xpc3QocmVzLmRhdGEuZGF0YUFyciwgcmVzLmRhdGEudG90YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGF0YVJvdyA9IHRoaXMucHJvcHMuZ29vZHNMaXN0Lmdvb2RzTGlzdDtcbiAgICByZXR1cm4gKFxuICAgICAgPFBhcGVyPlxuICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICBzdHlsZT17e21hcmdpbjogJzhweCd9fVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd01vZGFsKG51bGwsICdhZGRHb29kcycpO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICDmt7vliqBcbiAgICAgICAgPC9SYWlzZWRCdXR0b24+XG4gICAgICAgIDxUYWJsZT5cbiAgICAgICAgICA8VGFibGVIZWFkZXJcbiAgICAgICAgICAgIGRpc3BsYXlTZWxlY3RBbGw9e2ZhbHNlfVxuICAgICAgICAgICAgYWRqdXN0Rm9yQ2hlY2tib3g9e2ZhbHNlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUYWJsZVJvdz5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PklEPC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuYmlnQ29sdW1ufT7llYblk4HlkI3np7A8L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+5ZWG5ZOB5Lu35qC8PC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PuW6k+WtmDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT7plIDph488L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5iaWdDb2x1bW59PuaTjeS9nDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgIDwvVGFibGVIZWFkZXI+XG4gICAgICAgICAgPFRhYmxlQm9keSBkaXNwbGF5Um93Q2hlY2tib3g9e2ZhbHNlfT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZGF0YVJvdy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxUYWJsZVJvdyBrZXk9e2l0ZW0uaWR9IHNlbGVjdGFibGU9e2ZhbHNlfT5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmlkfTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLmJpZ0NvbHVtbn0+e2l0ZW0uZ29vZHNfbmFtZX08L1RhYmxlUm93Q29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8VGFibGVSb3dDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+e2l0ZW0uZ29vZHNfcHJpY2V9PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmdvb2RzX3N0b3JhZ2V9PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmdvb2RzX3NhbGVudW19PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuYmlnQ29sdW1ufT5cbiAgICAgICAgICAgICAgICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dNb2RhbChpdGVtLmlkLCAnc2hvd0RldGFpbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICA+5p+l55yL6K+m5oOFPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TW9kYWwoaXRlbS5pZCwgJ2VkaXREZXRhaWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPue8lui+kTwvUmFpc2VkQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxSYWlzZWRCdXR0b24gcHJpbWFyeT17dHJ1ZX0+5Yig6ZmkPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9UYWJsZUJvZHk+XG4gICAgICAgIDwvVGFibGU+XG4gICAgICAgIDxQYWdpbmF0aW9uXG4gICAgICAgICAgdG90YWw9e3RoaXMucHJvcHMuZ29vZHNMaXN0Lmdvb2RzVG90YWx9XG4gICAgICAgICAgbGltaXQ9ezEwfVxuICAgICAgICAgIHBhZ2VDaGFuZ2U9e3RoaXMucGFnZUNoYW5nZX1cbiAgICAgICAgLz5cbiAgICAgICAgPERldGFpbE1vZGFsXG4gICAgICAgICAga2V5V29yZD17dGhpcy5zdGF0ZS5rZXlXb3JkfVxuICAgICAgICAgIG9wZW49e3RoaXMuc3RhdGUubW9kYWxTaG93fVxuICAgICAgICAgIGhhbmRsZUNsb3NlPXt0aGlzLm1vZGFsQ2xvc2V9XG4gICAgICAgIC8+XG4gICAgICA8L1BhcGVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgc3RhdGUgPT4gKHtcbiAgICBnb29kc0xpc3Q6IHN0YXRlLmdvb2RzTGlzdC50b0pTKClcbiAgfSksXG4gIGRpc3BhdGNoID0+ICh7XG4gICAgc2F2ZUdvb2RzTGlzdDogKGRhdGFBcnIsdG90YWwpID0+IGRpc3BhdGNoKGdvb2RzTGlzdC5zYXZlR29vZHNMaXN0KGRhdGFBcnIsdG90YWwpKSxcbiAgICBzYXZlQ2F0ZWdvcmllc0xpc3Q6IGRhdGFPYmogPT4gZGlzcGF0Y2goY2F0ZWdvcmllc0xpc3Quc2F2ZUNhdGVnb3JpZXNMaXN0KGRhdGFPYmopKSxcbiAgICBwaWNrR29vZERldGFpbDogZGF0YU9iaiA9PiBkaXNwYXRjaChnb29kc0xpc3QucGlja0dvb2REZXRhaWwoZGF0YU9iaikpXG4gIH0pXG4pKEdvb2RzTGlzdCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvZ29vZHNMaXN0L0dvb2RzTGlzdC5qcyIsImltcG9ydCB7XG4gIERpYWxvZyxcbiAgUmFpc2VkQnV0dG9uLFxuICBTdGVwLFxuICBTdGVwcGVyLFxuICBTdGVwQnV0dG9uXG59IGZyb20gJ21hdGVyaWFsLXVpJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQWRkR29vZHNEZXRhaWwgZnJvbSAnLi9BZGRHb29kc0RldGFpbCc7XG5pbXBvcnQgQWRkSW1hZ2UgZnJvbSAnLi9BZGRJbWFnZSc7XG5pbXBvcnQgQWRkR29vZFNwZWMgZnJvbSAnLi9BZGRHb29kU3BlYyc7XG5pbXBvcnQge3JlcXVlc3R9IGZyb20gJy4vLi4vLi4vY29tbW9uL3JlcXVlc3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5cbmNsYXNzIERldGFpbE1vZGFsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0ZXBJbmRleDogMCxcbiAgICAgIGZpbGVVcmw6ICcnXG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZUNsb3NlID0gKCkgPT4ge1xuICAgIHRoaXMucHJvcHMuaGFuZGxlQ2xvc2UoKTtcbiAgfTtcblxuICBnZXRTdGVwQ29udGVudCA9IChzdGVwSW5kZXgpID0+IHtcbiAgICBjb25zdCB7a2V5V29yZH0gPSB0aGlzLnByb3BzO1xuICAgIHN3aXRjaCAoc3RlcEluZGV4KSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiA8QWRkR29vZHNEZXRhaWwga2V5V29yZD17a2V5V29yZH0vPjtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIDxBZGRJbWFnZSBrZXlXb3JkPXtrZXlXb3JkfS8+O1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gPEFkZEdvb2RTcGVjIGtleVdvcmQ9e2tleVdvcmR9Lz47XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH07XG5cbiAgaGFuZGxlUHJldiA9ICgpID0+IHtcbiAgICBjb25zdCB7c3RlcEluZGV4fSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKHN0ZXBJbmRleCA+IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3N0ZXBJbmRleDogc3RlcEluZGV4IC0gMX0pO1xuICAgIH1cbiAgfTtcblxuICBoYW5kbGVOZXh0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHtzdGVwSW5kZXh9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoc3RlcEluZGV4ID09PSAyKSB7XG4gICAgICB0aGlzLmhhbmRsZUNvbmZpcm0oKTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzdGVwSW5kZXg6IHN0ZXBJbmRleCA9PT0gMiA/IHN0ZXBJbmRleCA6IHN0ZXBJbmRleCArIDFcbiAgICB9KTtcbiAgfTtcblxuICBoYW5kbGVDb25maXJtID0gKCkgPT4ge1xuICAgIGNvbnN0IHF1ZXJ5RGF0YSA9IHRoaXMucHJvcHMuZ29vZHNMaXN0LmVkaXRHb29kO1xuICAgIGNvbnN0IGtleVdvcmQgPSB0aGlzLnByb3BzLmtleVdvcmQ7XG4gICAgbGV0IHVybCA9ICcnO1xuICAgIHN3aXRjaCAoa2V5V29yZCkge1xuICAgICAgY2FzZSAnc2hvd0RldGFpbCc6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ2VkaXREZXRhaWwnOlxuICAgICAgICB1cmwgPSAnYWRtaW4vZ29vZHMvZWRpdC1nb29kcyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWRkR29vZHMnOlxuICAgICAgICB1cmwgPSAnYWRtaW4vZ29vZHMvYWRkLWdvb2RzJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGdvb2RzX3NwZWMgPSBxdWVyeURhdGEuZ29vZHNfc3BlYztcbiAgICBjb25zdCBnb29kc1NwZWMgPSB7fTtcbiAgICBnb29kc19zcGVjLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCB7a2V5LCB2YWx1ZX0gPSBpdGVtO1xuICAgICAgZ29vZHNTcGVjW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICBxdWVyeURhdGEuZ29vZHNfc3BlYyA9IGdvb2RzU3BlYztcbiAgICAvLyDmlbDmja7moKHpqoxcbiAgICBjb25zdCB7XG4gICAgICBnb29kc19uYW1lLFxuICAgICAgZ29vZHNfcHJpY2UsXG4gICAgICBnb29kc19tYXJrZXRwcmljZSxcbiAgICAgIGV2YWx1YXRpb25fY291bnQsXG4gICAgICBldmFsdWF0aW9uX2dvb2Rfc3RhcixcbiAgICAgIGdvb2RzX3N0b3JhZ2UsXG4gICAgICBnb29kc19zYWxlbnVtLFxuICAgICAgZ29vZHNfZnJlaWdodCxcbiAgICAgIGdvb2RzX2NsaWNrLFxuICAgICAgZ29vZHNfaW1hZ2UsXG4gICAgfSA9IHF1ZXJ5RGF0YTtcblxuICAgIGlmICghZ29vZHNfbmFtZSkge1xuICAgICAgYWxlcnQoJ+WVhuWTgeWQjeensOS4jeiDveS4uuepuu+8gScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWdvb2RzX3ByaWNlIHx8IHR5cGVvZiBwYXJzZUludChnb29kc19wcmljZSkgIT09ICdudW1iZXInKSB7XG4gICAgICBhbGVydCgn5ZWG5ZOB5Lu35qC86L6T5YWl5pyJ6K+v5oiW5pyq6L6T5YWl77yBJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZ29vZHNfbWFya2V0cHJpY2UgfHwgaXNOYU4ocGFyc2VJbnQoZ29vZHNfbWFya2V0cHJpY2UpKSkge1xuICAgICAgYWxlcnQoJ+WVhuWTgeW4guWcuuS7t+i+k+WFpeacieivr+aIluacqui+k+WFpScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNOYU4ocGFyc2VJbnQoZXZhbHVhdGlvbl9nb29kX3N0YXIpKSkge1xuICAgICAgYWxlcnQoJ+WVhuWTgeivhOaYn+i+k+WFpeacieivr++8jOW/hemhu+S4uuaVsOWtlycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNOYU4ocGFyc2VJbnQoZXZhbHVhdGlvbl9jb3VudCkpKSB7XG4gICAgICBhbGVydCgn5ZWG5ZOB6K+E5Lu35pWw6L6T5YWl5pyJ6K+v77yM5b+F6aG75Li65pWw5a2XJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc05hTihwYXJzZUludChnb29kc19zdG9yYWdlKSkpIHtcbiAgICAgIGFsZXJ0KCfllYblk4HlupPlrZjovpPlhaXmnInor6/vvIzlv4XpobvkuLrmlbDlrZcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzTmFOKHBhcnNlSW50KGdvb2RzX3NhbGVudW0pKSkge1xuICAgICAgYWxlcnQoJ+WVhuWTgemUgOmHj+i+k+WFpeacieivr++8jOW/hemhu+S4uuaVsOWtlycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNOYU4ocGFyc2VJbnQoZ29vZHNfZnJlaWdodCkpKSB7XG4gICAgICBhbGVydCgn5ZWG5ZOB6L+Q6LS56L6T5YWl5pyJ6K+v77yM5b+F6aG75Li65pWw5a2XJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc05hTihwYXJzZUludChnb29kc19jbGljaykpKSB7XG4gICAgICBhbGVydCgn5ZWG5ZOB54K55Ye76YeP6L6T5YWl5pyJ6K+v77yM5b+F6aG75Li65pWw5a2XJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZ29vZHNfaW1hZ2UpIHtcbiAgICAgIGFsZXJ0KCfllYblk4HkuLvlm77kuLrlv4Xloavpobnnm64nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIHJlcXVlc3QodXJsLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHF1ZXJ5RGF0YSlcbiAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtrZXlXb3JkfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3N0ZXBJbmRleH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgbGV0IG1vZGFsVGl0bGUgPSAnJztcbiAgICBzd2l0Y2ggKGtleVdvcmQpIHtcbiAgICAgIGNhc2UgJ3Nob3dEZXRhaWwnOlxuICAgICAgICBtb2RhbFRpdGxlID0gJ+WVhuWTgeivpuaDhSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZWRpdERldGFpbCc6XG4gICAgICAgIG1vZGFsVGl0bGUgPSAn57yW6L6R6K+m5oOFJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhZGRHb29kcyc6XG4gICAgICAgIG1vZGFsVGl0bGUgPSAn5re75Yqg5ZWG5ZOBJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb25zdCBhY3Rpb25zID0gW1xuICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogMTJ9fT5cbiAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgIGxhYmVsPVwi5Y+W5raIXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsb3NlfVxuICAgICAgICAgIHN0eWxlPXt7bWFyZ2luUmlnaHQ6IDEyfX1cbiAgICAgICAgLz5cbiAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgIGxhYmVsPVwi5LiK5LiA5q2lXCJcbiAgICAgICAgICBkaXNhYmxlZD17c3RlcEluZGV4ID09PSAwfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUHJldn1cbiAgICAgICAgICBzdHlsZT17e21hcmdpblJpZ2h0OiAxMn19XG4gICAgICAgIC8+XG4gICAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgICBsYWJlbD17c3RlcEluZGV4ID09PSAyID8gJ+ehruiupOaPkOS6pCcgOiAn5LiL5LiA5q2lJ31cbiAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTmV4dH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIF07XG4gICAgY29uc3QgY29udGVudFN0eWxlID0ge21hcmdpbjogJzAgMTZweCd9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEaWFsb2dcbiAgICAgICAgb3Blbj17dGhpcy5wcm9wcy5vcGVufVxuICAgICAgICBhY3Rpb25zPXthY3Rpb25zfVxuICAgICAgICBhdXRvU2Nyb2xsQm9keUNvbnRlbnQ9e3RydWV9XG4gICAgICAgIHRpdGxlPXttb2RhbFRpdGxlfVxuICAgICAgPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7d2lkdGg6ICcxMDAlJywgbWF4V2lkdGg6IDcwMCwgbWFyZ2luOiAnYXV0byd9fT5cbiAgICAgICAgICA8U3RlcHBlciBsaW5lYXI9e2ZhbHNlfSBhY3RpdmVTdGVwPXtzdGVwSW5kZXh9PlxuICAgICAgICAgICAgPFN0ZXA+XG4gICAgICAgICAgICAgIDxTdGVwQnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgIHN0ZXBJbmRleDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9fT7ln7rmnKzkv6Hmga88L1N0ZXBCdXR0b24+XG4gICAgICAgICAgICA8L1N0ZXA+XG4gICAgICAgICAgICA8U3RlcD5cbiAgICAgICAgICAgICAgPFN0ZXBCdXR0b24gb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgc3RlcEluZGV4OiAxXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH19PuWbvueJh+S4iuS8oDwvU3RlcEJ1dHRvbj5cbiAgICAgICAgICAgIDwvU3RlcD5cbiAgICAgICAgICAgIDxTdGVwPlxuICAgICAgICAgICAgICA8U3RlcEJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICBzdGVwSW5kZXg6IDJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfX0+5ZWG5ZOB6KeE5qC8PC9TdGVwQnV0dG9uPlxuICAgICAgICAgICAgPC9TdGVwPlxuICAgICAgICAgIDwvU3RlcHBlcj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtjb250ZW50U3R5bGV9PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAge3RoaXMuZ2V0U3RlcENvbnRlbnQoc3RlcEluZGV4KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRGlhbG9nPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgc3RhdGUgPT4gKHtcbiAgICBnb29kc0xpc3Q6IHN0YXRlLmdvb2RzTGlzdC50b0pTKCksXG4gICAgY2F0ZWdvcmllc0xpc3Q6IHN0YXRlLmNhdGVnb3JpZXNMaXN0LnRvSlMoKVxuICB9KVxuKShEZXRhaWxNb2RhbCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvZ29vZHNMaXN0L0RldGFpbE1vZGFsLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIFRleHRGaWVsZCxcbiAgRGl2aWRlcixcbiAgU2VsZWN0RmllbGQsXG4gIE1lbnVJdGVtLFxufSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcbmltcG9ydCB7Z29vZHNMaXN0fSBmcm9tICcuLy4uLy4uL2FjdGlvbnMnO1xuXG5jbGFzcyBBZGRHb29kc0RldGFpbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuXG4gICAgY29uc3Qge2tleVdvcmQsIGNhdGVnb3JpZXNMaXN0LCBnb29kc0xpc3R9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAoa2V5V29yZCA9PT0gJ3Nob3dEZXRhaWwnKTtcblxuICAgIGNvbnN0IGVkaXRHb29kID0gZ29vZHNMaXN0LmVkaXRHb29kO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICBoaW50VGV4dD1cIuivt+i+k+WFpeWVhuWTgeWQjVwiXG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ9XCLllYblk4HlkI1cIlxuICAgICAgICAgIHN0eWxlPXt7d2lkdGg6ICcxMDAlJ319XG4gICAgICAgICAgdW5kZXJsaW5lU2hvdz17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgdmFsdWU9e2VkaXRHb29kLmdvb2RzX25hbWUgfHwgJyd9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXRjaEdvb2REZXRhaWwoe2dvb2RzX25hbWU6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPERpdmlkZXIvPlxuICAgICAgICA8U2VsZWN0RmllbGRcbiAgICAgICAgICBoaW50VGV4dD1cIuivt+mAieaLqeWVhuWTgeexu+Wei1wiXG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ9XCLllYblk4HnsbvlnotcIlxuICAgICAgICAgIHN0eWxlPXt7d2lkdGg6ICcxMDAlJ319XG4gICAgICAgICAgdW5kZXJsaW5lU2hvdz17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgdmFsdWU9e2VkaXRHb29kLmNhdGVnb3J5X2lkIHx8IDF9XG4gICAgICAgICAgb25DaGFuZ2U9eyhlLCBpLCB2KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnBhdGNoR29vZERldGFpbCh7Y2F0ZWdvcnlfaWQ6IHZ9KTtcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge1xuICAgICAgICAgICAgY2F0ZWdvcmllc0xpc3QuY2F0ZWdvcmllc0xpc3QubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxNZW51SXRlbSB2YWx1ZT17aXRlbS5pZH0ga2V5PXtpdGVtLmlkfSBwcmltYXJ5VGV4dD17aXRlbS5uYW1lfS8+XG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgPC9TZWxlY3RGaWVsZD5cbiAgICAgICAgPERpdmlkZXIvPlxuICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXlub/lkYror41cIlxuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi5bm/5ZGK6K+NXCJcbiAgICAgICAgICBzdHlsZT17e3dpZHRoOiAnMTAwJSd9fVxuICAgICAgICAgIHVuZGVybGluZVNob3c9e2ZhbHNlfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgIHZhbHVlPXtlZGl0R29vZC5nb29kc19qaW5nbGUgfHwgJyd9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXRjaEdvb2REZXRhaWwoe2dvb2RzX2ppbmdsZTogZS50YXJnZXQudmFsdWV9KTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8RGl2aWRlci8+XG4gICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICBoaW50VGV4dD1cIuivt+i+k+WFpeWVhuWTgeS7t+agvFwiXG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ9XCLllYblk4Hku7fmoLxcIlxuICAgICAgICAgIHN0eWxlPXt7d2lkdGg6ICcxMDAlJ319XG4gICAgICAgICAgdW5kZXJsaW5lU2hvdz17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgdmFsdWU9e2VkaXRHb29kLmdvb2RzX3ByaWNlIHx8ICcnfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGF0Y2hHb29kRGV0YWlsKHtnb29kc19wcmljZTogZS50YXJnZXQudmFsdWV9KTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8RGl2aWRlci8+XG4gICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICBoaW50VGV4dD1cIuivt+i+k+WFpeWVhuWTgeW4guWcuuS7t1wiXG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ9XCLluILlnLrku7dcIlxuICAgICAgICAgIHN0eWxlPXt7d2lkdGg6ICcxMDAlJ319XG4gICAgICAgICAgdW5kZXJsaW5lU2hvdz17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgdmFsdWU9e2VkaXRHb29kLmdvb2RzX21hcmtldHByaWNlIHx8ICcnfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGF0Y2hHb29kRGV0YWlsKHtnb29kc19tYXJrZXRwcmljZTogZS50YXJnZXQudmFsdWV9KTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8RGl2aWRlci8+XG4gICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICBoaW50VGV4dD1cIuivt+i+k+WFpeWVhuWTgeW6k+WtmFwiXG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ9XCLllYblk4HlupPlrZhcIlxuICAgICAgICAgIHN0eWxlPXt7d2lkdGg6ICcxMDAlJ319XG4gICAgICAgICAgdW5kZXJsaW5lU2hvdz17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgdmFsdWU9e2VkaXRHb29kLmdvb2RzX3N0b3JhZ2UgfHwgJyd9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXRjaEdvb2REZXRhaWwoe2dvb2RzX3N0b3JhZ2U6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPERpdmlkZXIvPlxuICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXllYblk4HplIDph49cIlxuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi5ZWG5ZOB6ZSA6YePXCJcbiAgICAgICAgICBzdHlsZT17e3dpZHRoOiAnMTAwJSd9fVxuICAgICAgICAgIHVuZGVybGluZVNob3c9e2ZhbHNlfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgIHZhbHVlPXtlZGl0R29vZC5nb29kc19zYWxlbnVtIHx8ICcnfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGF0Y2hHb29kRGV0YWlsKHtnb29kc19zYWxlbnVtOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxEaXZpZGVyLz5cbiAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgIGhpbnRUZXh0PVwi6K+36L6T5YWl5ZWG5ZOB6K6/6Zeu6YePXCJcbiAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dD1cIuWVhuWTgeiuv+mXrumHj1wiXG4gICAgICAgICAgc3R5bGU9e3t3aWR0aDogJzEwMCUnfX1cbiAgICAgICAgICB1bmRlcmxpbmVTaG93PXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17aXNEaXNhYmxlZH1cbiAgICAgICAgICB2YWx1ZT17ZWRpdEdvb2QuZ29vZHNfY2xpY2sgfHwgJyd9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXRjaEdvb2REZXRhaWwoe2dvb2RzX2NsaWNrOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxEaXZpZGVyLz5cbiAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgIGhpbnRUZXh0PVwi6K+36L6T5YWl5ZWG5ZOB6L+Q6LS5XCJcbiAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dD1cIuWVhuWTgei/kOi0uVwiXG4gICAgICAgICAgc3R5bGU9e3t3aWR0aDogJzEwMCUnfX1cbiAgICAgICAgICB1bmRlcmxpbmVTaG93PXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17aXNEaXNhYmxlZH1cbiAgICAgICAgICB2YWx1ZT17ZWRpdEdvb2QuZ29vZHNfZnJlaWdodCB8fCAnJ31cbiAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnBhdGNoR29vZERldGFpbCh7Z29vZHNfZnJlaWdodDogZS50YXJnZXQudmFsdWV9KTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8RGl2aWRlci8+XG4gICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICBoaW50VGV4dD1cIuivt+i+k+WFpeivhOS7t+aVsFwiXG4gICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ9XCLllYblk4Hor4Tku7fmlbBcIlxuICAgICAgICAgIHN0eWxlPXt7d2lkdGg6ICcxMDAlJ319XG4gICAgICAgICAgdW5kZXJsaW5lU2hvdz17ZmFsc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgdmFsdWU9e2VkaXRHb29kLmV2YWx1YXRpb25fY291bnQgfHwgJyd9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXRjaEdvb2REZXRhaWwoe2V2YWx1YXRpb25fY291bnQ6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPERpdmlkZXIvPlxuICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXllYblk4HmmJ/nuqdcIlxuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi5ZWG5ZOB5pif57qnXCJcbiAgICAgICAgICBzdHlsZT17e3dpZHRoOiAnMTAwJSd9fVxuICAgICAgICAgIHVuZGVybGluZVNob3c9e2ZhbHNlfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgIHZhbHVlPXtlZGl0R29vZC5ldmFsdWF0aW9uX2dvb2Rfc3RhciB8fCAnJ31cbiAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnBhdGNoR29vZERldGFpbCh7ZXZhbHVhdGlvbl9nb29kX3N0YXI6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPERpdmlkZXIvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBkaXNwYXRjaFNhdmVHb29kc0xpc3QgPSBkaXNwYXRjaCA9PiB7XG4gIHJldHVybiB7XG4gICAgc2F2ZUdvb2RzTGlzdDogZGF0YUFyciA9PiB7XG4gICAgICBkaXNwYXRjaChnb29kc0xpc3Quc2F2ZUdvb2RzTGlzdChkYXRhQXJyKSk7XG4gICAgfSxcbiAgICBzYXZlQ2F0ZWdvcmllc0xpc3Q6IGRhdGFBcnIgPT4ge1xuICAgICAgZGlzcGF0Y2goZ29vZHNMaXN0LnNhdmVDYXRlZ29yaWVzTGlzdChkYXRhQXJyKSk7XG4gICAgfSxcbiAgICBwYXRjaEdvb2REZXRhaWw6IGRhdGFPYmogPT4ge1xuICAgICAgZGlzcGF0Y2goZ29vZHNMaXN0LnBhdGNoR29vZERldGFpbChkYXRhT2JqKSk7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgc3RhdGUgPT4gKHtcbiAgICBnb29kc0xpc3Q6IHN0YXRlLmdvb2RzTGlzdC50b0pTKCksXG4gICAgY2F0ZWdvcmllc0xpc3Q6IHN0YXRlLmNhdGVnb3JpZXNMaXN0LnRvSlMoKVxuICB9KSxcbiAgZGlzcGF0Y2hTYXZlR29vZHNMaXN0XG4pKEFkZEdvb2RzRGV0YWlsKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9nb29kc0xpc3QvQWRkR29vZHNEZXRhaWwuanMiLCJleHBvcnQgY29uc3Qgc2F2ZUdvb2RzTGlzdCA9IChkYXRhQXJyLCB0b3RhbCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdTQVZFX0dPT0RTX0xJU1QnLFxuICAgIGRhdGFBcnIsXG4gICAgdG90YWxcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBwaWNrR29vZERldGFpbCA9IGRhdGFPYmogPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdQSUNLX0dPT0RfREVUQUlMJyxcbiAgICBkYXRhT2JqXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcGF0Y2hHb29kRGV0YWlsID0gZGF0YU9iaiA9PiB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1BBVENIX0dPT0RfREVUQUlMJyxcbiAgICBkYXRhT2JqXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcGF0Y2hHb29kc0xpc3QgPSAoaWQsIGRhdGFPYmopID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnUEFUQ0hfR09PRFNfTElTVCcsXG4gICAgaWQsIGRhdGFPYmpcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBhZGRTcGVjID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdBRERfU1BFQydcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBlZGl0U3BlYyA9IChpbmRleCwgZGF0YU9iaikgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdFRElUX1NQRUMnLFxuICAgIGluZGV4LCBkYXRhT2JqXG4gIH07XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hY3Rpb25zL2dvb2RzTGlzdC5qcyIsImV4cG9ydCBjb25zdCBzYXZlQ2F0ZWdvcmllc0xpc3QgPSBkYXRhQXJyID0+IHtcbiAgcmV0dXJue1xuICAgIHR5cGU6ICdTQVZFX0NBVEVHT1JJRVNfTElTVCcsXG4gICAgZGF0YUFyclxuICB9O1xufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWN0aW9ucy9jYXRlZ29yaWVzTGlzdC5qcyIsImV4cG9ydCBjb25zdCBzYXZlT3JkZXJMaXN0ID0gKGRhdGFBcnIsIHRvdGFsKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1NBVkVfT1JERVJfTElTVCcsXG4gICAgZGF0YUFycixcbiAgICB0b3RhbFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHBpY2tPcmRlckRldGFpbCA9IGRhdGFPYmogPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdQSUNLX09SREVSX0RFVEFJTCcsXG4gICAgZGF0YU9ialxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHBhdGNoT3JkZXJMaXN0ID0gKGlkLCBkYXRhT2JqKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1BBVENIX09SREVSX0xJU1QnLFxuICAgIGlkLCBkYXRhT2JqXG4gIH07XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hY3Rpb25zL29yZGVyc0xpc3QuanMiLCJleHBvcnQgY29uc3Qgc2F2ZUFjdGl2ZUxpc3QgPSAoZGF0YUFyciwgdG90YWwpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnU0FWRV9BQ1RJVkVfTElTVCcsXG4gICAgZGF0YUFycixcbiAgICB0b3RhbFxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgcGlja0FjdGl2ZURldGFpbCA9IChkYXRhT2JqKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1BJQ0tfQUNUSVZFX0RFVEFJTCcsXG4gICAgZGF0YU9ialxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgcGF0Y2hBY3RpdmVEZXRhaWwgPSAoZGF0YU9iaikgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdQQVRDSF9BQ1RJVkVfREVUQUlMJyxcbiAgICBkYXRhT2JqXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBwYXRjaEFjdGl2ZUxpc3QgPSAoaWQsIGRhdGFPYmopID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnUEFUQ0hfQUNUSVZFX0xJU1QnLFxuICAgIGlkLFxuICAgIGRhdGFPYmpcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGFkZEFjdGl2ZUdvb2RzID0gaWQgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdBRERfQUNUSVZFX0dPT0RTJyxcbiAgICBpZFxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZWRpdEFjdGl2ZUdvb2RzID0gKG51bWJlcikgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdFRElUX0FDVElWRV9HT09EUycsXG4gICAgbnVtYmVyXG4gIH1cbn07XG5cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWN0aW9ucy9hY3RpdmVMaXN0LmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtnb29kc0xpc3R9IGZyb20gJy4vLi4vLi4vYWN0aW9ucyc7XG5pbXBvcnQge1JhaXNlZEJ1dHRvbiwgRGlhbG9nfSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQgQXZhdGFyRWRpdG9yIGZyb20gJ3JlYWN0LWF2YXRhci1lZGl0b3InO1xuaW1wb3J0IHtzdHlsZXN9IGZyb20gJy4vR29vZHNMaXN0U3R5bGVzJztcbmltcG9ydCB1cGxvYWQgZnJvbSAnLi8uLi8uLi9jb21tb24vaW1hZ2UvdXBsb2FkLnBuZyc7XG5cbmNsYXNzIEFkZEltYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZpbGVVcmw6ICcnLFxuICAgICAgaW1nRmllbGRPcGVuOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBzaW5nbGVGaWxlU2VsZWN0ID0gZSA9PiB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgaW1hZ2UgPSBlLmN1cnJlbnRUYXJnZXQuZmlsZXNbMF07XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWFnZSk7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgaW1nRmllbGRPcGVuOiB0cnVlLFxuICAgICAgICBmaWxlVXJsOiBlLnRhcmdldC5yZXN1bHRcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgc2VjRmlsZVNlbGVjdCA9IChlLCBrZXkpID0+IHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBpbWFnZSA9IGUuY3VycmVudFRhcmdldC5maWxlc1swXTtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGltYWdlKTtcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgICAgb2JqW2tleV0gPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICB0aGF0LnByb3BzLnBhdGNoR29vZERldGFpbChvYmopO1xuICAgIH07XG4gIH07XG5cbiAgc2V0RWRpdG9yUmVmID0gZWRpdG9yID0+IHtcbiAgICBpZiAoZWRpdG9yKSB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgfTtcblxuICBoYW5kbGVTYXZlID0gKCkgPT4ge1xuICAgIGNvbnN0IGltZyA9IHRoaXMuZWRpdG9yLmdldEltYWdlU2NhbGVkVG9DYW52YXMoKS50b0RhdGFVUkwoKTtcbiAgICB0aGlzLnByb3BzLnBhdGNoR29vZERldGFpbCh7Z29vZHNfaW1hZ2U6IGltZ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe2ltZ0ZpZWxkT3BlbjogZmFsc2V9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZWRpdEdvb2QgPSB0aGlzLnByb3BzLmdvb2RzTGlzdC5lZGl0R29vZDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGltZ1xuICAgICAgICAgIHNyYz17ZWRpdEdvb2QuZ29vZHNfaW1hZ2UgfHwgdXBsb2FkfVxuICAgICAgICAgIHN0eWxlPXtzdHlsZXMubWFpbkltYWdlfVxuICAgICAgICAgIGFsdD17dXBsb2FkfVxuICAgICAgICAvPlxuICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgbGFiZWw9XCJcIlxuICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlcy5maWxlU2VsZWN0Q29udGVudH1cbiAgICAgICAgPlxuICAgICAgICAgIOS4iuS8oOWbvueJh1xuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5maWxlU2VsZWN0fVxuICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvZ2lmLGltYWdlL2pwZWcsaW1hZ2UvcG5nXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnNpbmdsZUZpbGVTZWxlY3R9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9SYWlzZWRCdXR0b24+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgc3R5bGU9e3ttYXJnaW5Cb3R0b206ICcxMnB4JywgZGlzcGxheTogJ2Jsb2NrJ319XG4gICAgICAgID7or7fkuIrkvKDkuqflk4HkuLvlm77vvIzkuLvlm77kvJrlnKjkuqflk4HliJfooajlkozkuqflk4Hor6bmg4XkuK3lkYjnjrDvvIzlsLrlr7jlu7rorq7kuLrlrr3luqbkuLo3NTDlg4/ntKDvvIzplb/luqbkuLo2MzXlg4/ntKDvvIzlm77niYflpKflsI/lu7rorq7lsI/kuo4xTTwvc3Bhbj5cbiAgICAgICAgPGRpdiBzdHlsZT17e2hlaWdodDogMjcyfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLnNlY0ltYWdlSXRlbX0+XG4gICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgIHNyYz17ZWRpdEdvb2QuaW1hZ2UxIHx8IHVwbG9hZH1cbiAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5kZXRhaWxJbWFnZX1cbiAgICAgICAgICAgICAgYWx0PXt1cGxvYWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgICAgICBsYWJlbD1cIlwiXG4gICAgICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMuZmlsZVNlbGVjdENvbnRlbnR9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIOS4iuS8oOWbvueJhzFcbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5maWxlU2VsZWN0fVxuICAgICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgICBhY2NlcHQ9XCJpbWFnZS9naWYsaW1hZ2UvanBlZyxpbWFnZS9wbmdcIlxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMuc2VjRmlsZVNlbGVjdChlLCdpbWFnZTEnKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvUmFpc2VkQnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5zZWNJbWFnZUl0ZW19PlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzcmM9e2VkaXRHb29kLmltYWdlMiB8fCB1cGxvYWR9XG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMuZGV0YWlsSW1hZ2V9XG4gICAgICAgICAgICAgIGFsdD17dXBsb2FkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgICAgICAgbGFiZWw9XCJcIlxuICAgICAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLmZpbGVTZWxlY3RDb250ZW50fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICDkuIrkvKDlm77niYcyXG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMuZmlsZVNlbGVjdH1cbiAgICAgICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICAgICAgYWNjZXB0PVwiaW1hZ2UvZ2lmLGltYWdlL2pwZWcsaW1hZ2UvcG5nXCJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB0aGlzLnNlY0ZpbGVTZWxlY3QoZSwnaW1hZ2UyJyl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L1JhaXNlZEJ1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuc2VjSW1hZ2VJdGVtfT5cbiAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgc3JjPXtlZGl0R29vZC5pbWFnZTMgfHwgdXBsb2FkfVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLmRldGFpbEltYWdlfVxuICAgICAgICAgICAgICBhbHQ9e3VwbG9hZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgICAgIGxhYmVsPVwiXCJcbiAgICAgICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5maWxlU2VsZWN0Q29udGVudH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAg5LiK5Lyg5Zu+54mHM1xuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLmZpbGVTZWxlY3R9XG4gICAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgICAgIGFjY2VwdD1cImltYWdlL2dpZixpbWFnZS9qcGVnLGltYWdlL3BuZ1wiXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gdGhpcy5zZWNGaWxlU2VsZWN0KGUsJ2ltYWdlMycpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIHN0eWxlPXt7ZGlzcGxheTogJ2Jsb2NrJyx9fVxuICAgICAgICA+6K+35LiK5Lyg5Lqn5ZOB6K+m5oOF5Zu+54mH77yM5bu66K6u5a695bqm5Li6NzUw5YOP57Sg77yM6ZW/5bqm5LiN6ZmQ77yM5Zu+54mH5aSn5bCP5bu66K6u5bCP5LqOMU08L3NwYW4+XG4gICAgICAgIDxEaWFsb2dcbiAgICAgICAgICBjb250ZW50U3R5bGU9e3t3aWR0aDogJzY2OHB4J319XG4gICAgICAgICAgb3Blbj17dGhpcy5zdGF0ZS5pbWdGaWVsZE9wZW59PlxuICAgICAgICAgIDxBdmF0YXJFZGl0b3JcbiAgICAgICAgICAgIHJlZj17dGhpcy5zZXRFZGl0b3JSZWZ9XG4gICAgICAgICAgICBvblNhdmU9e3RoaXMuaGFuZGxlU2F2ZX1cbiAgICAgICAgICAgIGltYWdlPXt0aGlzLnN0YXRlLmZpbGVVcmx9XG4gICAgICAgICAgICB3aWR0aD17NjAwfVxuICAgICAgICAgICAgaGVpZ2h0PXs0Mjh9XG4gICAgICAgICAgICBib3JkZXI9ezEwfVxuICAgICAgICAgICAgY29sb3I9e1syNTUsIDI1NSwgMjU1LCAwLjZdfSAvLyBSR0JBXG4gICAgICAgICAgICBzY2FsZT17MX1cbiAgICAgICAgICAgIHJvdGF0ZT17MH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgICAgIHN0eWxlPXt7ZGlzcGxheTogJ2Jsb2NrJ319XG4gICAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVTYXZlfVxuICAgICAgICAgID7noa7orqQ8L1JhaXNlZEJ1dHRvbj5cbiAgICAgICAgPC9EaWFsb2c+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIHN0YXRlID0+ICh7XG4gICAgZ29vZHNMaXN0OiBzdGF0ZS5nb29kc0xpc3QudG9KUygpXG4gIH0pLFxuICBkaXNwYXRjaCA9PiAoe1xuICAgIHBhdGNoR29vZERldGFpbDogZGF0YU9iaiA9PiBkaXNwYXRjaChnb29kc0xpc3QucGF0Y2hHb29kRGV0YWlsKGRhdGFPYmopKVxuICB9KVxuKShBZGRJbWFnZSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvZ29vZHNMaXN0L0FkZEltYWdlLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtnb29kc0xpc3R9IGZyb20gJy4vLi4vLi4vYWN0aW9ucyc7XG5pbXBvcnQge1RleHRGaWVsZCwgRmxvYXRpbmdBY3Rpb25CdXR0b259IGZyb20gJ21hdGVyaWFsLXVpJztcbmltcG9ydCBBdlBsYXlsaXN0QWRkIGZyb20gJ21hdGVyaWFsLXVpL3N2Zy1pY29ucy9hdi9wbGF5bGlzdC1hZGQnO1xuaW1wb3J0IHtzdHlsZXN9IGZyb20gJy4vR29vZHNMaXN0U3R5bGVzJztcblxuY2xhc3MgQWRkR29vZFNwZWMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZmlsZVVybDogJycsXG4gICAgICBpbWdGaWVsZE9wZW46IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGFkZFNwZWMgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMua2V5V29yZCAhPT0gJ3Nob3dEZXRhaWwnKVxuICAgICAgdGhpcy5wcm9wcy5hZGRTcGVjKCk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGdvb2RTcGVjID0gdGhpcy5wcm9wcy5nb29kc0xpc3QuZWRpdEdvb2QuZ29vZHNfc3BlYztcbiAgICBjb25zdCBrZXlXb3JkID0gdGhpcy5wcm9wcy5rZXlXb3JkO1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAoa2V5V29yZCA9PT0gJ3Nob3dEZXRhaWwnKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2dvb2RTcGVjLm1hcCgoaXRlbSwgaWR4KSA9PiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLnNwZWNJdGVtfT5cbiAgICAgICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXop4TmoLzmoIfpophcIlxuICAgICAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dD1cIuinhOagvOagh+mimFwiXG4gICAgICAgICAgICAgIHZhbHVlPXtpdGVtLmtleX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmVkaXRTcGVjKGlkeCwge2tleTogZS50YXJnZXQudmFsdWV9KTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlcy5zcGVjS2V5fVxuICAgICAgICAgICAgLz46XG4gICAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICAgIGhpbnRUZXh0PVwi6K+36L6T5YWl6KeE5qC85YC8XCJcbiAgICAgICAgICAgICAgZmxvYXRpbmdMYWJlbFRleHQ9XCLop4TmoLzlgLxcIlxuICAgICAgICAgICAgICB2YWx1ZT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzRGlzYWJsZWR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmVkaXRTcGVjKGlkeCwge3ZhbHVlOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLnNwZWNWYWx1ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7d2lkdGg6ICcxMDAlJywgcGFkZGluZzogJzEycHggNDZweCcsIGJveFNpemluZzogJ2JvcmRlci1ib3gnfX0+XG4gICAgICAgICAgPEZsb2F0aW5nQWN0aW9uQnV0dG9uXG4gICAgICAgICAgICBpY29uU3R5bGU9e3N0eWxlcy5zcGVjQWRkQnRufVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDEwMFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuYWRkU3BlY31cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QXZQbGF5bGlzdEFkZC8+XG4gICAgICAgICAgPC9GbG9hdGluZ0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgbWFyZ2luVG9wOiAxMn19XG4gICAgICAgICAgPumcgOimgea3u+WKoOaWsOeahOinhOagvOS/oeaBr++8jOeCueWHu+a3u+WKoOaMiemSru+8jOW3puS+p+Whq+WGmeinhOagvOagh+mimO+8jOWPs+S+p+Whq+WGmeinhOagvOS/oeaBr++8gTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIHN0YXRlID0+ICh7XG4gICAgZ29vZHNMaXN0OiBzdGF0ZS5nb29kc0xpc3QudG9KUygpXG4gIH0pLFxuICBkaXNwYXRjaCA9PiAoe1xuICAgIHBhdGNoR29vZERldGFpbDogZGF0YU9iaiA9PiBkaXNwYXRjaChnb29kc0xpc3QucGF0Y2hHb29kRGV0YWlsKGRhdGFPYmopKSxcbiAgICBhZGRTcGVjOiAoKSA9PiBkaXNwYXRjaChnb29kc0xpc3QuYWRkU3BlYygpKSxcbiAgICBlZGl0U3BlYzogKGluZGV4LCBkYXRhT2JqKSA9PiBkaXNwYXRjaChnb29kc0xpc3QuZWRpdFNwZWMoaW5kZXgsIGRhdGFPYmopKVxuICB9KVxuKShBZGRHb29kU3BlYyk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvZ29vZHNMaXN0L0FkZEdvb2RTcGVjLmpzIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygzKSkoMjEpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9yZWNvbXBvc2UvcHVyZS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXzdlYzQzMjk2YjU3MmI0N2Q1YmE1XG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDMpKSgyMCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL21hdGVyaWFsLXVpL1N2Z0ljb24vaW5kZXguanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcl83ZWM0MzI5NmI1NzJiNDdkNWJhNVxuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMuc3R5bGVzID0ge1xuICBidXR0b246e1xuICAgIHdpZHRoOiA0NyxcbiAgICBoZWlnaHQ6IDQ3LFxuICAgIG1pbldpZHRoOiA0N1xuICB9LFxuICBwYWdlQ29udGFpbmVyOiB7XG4gICAgbWF4V2lkdGg6IDUxNyxcbiAgICBoZWlnaHQ6IDQ3LFxuICAgIG1hcmdpbjogJzAgYXV0bydcbiAgfVxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9jb21tb24vUGFnZVN0eWxlLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7cmVxdWVzdH0gZnJvbSAnLi8uLi8uLi9jb21tb24vcmVxdWVzdCc7XG5pbXBvcnQge1xuICBUYWJsZSxcbiAgVGFibGVCb2R5LFxuICBUYWJsZUhlYWRlcixcbiAgVGFibGVIZWFkZXJDb2x1bW4sXG4gIFRhYmxlUm93LFxuICBUYWJsZVJvd0NvbHVtbixcbiAgUmFpc2VkQnV0dG9uLFxuICBQYXBlclxufSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQge3N0eWxlc30gZnJvbSAnLi9Hb29kc0xpc3RTdHlsZXMnO1xuXG5jbGFzcyBDYXRlZ29yeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7fTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHJlcXVlc3QoJ2NhdGVnb3J5L2dldC1jYXRlZ29yaWVzLWxpc3QnLCB7fSlcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMucmV0Q29kZSA9PT0gMCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRhdGFSb3cgPSBbXTtcbiAgICByZXR1cm4gKFxuICAgICAgPFBhcGVyPlxuICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICBzdHlsZT17e21hcmdpbjogJzhweCd9fVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd01vZGFsKG51bGwsICdhZGRHb29kcycpO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICDmt7vliqBcbiAgICAgICAgPC9SYWlzZWRCdXR0b24+XG4gICAgICAgIDxUYWJsZT5cbiAgICAgICAgICA8VGFibGVIZWFkZXJcbiAgICAgICAgICAgIGRpc3BsYXlTZWxlY3RBbGw9e2ZhbHNlfVxuICAgICAgICAgICAgYWRqdXN0Rm9yQ2hlY2tib3g9e2ZhbHNlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUYWJsZVJvdz5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PklEPC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuYmlnQ29sdW1ufT7llYblk4HlkI3np7A8L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+5ZWG5ZOB5Lu35qC8PC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PuW6k+WtmDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT7plIDph488L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5iaWdDb2x1bW59PuaTjeS9nDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgIDwvVGFibGVIZWFkZXI+XG4gICAgICAgICAgPFRhYmxlQm9keSBkaXNwbGF5Um93Q2hlY2tib3g9e2ZhbHNlfT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZGF0YVJvdy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxUYWJsZVJvdyBrZXk9e2l0ZW0uaWR9IHNlbGVjdGFibGU9e2ZhbHNlfT5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmlkfTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLmJpZ0NvbHVtbn0+e2l0ZW0uZ29vZHNfbmFtZX08L1RhYmxlUm93Q29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8VGFibGVSb3dDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+e2l0ZW0uZ29vZHNfcHJpY2V9PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmdvb2RzX3N0b3JhZ2V9PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmdvb2RzX3NhbGVudW19PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuYmlnQ29sdW1ufT5cbiAgICAgICAgICAgICAgICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dNb2RhbChpdGVtLmlkLCAnc2hvd0RldGFpbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICA+5p+l55yL6K+m5oOFPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TW9kYWwoaXRlbS5pZCwgJ2VkaXREZXRhaWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgPue8lui+kTwvUmFpc2VkQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgIDxSYWlzZWRCdXR0b24gcHJpbWFyeT17dHJ1ZX0+5Yig6ZmkPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9UYWJsZUJvZHk+XG4gICAgICAgIDwvVGFibGU+XG4gICAgICA8L1BhcGVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2F0ZWdvcnk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvY2F0ZWdvcnkvQ2F0ZWdvcnkuanMiLCJtb2R1bGUuZXhwb3J0cy5zdHlsZXMgPSB7XG4gIHNtYWxsQ29sdW1uOiB7XG4gICAgd2lkdGg6ICcyMHB4JyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnXG4gIH0sXG4gIGJpZ0NvbHVtbjoge1xuICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcidcbiAgfSxcbiAgbWlkZGxlQ29sdW1uOiB7XG4gICAgd2lkdGg6ICc4MHB4JyxcbiAgfSxcbiAgc2VjSW1hZ2VJdGVtOiB7XG4gICAgbWFyZ2luVG9wOiAnMTJweCcsXG4gICAgd2lkdGg6IDE1MCxcbiAgICBmbG9hdDogJ2xlZnQnLFxuICAgIG1hcmdpblJpZ2h0OiAxMlxuICB9LFxuICBmaWxlU2VsZWN0OiB7XG4gICAgb3BhY2l0eTogMCxcbiAgICBmaWx0ZXI6ICdhbHBoYShvcGFjaXR5PTApJyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogJzBweCcsXG4gICAgbGVmdDogJzBweCdcbiAgfSxcbiAgZmlsZVNlbGVjdENvbnRlbnQ6IHtcbiAgICBtYXJnaW5SaWdodDogMTIsXG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICB3aWR0aDogJzE1MHB4JyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBtYXJnaW5Cb3R0b206ICcxMnB4JyxcbiAgfSxcbiAgbWFpbkltYWdlOiB7XG4gICAgd2lkdGg6IDMwMCxcbiAgICBoZWlnaHQ6IDIxNCxcbiAgICBtYXJnaW5Cb3R0b206ICcxMnB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICB9LFxuICBkZXRhaWxJbWFnZToge1xuICAgIHdpZHRoOiAxNTAsXG4gICAgaGVpZ2h0OiAyMDAsXG4gICAgbWFyZ2luQm90dG9tOiAnMTJweCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZicsXG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICBtYXJnaW5SaWdodDogJzEycHgnXG4gIH0sXG4gIHNwZWNLZXk6IHtcbiAgICB3aWR0aDogMTUwLFxuICAgIG1hcmdpblJpZ2h0OiAxMlxuICB9LFxuICBzcGVjVmFsdWU6IHtcbiAgICB3aWR0aDogMzAwLFxuICAgIG1hcmdpbkxlZnQ6IDEyXG4gIH0sXG4gIHNwZWNJdGVtOiB7XG4gICAgd2lkdGg6IDUwMCxcbiAgICBtYXJnaW46ICcwIGF1dG8nXG4gIH0sXG4gIHNwZWNBZGRCdG46IHtcbiAgICB3aWR0aDogMTAwLFxuICAgIGhlaWdodDogNDAsXG4gICAgYm9yZGVyUmFkaXVzOiAnMiUnLFxuICB9XG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL2NhdGVnb3J5L0dvb2RzTGlzdFN0eWxlcy5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3JlcXVlc3R9IGZyb20gJy4vLi4vLi4vY29tbW9uL3JlcXVlc3QnO1xuaW1wb3J0IHthY3RpdmVUeXBlLCBub0RhdGFBY3RpdmV9IGZyb20gJy4vLi4vLi4vY29tbW9uL2NvbW1vbic7XG5pbXBvcnQge1xuICBUYWJsZSxcbiAgVGFibGVCb2R5LFxuICBUYWJsZUhlYWRlcixcbiAgVGFibGVIZWFkZXJDb2x1bW4sXG4gIFRhYmxlUm93LFxuICBUYWJsZVJvd0NvbHVtbixcbiAgUmFpc2VkQnV0dG9uLFxuICBQYXBlclxufSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQge3N0eWxlc30gZnJvbSAnLi9Hb29kc0xpc3RTdHlsZXMnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2FjdGl2ZUxpc3R9IGZyb20gJy4vLi4vLi4vYWN0aW9ucyc7XG5pbXBvcnQgUGFnaW5hdGlvbiBmcm9tICcuLy4uL2NvbW1vbi9QYWdpbmF0aW9uJztcbmltcG9ydCBEZXRhaWxNb2RhbCBmcm9tICcuL0RldGFpbE1vZGFsJ1xuXG5jbGFzcyBBY3RpdmVMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1vZGFsU2hvdzogZmFsc2UsXG4gICAgICBrZXlXb3JkOiAnJ1xuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXF1ZXN0KCdhZG1pbi9hY3Rpdml0eS9saXN0Jywge30sIHtsaW1pdDogMTAsIG9mZnNldDogMH0pXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICBpZihyZXMucmV0Q29kZSA9PSAwKXtcbiAgICAgICAgICB0aGF0LnByb3BzLnNhdmVBY3RpdmVMaXN0KHJlcy5kYXRhLCByZXMudG90YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHNob3dNb2RhbCA9IChpZCwga2V5KSA9PiB7XG4gICAgaWYgKGlkICE9PSBudWxsKSB7XG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5waWNrQWN0aXZlRGV0YWlsKG5vRGF0YUFjdGl2ZSk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAga2V5V29yZDoga2V5LFxuICAgICAgbW9kYWxTaG93OiB0cnVlXG4gICAgfSk7XG4gIH07XG5cbiAgbW9kYWxDbG9zZSA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGFsU2hvdzogZmFsc2VcbiAgICB9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZGF0YVJvdyA9IHRoaXMucHJvcHMuYWN0aXZlTGlzdC5hY3RpdmVMaXN0O1xuICAgIHJldHVybiAoXG4gICAgICA8UGFwZXI+XG4gICAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgIHN0eWxlPXt7bWFyZ2luOiAnOHB4J319XG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zaG93TW9kYWwobnVsbCwgJ2FkZEFjdGl2ZScpO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICDmt7vliqBcbiAgICAgICAgPC9SYWlzZWRCdXR0b24+XG4gICAgICAgIDxUYWJsZT5cbiAgICAgICAgICA8VGFibGVIZWFkZXJcbiAgICAgICAgICAgIGRpc3BsYXlTZWxlY3RBbGw9e2ZhbHNlfVxuICAgICAgICAgICAgYWRqdXN0Rm9yQ2hlY2tib3g9e2ZhbHNlfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUYWJsZVJvdz5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PklEPC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59Pua0u+WKqOWQjeensDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT7mtLvliqjnsbvlnos8L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+5rS75Yqo5Yqb5bqmPC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PuW8gOWni+aXtumXtDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT7nu5PmnZ/ml7bpl7Q8L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5iaWdDb2x1bW59PuaTjeS9nDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICA8L1RhYmxlUm93PlxuICAgICAgICAgIDwvVGFibGVIZWFkZXI+XG4gICAgICAgICAgPFRhYmxlQm9keSBkaXNwbGF5Um93Q2hlY2tib3g9e2ZhbHNlfT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZGF0YVJvdy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIDxUYWJsZVJvdyBrZXk9e2l0ZW0uaWR9IHNlbGVjdGFibGU9e2ZhbHNlfT5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmlkfTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT57aXRlbS50aXRsZX08L1RhYmxlUm93Q29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8VGFibGVSb3dDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+e2FjdGl2ZVR5cGVbaXRlbS5hY3RpdmVfdHlwZV19PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PntpdGVtLmRpc2NvdW50fTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT57aXRlbS5zdGFydF90aW1lfTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT57aXRlbS5lbmRfdGltZX08L1RhYmxlUm93Q29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8VGFibGVSb3dDb2x1bW4gc3R5bGU9e3N0eWxlcy5iaWdDb2x1bW59PlxuICAgICAgICAgICAgICAgICAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd01vZGFsKGl0ZW0uaWQsICdzaG93RGV0YWlsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgID7mn6XnnIvor6bmg4U8L1JhaXNlZEJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dNb2RhbChpdGVtLmlkLCAnZWRpdERldGFpbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICA+57yW6L6RPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPFJhaXNlZEJ1dHRvbiBwcmltYXJ5PXt0cnVlfT7liKDpmaQ8L1JhaXNlZEJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L1RhYmxlQm9keT5cbiAgICAgICAgPC9UYWJsZT5cbiAgICAgICAgPFBhZ2luYXRpb25cbiAgICAgICAgICB0b3RhbD17dGhpcy5wcm9wcy5hY3RpdmVMaXN0LnRvdGFsfVxuICAgICAgICAgIGxpbWl0PXsxMH1cbiAgICAgICAgICBwYWdlQ2hhbmdlPXt0aGlzLnBhZ2VDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxEZXRhaWxNb2RhbFxuICAgICAgICAgIGtleVdvcmQ9e3RoaXMuc3RhdGUua2V5V29yZH1cbiAgICAgICAgICBvcGVuPXt0aGlzLnN0YXRlLm1vZGFsU2hvd31cbiAgICAgICAgICBoYW5kbGVDbG9zZT17dGhpcy5tb2RhbENsb3NlfVxuICAgICAgICAvPlxuICAgICAgPC9QYXBlcj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIHN0YXRlID0+ICh7XG4gICAgYWN0aXZlTGlzdDogc3RhdGUuYWN0aXZlTGlzdC50b0pTKClcbiAgfSksXG4gIGRpc3BhdGNoID0+ICh7XG4gICAgc2F2ZUFjdGl2ZUxpc3Q6IChkYXRhQXJyLCB0b3RhbCkgPT4gZGlzcGF0Y2goYWN0aXZlTGlzdC5zYXZlQWN0aXZlTGlzdChkYXRhQXJyLCB0b3RhbCkpLFxuICAgIHBpY2tBY3RpdmVEZXRhaWw6IChkYXRhT2JqKSA9PiBkaXNwYXRjaChhY3RpdmVMaXN0LnBpY2tBY3RpdmVEZXRhaWwoZGF0YU9iaikpXG4gIH0pXG4pKEFjdGl2ZUxpc3QpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL2FjdGl2ZUxpc3QvQWN0aXZlTGlzdC5qcyIsImltcG9ydCB7XG4gIERpYWxvZyxcbiAgUmFpc2VkQnV0dG9uLFxuICBTdGVwLFxuICBTdGVwcGVyLFxuICBTdGVwQnV0dG9uXG59IGZyb20gJ21hdGVyaWFsLXVpJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQWRkQWNpdHZlRGV0YWlsIGZyb20gJy4vQWRkQWN0aXZlRGV0YWlsJztcbmltcG9ydCBBZGRBY3RpdmVJbWFnZSBmcm9tICcuL0FkZEFjdGl2ZUltYWdlJztcbmltcG9ydCBBZGRBY3RpdmVHb29kcyBmcm9tICcuL0FkZEFjdGl2ZUdvb2RzJztcbmltcG9ydCBFZGl0R29vZHNDb3VudCBmcm9tICcuL0VkaXRHb29kc0NvdW50JztcbmltcG9ydCB7cmVxdWVzdH0gZnJvbSAnLi8uLi8uLi9jb21tb24vcmVxdWVzdCc7XG5pbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuY2xhc3MgRGV0YWlsTW9kYWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc3RlcEluZGV4OiAwLFxuICAgICAgZmlsZVVybDogJydcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlQ2xvc2UgPSAoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5oYW5kbGVDbG9zZSgpO1xuICB9O1xuXG4gIGdldFN0ZXBDb250ZW50ID0gKHN0ZXBJbmRleCkgPT4ge1xuICAgIGNvbnN0IHtrZXlXb3JkfSA9IHRoaXMucHJvcHM7XG4gICAgc3dpdGNoIChzdGVwSW5kZXgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIDxBZGRBY2l0dmVEZXRhaWwga2V5V29yZD17a2V5V29yZH0vPjtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIDxBZGRBY3RpdmVJbWFnZSBrZXlXb3JkPXtrZXlXb3JkfS8+O1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gPEFkZEFjdGl2ZUdvb2RzIGtleVdvcmQ9e2tleVdvcmR9Lz47XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHJldHVybiA8RWRpdEdvb2RzQ291bnQga2V5V29yZD17a2V5V29yZH0vPjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICBoYW5kbGVQcmV2ID0gKCkgPT4ge1xuICAgIGNvbnN0IHtzdGVwSW5kZXh9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoc3RlcEluZGV4ID4gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RlcEluZGV4OiBzdGVwSW5kZXggLSAxfSk7XG4gICAgfVxuICB9O1xuXG4gIGhhbmRsZU5leHQgPSAoKSA9PiB7XG4gICAgY29uc3Qge3N0ZXBJbmRleH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChzdGVwSW5kZXggPT09IDIpIHtcbiAgICAgIHRoaXMuaGFuZGxlQ29uZmlybSgpO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0ZXBJbmRleDogc3RlcEluZGV4ID09PSAyID8gc3RlcEluZGV4IDogc3RlcEluZGV4ICsgMVxuICAgIH0pO1xuICB9O1xuXG4gIGhhbmRsZUNvbmZpcm0gPSAoKSA9PiB7XG4gICAgY29uc3QgcXVlcnlEYXRhID0gdGhpcy5wcm9wcy5hY3RpdmVMaXN0LmVkaXRBY3RpdmU7XG4gICAgcXVlcnlEYXRhLnNvcnQgPSB0aGlzLnByb3BzLmFjdGl2ZUxpc3QuYWN0aXZlTGlzdC5sZW5ndGggKyAxO1xuICAgIGNvbnN0IGtleVdvcmQgPSB0aGlzLnByb3BzLmtleVdvcmQ7XG4gICAgbGV0IHVybCA9ICcnO1xuICAgIHN3aXRjaCAoa2V5V29yZCkge1xuICAgICAgY2FzZSAnc2hvd0RldGFpbCc6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ2VkaXREZXRhaWwnOlxuICAgICAgICB1cmwgPSAnYWRtaW4vYWN0aXZpdHkvZWRpdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWRkQWN0aXZlJzpcbiAgICAgICAgdXJsID0gJ2FkbWluL2FjdGl2aXR5L2FkZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyDmlbDmja7moKHpqoxcbiAgICBjb25zdCB7XG4gICAgICB0aXRsZSxcbiAgICAgIGFjdGl2ZV90eXBlLFxuICAgICAgZGlzY291bnQsXG4gICAgICBzdGFydF90aW1lLFxuICAgICAgZW5kX3RpbWUsXG4gICAgICBnb29kc19saXN0LFxuICAgICAgZ29vZHNfY291bnQsXG4gICAgICBpbWFnZV91cmxcbiAgICB9ID0gcXVlcnlEYXRhO1xuXG4gICAgaWYgKCF0aXRsZSkge1xuICAgICAgYWxlcnQoJ+a0u+WKqOWQjeS4jeiDveS4uuepuu+8gScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFjdGl2ZV90eXBlIHx8IHR5cGVvZiBwYXJzZUludChhY3RpdmVfdHlwZSkgIT09ICdudW1iZXInKSB7XG4gICAgICBhbGVydCgn5rS75Yqo57G75Z6L6L6T5YWl5pyJ6K+v5oiW5pyq6L6T5YWl77yBJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGlzY291bnQgfHwgaXNOYU4ocGFyc2VJbnQoZGlzY291bnQpKSkge1xuICAgICAgYWxlcnQoJ+S8mOaDoOWKm+W6pui+k+WFpeacieivr+aIluacqui+k+WFpScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWltYWdlX3VybCkge1xuICAgICAgYWxlcnQoJ+a0u+WKqOS4u+WbvuS4uuW/heWhq+mhueebricpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHF1ZXJ5RGF0YS5hY3RpdmVfdHlwZSA9IHBhcnNlSW50KHF1ZXJ5RGF0YS5hY3RpdmVfdHlwZSk7XG4gICAgcXVlcnlEYXRhLmRpc2NvdW50ID0gcGFyc2VJbnQocXVlcnlEYXRhLmRpc2NvdW50KTtcblxuXG4gICAgcmVxdWVzdCh1cmwsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocXVlcnlEYXRhKVxuICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICB9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge2tleVdvcmR9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7c3RlcEluZGV4fSA9IHRoaXMuc3RhdGU7XG5cbiAgICBsZXQgbW9kYWxUaXRsZSA9ICcnO1xuICAgIHN3aXRjaCAoa2V5V29yZCkge1xuICAgICAgY2FzZSAnc2hvd0RldGFpbCc6XG4gICAgICAgIG1vZGFsVGl0bGUgPSAn5rS75Yqo6K+m5oOFJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlZGl0RGV0YWlsJzpcbiAgICAgICAgbW9kYWxUaXRsZSA9ICfnvJbovpHor6bmg4UnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FkZEFjdGl2ZSc6XG4gICAgICAgIG1vZGFsVGl0bGUgPSAn5re75Yqg5rS75YqoJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb25zdCBhY3Rpb25zID0gW1xuICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogMTJ9fT5cbiAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgIGxhYmVsPVwi5Y+W5raIXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsb3NlfVxuICAgICAgICAgIHN0eWxlPXt7bWFyZ2luUmlnaHQ6IDEyfX1cbiAgICAgICAgLz5cbiAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgIGxhYmVsPVwi5LiK5LiA5q2lXCJcbiAgICAgICAgICBkaXNhYmxlZD17c3RlcEluZGV4ID09PSAwfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUHJldn1cbiAgICAgICAgICBzdHlsZT17e21hcmdpblJpZ2h0OiAxMn19XG4gICAgICAgIC8+XG4gICAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgICBsYWJlbD17c3RlcEluZGV4ID09PSAyID8gJ+ehruiupOaPkOS6pCcgOiAn5LiL5LiA5q2lJ31cbiAgICAgICAgICBwcmltYXJ5PXt0cnVlfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTmV4dH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIF07XG4gICAgY29uc3QgY29udGVudFN0eWxlID0ge21hcmdpbjogJzAgMTZweCd9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEaWFsb2dcbiAgICAgICAgb3Blbj17dGhpcy5wcm9wcy5vcGVufVxuICAgICAgICBhY3Rpb25zPXthY3Rpb25zfVxuICAgICAgICBhdXRvU2Nyb2xsQm9keUNvbnRlbnQ9e3RydWV9XG4gICAgICAgIHRpdGxlPXttb2RhbFRpdGxlfVxuICAgICAgPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7d2lkdGg6ICcxMDAlJywgbWF4V2lkdGg6IDcwMCwgbWFyZ2luOiAnYXV0byd9fT5cbiAgICAgICAgICA8U3RlcHBlciBsaW5lYXI9e2ZhbHNlfSBhY3RpdmVTdGVwPXtzdGVwSW5kZXh9PlxuICAgICAgICAgICAgPFN0ZXA+XG4gICAgICAgICAgICAgIDxTdGVwQnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgIHN0ZXBJbmRleDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9fT7ln7rmnKzkv6Hmga88L1N0ZXBCdXR0b24+XG4gICAgICAgICAgICA8L1N0ZXA+XG4gICAgICAgICAgICA8U3RlcD5cbiAgICAgICAgICAgICAgPFN0ZXBCdXR0b24gb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgc3RlcEluZGV4OiAxXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH19PuWbvueJh+S4iuS8oDwvU3RlcEJ1dHRvbj5cbiAgICAgICAgICAgIDwvU3RlcD5cbiAgICAgICAgICAgIDxTdGVwPlxuICAgICAgICAgICAgICA8U3RlcEJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICBzdGVwSW5kZXg6IDJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfX0+6YCJ5a6a5ZWG5ZOBPC9TdGVwQnV0dG9uPlxuICAgICAgICAgICAgPC9TdGVwPlxuICAgICAgICAgICAgPFN0ZXA+XG4gICAgICAgICAgICAgIDxTdGVwQnV0dG9uIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgIHN0ZXBJbmRleDogM1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9fT7orr7lrprmlbDph488L1N0ZXBCdXR0b24+XG4gICAgICAgICAgICA8L1N0ZXA+XG4gICAgICAgICAgPC9TdGVwcGVyPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e2NvbnRlbnRTdHlsZX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7dGhpcy5nZXRTdGVwQ29udGVudChzdGVwSW5kZXgpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9EaWFsb2c+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBzdGF0ZSA9PiAoe1xuICAgIGFjdGl2ZUxpc3Q6IHN0YXRlLmFjdGl2ZUxpc3QudG9KUygpLFxuICAgIGNhdGVnb3JpZXNMaXN0OiBzdGF0ZS5jYXRlZ29yaWVzTGlzdC50b0pTKClcbiAgfSlcbikoRGV0YWlsTW9kYWwpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL2FjdGl2ZUxpc3QvRGV0YWlsTW9kYWwuanMiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgVGV4dEZpZWxkLFxuICBEaXZpZGVyLFxuICBTZWxlY3RGaWVsZCxcbiAgTWVudUl0ZW0sXG59IGZyb20gJ21hdGVyaWFsLXVpJztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHthY3RpdmVMaXN0fSBmcm9tICcuLy4uLy4uL2FjdGlvbnMnO1xuaW1wb3J0IHthY3RpdmVUeXBlLCBkaXNjb3VudFR5cGV9IGZyb20gJy4vLi4vLi4vY29tbW9uL2NvbW1vbidcblxuY2xhc3MgQWRkQWN0aXZlRGV0YWlsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG5cbiAgICBjb25zdCB7a2V5V29yZCwgYWN0aXZlTGlzdH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IChrZXlXb3JkID09PSAnc2hvd0RldGFpbCcpO1xuXG4gICAgY29uc3QgZWRpdEFjdGl2ZSA9IGFjdGl2ZUxpc3QuZWRpdEFjdGl2ZTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXmtLvliqjlkI3np7BcIlxuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi5rS75Yqo5ZCN56ewXCJcbiAgICAgICAgICBzdHlsZT17e3dpZHRoOiAnMTAwJSd9fVxuICAgICAgICAgIHVuZGVybGluZVNob3c9e2ZhbHNlfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgIHZhbHVlPXtlZGl0QWN0aXZlLnRpdGxlIHx8ICcnfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGF0Y2hBY3RpdmVEZXRhaWwoe3RpdGxlOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxEaXZpZGVyLz5cbiAgICAgICAgPFNlbGVjdEZpZWxkXG4gICAgICAgICAgaGludFRleHQ9XCLor7fpgInmi6nmtLvliqjnsbvlnotcIlxuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi5rS75Yqo57G75Z6LXCJcbiAgICAgICAgICBzdHlsZT17e3dpZHRoOiAnMTAwJSd9fVxuICAgICAgICAgIHVuZGVybGluZVNob3c9e2ZhbHNlfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgIHZhbHVlPXtlZGl0QWN0aXZlLmFjdGl2ZV90eXBlIHx8ICcxJ31cbiAgICAgICAgICBvbkNoYW5nZT17KGUsIGksIHYpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGF0Y2hBY3RpdmVEZXRhaWwoe2FjdGl2ZV90eXBlOiB2fSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFjdGl2ZVR5cGUpLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8TWVudUl0ZW0gdmFsdWU9e2l0ZW19IGtleT17aXRlbX0gcHJpbWFyeVRleHQ9e2FjdGl2ZVR5cGVbaXRlbV19Lz5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICA8L1NlbGVjdEZpZWxkPlxuICAgICAgICA8RGl2aWRlci8+XG4gICAgICAgIDxTZWxlY3RGaWVsZFxuICAgICAgICAgIGhpbnRUZXh0PVwi6K+36YCJ5oup5rS75Yqo5LyY5oOg5Yqb5bqmXCJcbiAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dD1cIuS8mOaDoOWKm+W6plwiXG4gICAgICAgICAgc3R5bGU9e3t3aWR0aDogJzEwMCUnfX1cbiAgICAgICAgICB1bmRlcmxpbmVTaG93PXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17aXNEaXNhYmxlZH1cbiAgICAgICAgICB2YWx1ZT17ZWRpdEFjdGl2ZS5kaXNjb3VudCB8fCAnMSd9XG4gICAgICAgICAgb25DaGFuZ2U9eyhlLCBpLCB2KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnBhdGNoQWN0aXZlRGV0YWlsKHtkaXNjb3VudDogdn0pO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhkaXNjb3VudFR5cGUpLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8TWVudUl0ZW0gdmFsdWU9e2l0ZW19IGtleT17aXRlbX0gcHJpbWFyeVRleHQ9e2Rpc2NvdW50VHlwZVtpdGVtXX0vPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIDwvU2VsZWN0RmllbGQ+XG4gICAgICAgIDxEaXZpZGVyLz5cbiAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgIGhpbnRUZXh0PVwi6K+36L6T5YWl5rS75Yqo5byA5aeL5pe26Ze0XCJcbiAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dD1cIuW8gOWni+aXtumXtCh5eXl5LW1tLWRkIGhoOm1tOnNzKVwiXG4gICAgICAgICAgc3R5bGU9e3t3aWR0aDogJzEwMCUnfX1cbiAgICAgICAgICB1bmRlcmxpbmVTaG93PXtmYWxzZX1cbiAgICAgICAgICBkaXNhYmxlZD17aXNEaXNhYmxlZH1cbiAgICAgICAgICB2YWx1ZT17ZWRpdEFjdGl2ZS5zdGFydF90aW1lIHx8ICcnfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGF0Y2hBY3RpdmVEZXRhaWwoe3N0YXJ0X3RpbWU6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPERpdmlkZXIvPlxuICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXmtLvliqjnu5PmnZ/ml7bpl7RcIlxuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi57uT5p2f5pe26Ze0KHl5eXktbW0tZGQgaGg6bW06c3MpXCJcbiAgICAgICAgICBzdHlsZT17e3dpZHRoOiAnMTAwJSd9fVxuICAgICAgICAgIHVuZGVybGluZVNob3c9e2ZhbHNlfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0Rpc2FibGVkfVxuICAgICAgICAgIHZhbHVlPXtlZGl0QWN0aXZlLmVuZF90aW1lIHx8ICcnfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMucGF0Y2hBY3RpdmVEZXRhaWwoe2VuZF90aW1lOiBlLnRhcmdldC52YWx1ZX0pO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxEaXZpZGVyLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgc3RhdGUgPT4gKHtcbiAgICBhY3RpdmVMaXN0OiBzdGF0ZS5hY3RpdmVMaXN0LnRvSlMoKVxuICB9KSxcbiAgZGlzcGF0Y2ggPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBzYXZlQWN0aXZlTGlzdDogZGF0YUFyciA9PiB7XG4gICAgICAgIGRpc3BhdGNoKGFjdGl2ZUxpc3Quc2F2ZUFjdGl2ZUxpc3QoZGF0YUFycikpO1xuICAgICAgfSxcbiAgICAgIHBhdGNoQWN0aXZlRGV0YWlsOiBkYXRhT2JqID0+IHtcbiAgICAgICAgZGlzcGF0Y2goYWN0aXZlTGlzdC5wYXRjaEFjdGl2ZURldGFpbChkYXRhT2JqKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuKShBZGRBY3RpdmVEZXRhaWwpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL2FjdGl2ZUxpc3QvQWRkQWN0aXZlRGV0YWlsLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHthY3RpdmVMaXN0fSBmcm9tICcuLy4uLy4uL2FjdGlvbnMnO1xuaW1wb3J0IHtSYWlzZWRCdXR0b24sIERpYWxvZ30gZnJvbSAnbWF0ZXJpYWwtdWknO1xuaW1wb3J0IEF2YXRhckVkaXRvciBmcm9tICdyZWFjdC1hdmF0YXItZWRpdG9yJztcbmltcG9ydCB7c3R5bGVzfSBmcm9tICcuL0dvb2RzTGlzdFN0eWxlcyc7XG5pbXBvcnQgdXBsb2FkIGZyb20gJy4vLi4vLi4vY29tbW9uL2ltYWdlL3VwbG9hZC5wbmcnO1xuXG5jbGFzcyBBZGRBY3RpdmVJbWFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmaWxlVXJsOiAnJyxcbiAgICAgIGltZ0ZpZWxkT3BlbjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgc2luZ2xlRmlsZVNlbGVjdCA9IGUgPT4ge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IGltYWdlID0gZS5jdXJyZW50VGFyZ2V0LmZpbGVzWzBdO1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW1hZ2UpO1xuICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIGltZ0ZpZWxkT3BlbjogdHJ1ZSxcbiAgICAgICAgZmlsZVVybDogZS50YXJnZXQucmVzdWx0XG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xuXG4gIHNlY0ZpbGVTZWxlY3QgPSAoZSwga2V5KSA9PiB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3QgaW1hZ2UgPSBlLmN1cnJlbnRUYXJnZXQuZmlsZXNbMF07XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWFnZSk7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgIG9ialtrZXldID0gZS50YXJnZXQucmVzdWx0O1xuICAgICAgdGhhdC5wcm9wcy5wYXRjaEFjdGl2ZURldGFpbChvYmopO1xuICAgIH07XG4gIH07XG5cbiAgc2V0RWRpdG9yUmVmID0gZWRpdG9yID0+IHtcbiAgICBpZiAoZWRpdG9yKSB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgfTtcblxuICBoYW5kbGVTYXZlID0gKCkgPT4ge1xuICAgIGNvbnN0IGltZyA9IHRoaXMuZWRpdG9yLmdldEltYWdlU2NhbGVkVG9DYW52YXMoKS50b0RhdGFVUkwoKTtcbiAgICB0aGlzLnByb3BzLnBhdGNoQWN0aXZlRGV0YWlsKHtpbWFnZV91cmw6IGltZ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe2ltZ0ZpZWxkT3BlbjogZmFsc2V9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZWRpdEFjdGl2ZSA9IHRoaXMucHJvcHMuYWN0aXZlTGlzdC5lZGl0QWN0aXZlO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aW1nXG4gICAgICAgICAgc3JjPXtlZGl0QWN0aXZlLmltYWdlX3VybCB8fCB1cGxvYWR9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlcy5tYWluSW1hZ2V9XG4gICAgICAgICAgYWx0PXt1cGxvYWR9XG4gICAgICAgIC8+XG4gICAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgICBsYWJlbD1cIlwiXG4gICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICBzdHlsZT17c3R5bGVzLmZpbGVTZWxlY3RDb250ZW50fVxuICAgICAgICA+XG4gICAgICAgICAg5LiK5Lyg5Zu+54mHXG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBzdHlsZT17c3R5bGVzLmZpbGVTZWxlY3R9XG4gICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICBhY2NlcHQ9XCJpbWFnZS9naWYsaW1hZ2UvanBlZyxpbWFnZS9wbmdcIlxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuc2luZ2xlRmlsZVNlbGVjdH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1JhaXNlZEJ1dHRvbj5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBzdHlsZT17e21hcmdpbkJvdHRvbTogJzEycHgnLCBkaXNwbGF5OiAnYmxvY2snfX1cbiAgICAgICAgPuivt+S4iuS8oOS6p+WTgeS4u+Wbvu+8jOS4u+WbvuS8muWcqOWwj+eoi+W6j+mmlumhteeahOi9ruaSreWbvuS4reWxleekuu+8jOWwuuWvuOW7uuiuruS4uuWuveW6puS4ujUyOOWDj+e0oO+8jOmVv+W6puS4ujE2N+WDj+e0oO+8jOWbvueJh+Wkp+Wwj+W7uuiuruWwj+S6jjFNPC9zcGFuPlxuICAgICAgICA8RGlhbG9nXG4gICAgICAgICAgY29udGVudFN0eWxlPXt7d2lkdGg6ICc2NjhweCd9fVxuICAgICAgICAgIG9wZW49e3RoaXMuc3RhdGUuaW1nRmllbGRPcGVufT5cbiAgICAgICAgICA8QXZhdGFyRWRpdG9yXG4gICAgICAgICAgICByZWY9e3RoaXMuc2V0RWRpdG9yUmVmfVxuICAgICAgICAgICAgb25TYXZlPXt0aGlzLmhhbmRsZVNhdmV9XG4gICAgICAgICAgICBpbWFnZT17dGhpcy5zdGF0ZS5maWxlVXJsfVxuICAgICAgICAgICAgd2lkdGg9ezYwMH1cbiAgICAgICAgICAgIGhlaWdodD17MTkwfVxuICAgICAgICAgICAgYm9yZGVyPXsxMH1cbiAgICAgICAgICAgIGNvbG9yPXtbMjU1LCAyNTUsIDI1NSwgMC42XX0gLy8gUkdCQVxuICAgICAgICAgICAgc2NhbGU9ezF9XG4gICAgICAgICAgICByb3RhdGU9ezB9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgICBzdHlsZT17e2Rpc3BsYXk6ICdibG9jayd9fVxuICAgICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU2F2ZX1cbiAgICAgICAgICA+56Gu6K6kPC9SYWlzZWRCdXR0b24+XG4gICAgICAgIDwvRGlhbG9nPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBzdGF0ZSA9PiAoe1xuICAgIGFjdGl2ZUxpc3Q6IHN0YXRlLmFjdGl2ZUxpc3QudG9KUygpXG4gIH0pLFxuICBkaXNwYXRjaCA9PiAoe1xuICAgIHBhdGNoQWN0aXZlRGV0YWlsOiBkYXRhT2JqID0+IGRpc3BhdGNoKGFjdGl2ZUxpc3QucGF0Y2hBY3RpdmVEZXRhaWwoZGF0YU9iaikpXG4gIH0pXG4pKEFkZEFjdGl2ZUltYWdlKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9hY3RpdmVMaXN0L0FkZEFjdGl2ZUltYWdlLmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtNZW51LCBNZW51SXRlbSwgQ2hlY2tib3h9IGZyb20gJ21hdGVyaWFsLXVpJztcbmltcG9ydCB7YWN0aXZlTGlzdH0gZnJvbSAnLi8uLi8uLi9hY3Rpb25zJztcbmltcG9ydCBBdlBsYXlsaXN0QWRkIGZyb20gJ21hdGVyaWFsLXVpL3N2Zy1pY29ucy9hdi9wbGF5bGlzdC1hZGQnO1xuaW1wb3J0IHtzdHlsZXN9IGZyb20gJy4vR29vZHNMaXN0U3R5bGVzJztcblxuY2xhc3MgQWRkQWN0aXZlR29vZHMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZmlsZVVybDogJycsXG4gICAgICBpbWdGaWVsZE9wZW46IGZhbHNlLFxuICAgICAgbWVudVNlbGVjdGVkOiB0aGlzLnByb3BzLmNhdGVnb3JpZXNMaXN0LmNhdGVnb3JpZXNMaXN0WzBdLmlkXG4gICAgfTtcbiAgfVxuXG4gIGFkZFNwZWMgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMucHJvcHMua2V5V29yZCAhPT0gJ3Nob3dEZXRhaWwnKVxuICAgICAgdGhpcy5wcm9wcy5hZGRTcGVjKCk7XG4gIH07XG5cbiAgbWVudU9uY2hhbmdlID0gKGUsIHYpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1lbnVTZWxlY3RlZDogdlxuICAgIH0pO1xuICB9O1xuXG4gIGdvb2RDaGVjayA9IGUgPT4ge1xuICAgIHRoaXMucHJvcHMuYWRkQWN0aXZlR29vZHMocGFyc2VJbnQoZS50YXJnZXQudmFsdWUpKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZ29vZExpc3QgPSB0aGlzLnByb3BzLmFjdGl2ZUxpc3QuZWRpdEFjdGl2ZS5nb29kc19saXN0O1xuICAgIGNvbnN0IGdvb2RDb3VudCA9IHRoaXMucHJvcHMuYWN0aXZlTGlzdC5lZGl0QWN0aXZlLmdvb2RzX2NvdW50O1xuICAgIGNvbnN0IGNhdGVnb3JpZXNMaXN0ID0gdGhpcy5wcm9wcy5jYXRlZ29yaWVzTGlzdC5jYXRlZ29yaWVzTGlzdDtcbiAgICBjb25zdCBnb29kc0xpc3QgPSB0aGlzLnByb3BzLmdvb2RzTGlzdC5nb29kc0xpc3Q7XG4gICAgY29uc3Qga2V5V29yZCA9IHRoaXMucHJvcHMua2V5V29yZDtcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gKGtleVdvcmQgPT09ICdzaG93RGV0YWlsJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5jYXRlZ29yeUNvbnRlbnR9PlxuICAgICAgICAgIDxNZW51XG4gICAgICAgICAgICBzZWxlY3RlZE1lbnVJdGVtU3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiKDAsIDE4OCwgMjEyKScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubWVudVNlbGVjdGVkfVxuICAgICAgICAgICAgbWVudUl0ZW1TdHlsZT17e3dpZHRoOiAnMTAwcHgnfX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm1lbnVPbmNoYW5nZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7Y2F0ZWdvcmllc0xpc3QubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKDxNZW51SXRlbSB2YWx1ZT17aXRlbS5pZH0ga2V5PXtpdGVtLmlkfSBwcmltYXJ5VGV4dD17aXRlbS5uYW1lfS8+KVxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9NZW51PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLmdvb2RzTGlzdENvbnRlbnR9PlxuICAgICAgICAgIHtnb29kc0xpc3QubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0uY2F0ZWdvcnlfaWQgPT09IHRoaXMuc3RhdGUubWVudVNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoPENoZWNrYm94XG4gICAgICAgICAgICAgICAgbGFiZWw9e2l0ZW0uZ29vZHNfbmFtZX1cbiAgICAgICAgICAgICAgICB0aXRsZT17aXRlbS5nb29kc19uYW1lfVxuICAgICAgICAgICAgICAgIHZhbHVlPXtpdGVtLmlkfVxuICAgICAgICAgICAgICAgIGtleT17aXRlbS5pZH1cbiAgICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLmdvb2RzQ2hlY2tJdGVtfVxuICAgICAgICAgICAgICAgIGxhYmVsU3R5bGU9e3N0eWxlcy5nb29kc0NoZWNrSXRlbX1cbiAgICAgICAgICAgICAgICBjaGVja2VkPXtnb29kTGlzdC5pbmRleE9mKGl0ZW0uaWQpID49IDB9XG4gICAgICAgICAgICAgICAgb25DaGVjaz17dGhpcy5nb29kQ2hlY2suYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgLz4pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxuICBzdGF0ZSA9PiAoe1xuICAgIGdvb2RzTGlzdDogc3RhdGUuZ29vZHNMaXN0LnRvSlMoKSxcbiAgICBhY3RpdmVMaXN0OiBzdGF0ZS5hY3RpdmVMaXN0LnRvSlMoKSxcbiAgICBjYXRlZ29yaWVzTGlzdDogc3RhdGUuY2F0ZWdvcmllc0xpc3QudG9KUygpXG4gIH0pLFxuICBkaXNwYXRjaCA9PiAoe1xuICAgIGFkZEFjdGl2ZUdvb2RzOiBpZCA9PiBkaXNwYXRjaChhY3RpdmVMaXN0LmFkZEFjdGl2ZUdvb2RzKGlkKSlcbiAgfSlcbikoQWRkQWN0aXZlR29vZHMpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21wb25lbnRzL2FjdGl2ZUxpc3QvQWRkQWN0aXZlR29vZHMuanMiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtjb25uZWN0fSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQge2dvb2RzTGlzdH0gZnJvbSAnLi8uLi8uLi9hY3Rpb25zJztcbmltcG9ydCB7VGV4dEZpZWxkfSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQge3N0eWxlc30gZnJvbSAnLi9Hb29kc0xpc3RTdHlsZXMnO1xuXG5jbGFzcyBFZGl0R29vZHNDb3VudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmaWxlVXJsOiAnJyxcbiAgICAgIGltZ0ZpZWxkT3BlbjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgYWRkU3BlYyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5wcm9wcy5rZXlXb3JkICE9PSAnc2hvd0RldGFpbCcpXG4gICAgICB0aGlzLnByb3BzLmFkZFNwZWMoKTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZWRpdEFjdGl2ZSA9IHRoaXMucHJvcHMuYWN0aXZlTGlzdC5lZGl0QWN0aXZlO1xuICAgIGNvbnN0IGdvb2RzTGlzdCA9IHRoaXMucHJvcHMuZ29vZHNMaXN0Lmdvb2RzTGlzdDtcbiAgICBjb25zdCBnb29kc19saXN0ID0gZWRpdEFjdGl2ZS5nb29kc19saXN0O1xuICAgIGNvbnN0IGdvb2RzX2NvdW50ID0gZWRpdEFjdGl2ZS5nb29kc19jb3VudDtcbiAgICBjb25zdCBnb29kc19uYW1lID0gW107XG4gICAgZ29vZHNfbGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnb29kc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYoZ29vZHNMaXN0W2ldLmlkID09PSBpdGVtKXtcbiAgICAgICAgICBnb29kc19uYW1lLnB1c2goZ29vZHNMaXN0W2ldLmdvb2RzX25hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBrZXlXb3JkID0gdGhpcy5wcm9wcy5rZXlXb3JkO1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAoa2V5V29yZCA9PT0gJ3Nob3dEZXRhaWwnKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2dvb2RzX25hbWUubWFwKChpdGVtLCBpZHgpID0+IChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuc3BlY0l0ZW19PlxuICAgICAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgICAgICBoaW50VGV4dD1cIuWVhuWTgeWQjVwiXG4gICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi5ZWG5ZOB5ZCNXCJcbiAgICAgICAgICAgICAgdmFsdWU9e2l0ZW19XG4gICAgICAgICAgICAgIGtleT17aWR4fVxuICAgICAgICAgICAgICBkaXNhYmxlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZWRpdFNwZWMoaWR4LCB7a2V5OiBlLnRhcmdldC52YWx1ZX0pO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGVzLnNwZWNLZXl9XG4gICAgICAgICAgICAvPjpcbiAgICAgICAgICAgIDxUZXh0RmllbGRcbiAgICAgICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXllYblk4HmlbDph49cIlxuICAgICAgICAgICAgICBmbG9hdGluZ0xhYmVsVGV4dD1cIuWVhuWTgeaVsOmHj1wiXG4gICAgICAgICAgICAgIHZhbHVlPXtnb29kc19jb3VudFtpZHhdfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17aXNEaXNhYmxlZH1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuZWRpdFNwZWMoaWR4LCB7dmFsdWU6IGUudGFyZ2V0LnZhbHVlfSk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMuc3BlY1ZhbHVlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICAgIDxkaXYgc3R5bGU9e3t3aWR0aDogJzEwMCUnLCBwYWRkaW5nOiAnMTJweCA0NnB4JywgYm94U2l6aW5nOiAnYm9yZGVyLWJveCd9fT5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgbWFyZ2luVG9wOiAxMn19XG4gICAgICAgICAgPumcgOimgea3u+WKoOaWsOeahOinhOagvOS/oeaBr++8jOeCueWHu+a3u+WKoOaMiemSru+8jOW3puS+p+Whq+WGmeinhOagvOagh+mimO+8jOWPs+S+p+Whq+WGmeinhOagvOS/oeaBr++8gTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QoXG4gIHN0YXRlID0+ICh7XG4gICAgYWN0aXZlTGlzdDogc3RhdGUuYWN0aXZlTGlzdC50b0pTKCksXG4gICAgZ29vZHNMaXN0OiBzdGF0ZS5nb29kc0xpc3QudG9KUygpXG4gIH0pLFxuICBkaXNwYXRjaCA9PiAoe30pXG4pKEVkaXRHb29kc0NvdW50KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9hY3RpdmVMaXN0L0VkaXRHb29kc0NvdW50LmpzIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7cmVxdWVzdH0gZnJvbSAnLi8uLi8uLi9jb21tb24vcmVxdWVzdCc7XG5pbXBvcnQge3N0YXR1c30gZnJvbSAnLi8uLi8uLi9jb21tb24vY29tbW9uJztcbmltcG9ydCB7XG4gIFRhYmxlLFxuICBUYWJsZUJvZHksXG4gIFRhYmxlSGVhZGVyLFxuICBUYWJsZUhlYWRlckNvbHVtbixcbiAgVGFibGVSb3csXG4gIFRhYmxlUm93Q29sdW1uLFxuICBSYWlzZWRCdXR0b24sXG4gIFBhcGVyLFxuICBEaWFsb2csXG4gIExpc3QsXG4gIExpc3RJdGVtLFxuICBUZXh0RmllbGRcbn0gZnJvbSAnbWF0ZXJpYWwtdWknO1xuaW1wb3J0IHtzdHlsZXN9IGZyb20gJy4vT3JkZXJMaXN0U3R5bGVzJztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtvcmRlcnNMaXN0fSBmcm9tICcuLy4uLy4uL2FjdGlvbnMnO1xuaW1wb3J0IFBhZ2luYXRpb24gZnJvbSAnLi8uLi9jb21tb24vUGFnaW5hdGlvbic7XG5cbmNsYXNzIE9yZGVyTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzaG93RGF0YToge30sXG4gICAgICBtb2RhbFNob3c6IGZhbHNlLFxuICAgICAga2V5V29yZDogJydcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgcmVxdWVzdCgnYWRtaW4vb3JkZXIvb3JkZXItbGlzdCcsIHt9LCB7bGltaXQ6IDEwLCBvZmZzZXQ6IDB9KVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcy5yZXRDb2RlID09PSAwKSB7XG4gICAgICAgICAgdGhhdC5wcm9wcy5zYXZlT3JkZXJzTGlzdChyZXMuZGF0YS5kYXRhQXJyLCByZXMuZGF0YS50b3RhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcGFnZUNoYW5nZSA9IGluZGV4ID0+IHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXF1ZXN0KCdhZG1pbi9vcmRlci9vcmRlci1saXN0Jywge30sIHtsaW1pdDogMTAsIG9mZnNldDogKGluZGV4IC0gMSkgKiAxMH0pXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICBpZiAocmVzLnJldENvZGUgPT09IDApIHtcbiAgICAgICAgICB0aGF0LnByb3BzLnNhdmVPcmRlcnNMaXN0KHJlcy5kYXRhLmRhdGFBcnIsIHJlcy5kYXRhLnRvdGFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH07XG5cbiAgcmVmdW5kID0gb3JkZXJObyA9PiB7XG4gICAgcmVxdWVzdCgnYWRtaW4vb3JkZXIvcmVmdW5kJywge1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7b3JkZXJOb30pXG4gICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYocmVzLnJldENvZGUgPT09IDApe1xuICAgICAgICAgIGFsZXJ0KCfpgIDmrL7miJDlip8nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH07XG5cbiAgZGVsaXZlciA9ICgpID0+IHtcbiAgICBjb25zdCB7b3JkZXJJZCwgdHJhY2tpbmdOb30gPSB0aGlzLnN0YXRlO1xuICAgIHJlcXVlc3QoYGFkbWluL29yZGVyL3NlbmQvJHtvcmRlcklkfWAsIHtcbiAgICAgIG1ldGhvZDogJ1BBVENIJyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHt0cmFja2luZ05vfSlcbiAgICB9KVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcy5yZXRDb2RlID09PSAwKSB7XG4gICAgICAgICAgYWxlcnQoJ+ehruiupOWPkei0pycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfTtcblxuICBoYW5kbGVDbG9zZSA9ICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGFsU2hvdzogZmFsc2VcbiAgICB9KTtcbiAgfTtcblxuICBzaG93TW9kYWwgPSBpZCA9PiB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgY29uc3Qgb3JkZXJzTGlzdCA9IHRoaXMucHJvcHMub3JkZXJzTGlzdC5vcmRlcnNMaXN0O1xuICAgIG9yZGVyc0xpc3QuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLmlkID09PSBpZCkge1xuICAgICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgICBtb2RhbFNob3c6IHRydWUsXG4gICAgICAgICAgbWV0aG9kOiAnZGV0YWlsJ1xuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgdGhhdC5wcm9wcy5waWNrT3JkZXJEZXRhaWwoaXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIG9wZW5EZWxpdmVyID0gaWQgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgb3JkZXJJZDogaWQsXG4gICAgICBtb2RhbFNob3c6IHRydWUsXG4gICAgICBtZXRob2Q6ICdkZWxpdmVyJ1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkYXRhUm93ID0gdGhpcy5wcm9wcy5vcmRlcnNMaXN0Lm9yZGVyc0xpc3Q7XG4gICAgY29uc3Qgb3JkZXJEZXRhaWwgPSB0aGlzLnByb3BzLm9yZGVyc0xpc3Qub3JkZXJEZXRhaWw7XG4gICAgY29uc3QgZGV0YWlsQWRkciA9IG9yZGVyRGV0YWlsLnVzZXJBZGRyZXNzSW5mbztcbiAgICBjb25zdCBhZGRyZXNzRGV0YWlsID0gZGV0YWlsQWRkcj9gJHtkZXRhaWxBZGRyLnByb3ZpbmNlfSR7ZGV0YWlsQWRkci5wcm92aW5jZSA9PT0gZGV0YWlsQWRkci5jaXR5ID8gJycgOiBkZXRhaWxBZGRyLmNpdHl9XG4gICAgJHtkZXRhaWxBZGRyLmRpc3RyaWN0fSR7ZGV0YWlsQWRkci5kZXRhaWx9YDogJyc7XG4gICAgY29uc3QgYWN0aW9ucyA9IFtcbiAgICAgIDxSYWlzZWRCdXR0b25cbiAgICAgICAgbGFiZWw9XCLlj5bmtohcIlxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsb3NlfVxuICAgICAgICBzdHlsZT17e21hcmdpblJpZ2h0OiAxMn19XG4gICAgICAvPixcbiAgICAgIHRoaXMuc3RhdGUubWV0aG9kID09PSAnZGVsaXZlcic/KFxuICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgbGFiZWw9XCLnoa7lrppcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuZGVsaXZlcn1cbiAgICAgICAgICBzdHlsZT17e21hcmdpblJpZ2h0OiAxMn19XG4gICAgICAgIC8+KTpudWxsXG4gICAgXTtcbiAgICByZXR1cm4gKFxuICAgICAgPFBhcGVyPlxuICAgICAgICA8VGFibGU+XG4gICAgICAgICAgPFRhYmxlSGVhZGVyXG4gICAgICAgICAgICBkaXNwbGF5U2VsZWN0QWxsPXtmYWxzZX1cbiAgICAgICAgICAgIGFkanVzdEZvckNoZWNrYm94PXtmYWxzZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VGFibGVSb3c+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT5JRDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLnNtYWxsQ29sdW1ufT7mlLbotKfkuro8L1RhYmxlSGVhZGVyQ29sdW1uPlxuICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5taWRkbGVDb2x1bW59PueUteivnTwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLm1pZGRsZUNvbHVtbn0+5pS26LSn5Zyw5Z2APC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgICAgPFRhYmxlSGVhZGVyQ29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PuiuouWNleeKtuaAgTwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgIDxUYWJsZUhlYWRlckNvbHVtbiBzdHlsZT17c3R5bGVzLm1pZGRsZUNvbHVtbn0+5pON5L2cPC9UYWJsZUhlYWRlckNvbHVtbj5cbiAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgPC9UYWJsZUhlYWRlcj5cbiAgICAgICAgICA8VGFibGVCb2R5IGRpc3BsYXlSb3dDaGVja2JveD17ZmFsc2V9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBkYXRhUm93Lm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzID0gaXRlbS51c2VyQWRkcmVzc0luZm87XG4gICAgICAgICAgICAgICAgbGV0IGFkZHJlc3NEZXRhaWwgPSBgJHthZGRyZXNzLnByb3ZpbmNlfSR7YWRkcmVzcy5wcm92aW5jZSA9PT0gYWRkcmVzcy5jaXR5ID8gJycgOiBhZGRyZXNzLmNpdHl9XG4gICAgICAgICAgICAgICAgJHthZGRyZXNzLmRpc3RyaWN0fSR7YWRkcmVzcy5kZXRhaWx9YDtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgPFRhYmxlUm93IGtleT17aXRlbS5pZH0gc2VsZWN0YWJsZT17ZmFsc2V9PlxuICAgICAgICAgICAgICAgICAgICA8VGFibGVSb3dDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+e2l0ZW0uaWR9PC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMuc21hbGxDb2x1bW59PnthZGRyZXNzLnJlY2VpdmVyfTwvVGFibGVSb3dDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLm1pZGRsZUNvbHVtbn0+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGl0bGU9e2FkZHJlc3MucGhvbmV9PnthZGRyZXNzLnBob25lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgICAgPFRhYmxlUm93Q29sdW1uIHN0eWxlPXtzdHlsZXMubWlkZGxlQ29sdW1ufT5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aXRsZT17YWRkcmVzc0RldGFpbH0+e2FkZHJlc3NEZXRhaWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L1RhYmxlUm93Q29sdW1uPlxuICAgICAgICAgICAgICAgICAgICA8VGFibGVIZWFkZXJDb2x1bW4gc3R5bGU9e3N0eWxlcy5zbWFsbENvbHVtbn0+XG4gICAgICAgICAgICAgICAgICAgICAge3N0YXR1c1tpdGVtLnN0YXR1c119XG4gICAgICAgICAgICAgICAgICAgIDwvVGFibGVIZWFkZXJDb2x1bW4+XG4gICAgICAgICAgICAgICAgICAgIDxUYWJsZVJvd0NvbHVtbiBzdHlsZT17c3R5bGVzLm1pZGRsZUNvbHVtbn0+XG4gICAgICAgICAgICAgICAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbWFyeT17dHJ1ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TW9kYWwoaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgID7mn6XnnIvor6bmg4U8L1JhaXNlZEJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9PT0gNCA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZ1bmQoaXRlbS5vcmRlck5vKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+56Gu6K6k6YCA6LSnPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9PT0gMiA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPFJhaXNlZEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRGVsaXZlcihpdGVtLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICA+56Gu6K6k5Y+R6LSnPC9SYWlzZWRCdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgPC9UYWJsZVJvd0NvbHVtbj5cbiAgICAgICAgICAgICAgICAgIDwvVGFibGVSb3c+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L1RhYmxlQm9keT5cbiAgICAgICAgPC9UYWJsZT5cbiAgICAgICAgPFBhZ2luYXRpb25cbiAgICAgICAgICB0b3RhbD17dGhpcy5wcm9wcy5vcmRlcnNMaXN0Lm9yZGVyc1RvdGFsfVxuICAgICAgICAgIGxpbWl0PXsxMH1cbiAgICAgICAgICBwYWdlQ2hhbmdlPXt0aGlzLnBhZ2VDaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICAgIDxEaWFsb2dcbiAgICAgICAgICBvcGVuPXt0aGlzLnN0YXRlLm1vZGFsU2hvd31cbiAgICAgICAgICBhY3Rpb25zPXthY3Rpb25zfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMuc3RhdGUubWV0aG9kID09PSAnZGVsaXZlcicgPyAoXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8VGV4dEZpZWxkXG4gICAgICAgICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXlv6vpgJLljZXlj7dcIlxuICAgICAgICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi5b+r6YCS5Y2V5Y+3XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17e3dpZHRoOiAnMTAwJSd9fVxuICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnRyYWNraW5nTm8gfHwgJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHRyYWNraW5nTm86IGUudGFyZ2V0LnZhbHVlXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxMaXN0PlxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gcHJpbWFyeVRleHQ9e2DorqLljZXml7bpl7Q6ICR7b3JkZXJEZXRhaWwuY3JlYXRlVGltZX1gfS8+XG4gICAgICAgICAgICAgIDxMaXN0SXRlbSBwcmltYXJ5VGV4dD17YOiuouWNleS7t+agvDogJHtvcmRlckRldGFpbC5hY3R1YWxfcHJpY2UgLyAxMDB9YH0vPlxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gcHJpbWFyeVRleHQ9e2DorqLljZXljp/ku7c6ICR7b3JkZXJEZXRhaWwub3JpZ2luYWxfcHJpY2UgLyAxMDB9YH0vPlxuICAgICAgICAgICAgICA8TGlzdEl0ZW0gcHJpbWFyeVRleHQ9e2Dlj5HotKflnLDlnYA6ICR7YWRkcmVzc0RldGFpbH1gfS8+XG4gICAgICAgICAgICAgIDxMaXN0SXRlbSBwcmltYXJ5VGV4dD17YOW/q+mAkuWNleWPtzogJHtvcmRlckRldGFpbC50cmFja2luZ05vfHwn5pyq5Y+R6LSnJ31gfS8+XG4gICAgICAgICAgICA8L0xpc3Q+KX1cbiAgICAgICAgPC9EaWFsb2c+XG4gICAgICA8L1BhcGVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcbiAgc3RhdGUgPT4gKHtcbiAgICBvcmRlcnNMaXN0OiBzdGF0ZS5vcmRlcnNMaXN0LnRvSlMoKVxuICB9KSxcbiAgZGlzcGF0Y2ggPT4gKHtcbiAgICBzYXZlT3JkZXJzTGlzdDogKGRhdGFBcnIsIHRvdGFsKSA9PiBkaXNwYXRjaChvcmRlcnNMaXN0LnNhdmVPcmRlckxpc3QoZGF0YUFyciwgdG90YWwpKSxcbiAgICBwaWNrT3JkZXJEZXRhaWw6IChkYXRhT2JqKSA9PiBkaXNwYXRjaChvcmRlcnNMaXN0LnBpY2tPcmRlckRldGFpbChkYXRhT2JqKSlcbiAgfSlcbikoT3JkZXJMaXN0KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9vcmRlckxpc3QvT3JkZXJMaXN0LmpzIiwibW9kdWxlLmV4cG9ydHMuc3R5bGVzID0ge1xuICBzbWFsbENvbHVtbjoge1xuICAgIHdpZHRoOiAnMjBweCcsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94J1xuICB9LFxuICBiaWdDb2x1bW46IHtcbiAgICB3aWR0aDogJzEwMHB4JyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gIH0sXG4gIG1pZGRsZUNvbHVtbjoge1xuICAgIHdpZHRoOiAnODBweCcsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJ1xuICB9LFxuICBzZWNJbWFnZUl0ZW06IHtcbiAgICBtYXJnaW5Ub3A6ICcxMnB4JyxcbiAgICB3aWR0aDogMTUwLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgbWFyZ2luUmlnaHQ6IDEyXG4gIH0sXG4gIGZpbGVTZWxlY3Q6IHtcbiAgICBvcGFjaXR5OiAwLFxuICAgIGZpbHRlcjogJ2FscGhhKG9wYWNpdHk9MCknLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAnMHB4JyxcbiAgICBsZWZ0OiAnMHB4J1xuICB9LFxuICBmaWxlU2VsZWN0Q29udGVudDoge1xuICAgIG1hcmdpblJpZ2h0OiAxMixcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIHdpZHRoOiAnMTUwcHgnLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIG1hcmdpbkJvdHRvbTogJzEycHgnLFxuICB9LFxuICBtYWluSW1hZ2U6IHtcbiAgICB3aWR0aDogMzAwLFxuICAgIGhlaWdodDogMjE0LFxuICAgIG1hcmdpbkJvdHRvbTogJzEycHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gIH0sXG4gIGRldGFpbEltYWdlOiB7XG4gICAgd2lkdGg6IDE1MCxcbiAgICBoZWlnaHQ6IDIwMCxcbiAgICBtYXJnaW5Cb3R0b206ICcxMnB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmJyxcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIG1hcmdpblJpZ2h0OiAnMTJweCdcbiAgfSxcbiAgc3BlY0tleToge1xuICAgIHdpZHRoOiAxNTAsXG4gICAgbWFyZ2luUmlnaHQ6IDEyXG4gIH0sXG4gIHNwZWNWYWx1ZToge1xuICAgIHdpZHRoOiAzMDAsXG4gICAgbWFyZ2luTGVmdDogMTJcbiAgfSxcbiAgc3BlY0l0ZW06IHtcbiAgICB3aWR0aDogNTAwLFxuICAgIG1hcmdpbjogJzAgYXV0bydcbiAgfSxcbiAgc3BlY0FkZEJ0bjoge1xuICAgIHdpZHRoOiAxMDAsXG4gICAgaGVpZ2h0OiA0MCxcbiAgICBib3JkZXJSYWRpdXM6ICcyJScsXG4gIH1cbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvb3JkZXJMaXN0L09yZGVyTGlzdFN0eWxlcy5qcyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1JhaXNlZEJ1dHRvbiwgVGV4dEZpZWxkfSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQge3N0eWxlc30gZnJvbSAnLi9Mb2dpblN0eWxlJztcbmltcG9ydCB7cmVxdWVzdH0gZnJvbSAnLi8uLi8uLi9jb21tb24vcmVxdWVzdCc7XG5cbmNsYXNzIExvZ2luIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXJuYW1lOiAnJyxcbiAgICAgIHBhc3N3b3JkOiAnJ1xuICAgIH07XG4gIH1cblxuICBpbnB1dENoYW5nZSA9IGtleSA9PiB7XG4gICAgY29uc3Qgb2JqID0ge307XG4gICAgcmV0dXJuIGUgPT4ge1xuICAgICAgb2JqW2tleV0gPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUob2JqKTtcbiAgICB9O1xuICB9O1xuXG4gIGNsaWNrTG9naW4gPSAoKSA9PiB7XG4gICAgY29uc3Qge3VzZXJuYW1lLCBwYXNzd29yZH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHJlcXVlc3QoJ2FkbWluL2FkbWluLWluZm8nLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgYWRtaW46IHVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgIH0pXG4gICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHJlcy5yZXRDb2RlID09PSAwKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuJywgcmVzLnRva2VuKTtcbiAgICAgICAgICB0aGF0LnByb3BzLmhpc3RvcnkucHVzaCgnL21haW4vZ29vZHNMaXN0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnQocmVzLm1zZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLnRpdGxlfT7lsI/nqIvluo/lkI7lj7DmlbDmja7nu7TmiqTns7vnu588L2Rpdj5cbiAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgIHN0eWxlPXtzdHlsZXMuaW5wdXR9XG4gICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXnlKjmiLflkI1cIlxuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi55So5oi35ZCNXCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5pbnB1dENoYW5nZSgndXNlcm5hbWUnKX1cbiAgICAgICAgLz5cbiAgICAgICAgPFRleHRGaWVsZFxuICAgICAgICAgIHN0eWxlPXtzdHlsZXMuaW5wdXR9XG4gICAgICAgICAgaGludFRleHQ9XCLor7fovpPlhaXlr4bnoIFcIlxuICAgICAgICAgIGZsb2F0aW5nTGFiZWxUZXh0PVwi5a+G56CBXCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5wYXNzd29yZH1cbiAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmlucHV0Q2hhbmdlKCdwYXNzd29yZCcpfVxuICAgICAgICAvPlxuICAgICAgICA8UmFpc2VkQnV0dG9uXG4gICAgICAgICAgc3R5bGU9e3N0eWxlcy5idXR0b259XG4gICAgICAgICAgbGFiZWw9XCLnoa7lrprnmbvpmYZcIlxuICAgICAgICAgIHByaW1hcnk9e3RydWV9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5jbGlja0xvZ2lufVxuICAgICAgICAvPlxuICAgICAgICA8c3BhbiBzdHlsZT17c3R5bGVzLnRpcHN9PuWmguaenOeZu+mZhuaciemXrumimOivt+iBlOezu+aKgOacr+S6uuWRmOOAgjwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9naW47XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0xvZ2luLmpzIiwibW9kdWxlLmV4cG9ydHMuc3R5bGVzID0ge1xuICB0aXRsZToge1xuICAgIGZvbnRTaXplOiAzMCxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIG1hcmdpblRvcDogMTAwLFxuICAgIGNvbG9yOiAnI2NjYydcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIG1hcmdpbjogJzEwcHggYXV0bydcbiAgfSxcbiAgYnV0dG9uOiB7XG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICBtYXJnaW46ICczMHB4IGF1dG8nLFxuICAgIHdpZHRoOiAyNTYsXG4gICAgaGVpZ2h0OiA0MFxuICB9LFxuICB0aXBzOiB7XG4gICAgZm9udFNpemU6IDE0LFxuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBjb2xvcjogJyNjY2MnXG4gIH1cbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0xvZ2luU3R5bGUuanMiLCJpbXBvcnQgeyBjb21iaW5lUmVkdWNlcnMgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgZ29vZHNMaXN0IGZyb20gJy4vZ29vZHNMaXN0JztcbmltcG9ydCBjYXRlZ29yaWVzTGlzdCBmcm9tICcuL2NhdGVnb3JpZXNMaXN0JztcbmltcG9ydCBvcmRlcnNMaXN0IGZyb20gJy4vb3JkZXJzTGlzdCc7XG5pbXBvcnQgYWN0aXZlTGlzdCBmcm9tICcuL2FjdGl2ZUxpc3QnO1xuXG5jb25zdCBzbWFsbEFwcCA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4gIGdvb2RzTGlzdCxcbiAgY2F0ZWdvcmllc0xpc3QsXG4gIG9yZGVyc0xpc3QsXG4gIGFjdGl2ZUxpc3Rcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzbWFsbEFwcDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVkdWNlcnMvaW5kZXguanMiLCJpbXBvcnQge2Zyb21KU30gZnJvbSAnaW1tdXRhYmxlJztcblxuY29uc3QgaW5pU3RhdGUgPSB7XG4gIGdvb2RzTGlzdDogW10sXG4gIGVkaXRHb29kOiB7XG4gICAgZ29vZHNfbmFtZTogJycsXG4gICAgZ29vZHNfaW1hZ2U6ICcnLFxuICAgIGdvb2RzX3R5cGVfaWQ6IDAsXG4gICAgZ29vZHNfY29sbGVjdDogMCxcbiAgICBjYXRlZ29yeV9pZDogMCxcbiAgICBnb29kc19qaW5nbGU6ICcnLFxuICAgIGdvb2RzX3ByaWNlOiAwLFxuICAgIGdvb2RzX21hcmtldHByaWNlOiAwLFxuICAgIGdvb2RzX3NlcmlhbDogJycsXG4gICAgZ29vZHNfY2xpY2s6IDAsXG4gICAgZ29vZHNfc2FsZW51bTogMCxcbiAgICBnb29kc19zcGVjOiBbXSxcbiAgICBnb29kc19zdG9yYWdlOiAwLFxuICAgIGdvb2RzX3N0YXRlOiAwLFxuICAgIGdvb2RzX3ZlcmlmeTogMCxcbiAgICBjcmVhdGVfdGltZTogJycsXG4gICAgdXBkYXRlX3RpbWU6ICcnLFxuICAgIGdvb2RzX2ZyZWlnaHQ6IDAsXG4gICAgZXZhbHVhdGlvbl9nb29kX3N0YXI6IDAsXG4gICAgZXZhbHVhdGlvbl9jb3VudDogMCxcbiAgfVxufTtcblxuY29uc3QgZ29vZHNMaXN0ID0gKHN0YXRlID0gZnJvbUpTKGluaVN0YXRlKSwgYWN0aW9uKSA9PiB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdTQVZFX0dPT0RTX0xJU1QnOlxuICAgICAgcmV0dXJuIHN0YXRlLm1lcmdlKGZyb21KUyh7Z29vZHNMaXN0OiBhY3Rpb24uZGF0YUFyciwgZ29vZHNUb3RhbDogYWN0aW9uLnRvdGFsfSkpO1xuICAgIGNhc2UgJ1BBVENIX0dPT0RfREVUQUlMJzpcbiAgICAgIHJldHVybiBzdGF0ZS5tZXJnZURlZXAoZnJvbUpTKHtlZGl0R29vZDogYWN0aW9uLmRhdGFPYmp9KSk7XG4gICAgY2FzZSAnUElDS19HT09EX0RFVEFJTCc6XG4gICAgICByZXR1cm4gc3RhdGUuc2V0KCdlZGl0R29vZCcsIGZyb21KUyhhY3Rpb24uZGF0YU9iaikpO1xuICAgIGNhc2UgJ1BBVENIX0dPT0RTX0xJU1QnOlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIGNhc2UgJ0FERF9TUEVDJzpcbiAgICAgIHJldHVybiBzdGF0ZS51cGRhdGVJbihcbiAgICAgICAgWydlZGl0R29vZCcsICdnb29kc19zcGVjJ10sXG4gICAgICAgIGFyciA9PiBhcnIucHVzaChmcm9tSlMoe2tleTogJycsIHZhbHVlOiAnJ30pKVxuICAgICAgKTtcbiAgICBjYXNlICdFRElUX1NQRUMnOlxuICAgICAgcmV0dXJuIHN0YXRlLnVwZGF0ZUluKFxuICAgICAgICBbJ2VkaXRHb29kJywgJ2dvb2RzX3NwZWMnLCBhY3Rpb24uaW5kZXhdLFxuICAgICAgICB2YWx1ZSA9PiB2YWx1ZS5tZXJnZShhY3Rpb24uZGF0YU9iailcbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ29vZHNMaXN0O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWR1Y2Vycy9nb29kc0xpc3QuanMiLCJpbXBvcnQge2Zyb21KU30gZnJvbSAnaW1tdXRhYmxlJztcblxuY29uc3QgaW5pU3RhdGUgPSB7XG4gIGNhdGVnb3JpZXNMaXN0OiBbXSxcbn07XG5cbmNvbnN0IGNhdGVnb3JpZXNMaXN0ID0gKHN0YXRlID0gZnJvbUpTKGluaVN0YXRlKSwgYWN0aW9uKSA9PiB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdTQVZFX0NBVEVHT1JJRVNfTElTVCc6XG4gICAgICByZXR1cm4gc3RhdGUuc2V0KCdjYXRlZ29yaWVzTGlzdCcsIGFjdGlvbi5kYXRhQXJyKTtcbiAgICBjYXNlICdQQVRDSF9HT09EX0RFVEFJTCc6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgY2FzZSAnUEFUQ0hfR09PRFNfTElTVCc6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2F0ZWdvcmllc0xpc3Q7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3JlZHVjZXJzL2NhdGVnb3JpZXNMaXN0LmpzIiwiaW1wb3J0IHtmcm9tSlN9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmNvbnN0IGluaVN0YXRlID0ge1xuICBvcmRlcnNMaXN0OiBbXSxcbiAgb3JkZXJEZXRhaWw6IHt9LFxuICBvcmRlcnNUb3RhbDogMFxufTtcblxuY29uc3QgZ29vZHNMaXN0ID0gKHN0YXRlID0gZnJvbUpTKGluaVN0YXRlKSwgYWN0aW9uKSA9PiB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdTQVZFX09SREVSX0xJU1QnOlxuICAgICAgcmV0dXJuIHN0YXRlLm1lcmdlKGZyb21KUyh7b3JkZXJzTGlzdDogYWN0aW9uLmRhdGFBcnIsIG9yZGVyc1RvdGFsOiBhY3Rpb24udG90YWx9KSk7XG4gICAgY2FzZSAnUElDS19PUkRFUl9ERVRBSUwnOlxuICAgICAgcmV0dXJuIHN0YXRlLnNldCgnb3JkZXJEZXRhaWwnLCBmcm9tSlMoYWN0aW9uLmRhdGFPYmopKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnb29kc0xpc3Q7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3JlZHVjZXJzL29yZGVyc0xpc3QuanMiLCJpbXBvcnQge2Zyb21KU30gZnJvbSAnaW1tdXRhYmxlJztcblxuY29uc3QgaW5pU3RhdGUgPSB7XG4gIGFjdGl2ZUxpc3Q6IFtdLFxuICBlZGl0QWN0aXZlOiB7XG4gICAgZGlzY291bnQ6IDksXG4gICAgZ29vZHNfbGlzdDogW10sXG4gICAgZ29vZHNfY291bnQ6IFtdLFxuICAgIHN0YXJ0X3RpbWU6IG51bGwsXG4gICAgaW1hZ2VfdXJsOiBcImh0dHBzOi8vaW1hZ2UucWFmb3JtYXRoLmNvbS9jb21wdXRlcl9zdXBlcmFwcC9iYW5uZXIwMS5qcGdcIixcbiAgICBjcmVhdGVfdGltZTogXCIyMDE3LTEwLTE2IDE2OjEwOjE0XCIsXG4gICAgZW5kX3RpbWU6IG51bGwsXG4gICAgYWN0aXZlX3R5cGU6IDMsXG4gICAgdGl0bGU6IFwi5Lii5Lii5LiiXCIsXG4gICAgaWQ6IDQsXG4gICAgc29ydDogNCxcblxuICB9XG59O1xuXG5jb25zdCBhY3RpdmVMaXN0ID0gKHN0YXRlID0gZnJvbUpTKGluaVN0YXRlKSwgYWN0aW9uKSA9PiB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdTQVZFX0FDVElWRV9MSVNUJzpcbiAgICAgIHJldHVybiBzdGF0ZS5tZXJnZShmcm9tSlMoe2FjdGl2ZUxpc3Q6IGFjdGlvbi5kYXRhQXJyLCB0b3RhbDogYWN0aW9uLnRvdGFsfSkpO1xuICAgIGNhc2UgJ1BJQ0tfQUNUSVZFX0RFVEFJTCc6XG4gICAgICByZXR1cm4gc3RhdGUuc2V0KCdlZGl0QWN0aXZlJywgZnJvbUpTKGFjdGlvbi5kYXRhT2JqKSk7XG4gICAgY2FzZSAnUEFUQ0hfQUNUSVZFX0RFVEFJTCc6XG4gICAgICByZXR1cm4gc3RhdGUubWVyZ2VEZWVwKGZyb21KUyh7ZWRpdEFjdGl2ZTogYWN0aW9uLmRhdGFPYmp9KSk7XG4gICAgY2FzZSAnUEFUQ0hfQUNUSVZFX0xJU1QnOlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIGNhc2UgJ0FERF9BQ1RJVkVfR09PRFMnOlxuICAgICAgY29uc3QgaW5kZXggPSBzdGF0ZS5nZXRJbihbJ2VkaXRBY3RpdmUnLCAnZ29vZHNfbGlzdCddKS5pbmRleE9mKGFjdGlvbi5pZCk7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBzdGF0ZSA9IHN0YXRlLnVwZGF0ZUluKFsnZWRpdEFjdGl2ZScsICdnb29kc19saXN0J10sIGFyciA9PiBhcnIuZGVsZXRlKGluZGV4KSk7XG4gICAgICAgIHN0YXRlID0gc3RhdGUudXBkYXRlSW4oWydlZGl0QWN0aXZlJywgJ2dvb2RzX2NvdW50J10sIGFyciA9PiBhcnIuZGVsZXRlKGluZGV4KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZSA9IHN0YXRlLnVwZGF0ZUluKFsnZWRpdEFjdGl2ZScsICdnb29kc19saXN0J10sIGFyciA9PiBhcnIucHVzaChhY3Rpb24uaWQpKTtcbiAgICAgICAgc3RhdGUgPSBzdGF0ZS51cGRhdGVJbihbJ2VkaXRBY3RpdmUnLCAnZ29vZHNfY291bnQnXSwgYXJyID0+IGFyci5wdXNoKDEpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICBjYXNlICdFRElUX0FDVElWRV9HT09EUyc6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWN0aXZlTGlzdDtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVkdWNlcnMvYWN0aXZlTGlzdC5qcyJdLCJzb3VyY2VSb290IjoiIn0=