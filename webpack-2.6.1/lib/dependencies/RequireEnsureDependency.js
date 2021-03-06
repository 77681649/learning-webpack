/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";
const NullDependency = require("./NullDependency");
const DepBlockHelpers = require("./DepBlockHelpers");

class RequireEnsureDependency extends NullDependency {
  constructor(block) {
    super();
    this.block = block;
  }

  get type() {
    return "require.ensure";
  }
}

RequireEnsureDependency.Template = class RequireEnsureDependencyTemplate {
  /**
   * 
   * 
   * @param {any} dep 
   * @param {any} source 
   * @param {any} outputOptions 
   * @param {any} requestShortener 
   */
  apply(dep, source, outputOptions, requestShortener) {
    const depBlock = dep.block;
    const wrapper = DepBlockHelpers.getLoadDepBlockWrapper(depBlock, outputOptions, requestShortener, "require.ensure");
    
    // 是否有错误回调函数
    const errorCallbackExists = depBlock.expr.arguments.length === 4 || 
      (!depBlock.chunkName && depBlock.expr.arguments.length === 3);
    
    //
    // __webpack_require__.e/* <方法名> */(<chunkId>) [/*! <chunkName> */] [<chunkReason>].then(
    //  ....
    // ).bind(null,__webpack_require__).catch(__webpack_require__.oe)
    //
    const startBlock = wrapper[0] + "(";
    const middleBlock = `).bind(null, __webpack_require__)${wrapper[1]}`;
    const endBlock = `${middleBlock}__webpack_require__.oe${wrapper[2]}`;
    
    source.replace(depBlock.expr.range[0], depBlock.expr.arguments[1].range[0] - 1, startBlock);
    
    if (errorCallbackExists) {
      source.replace(depBlock.expr.arguments[1].range[1], depBlock.expr.arguments[2].range[0] - 1, middleBlock);
      source.replace(depBlock.expr.arguments[2].range[1], depBlock.expr.range[1] - 1, wrapper[2]);
    } else {
      source.replace(depBlock.expr.arguments[1].range[1], depBlock.expr.range[1] - 1, endBlock);
    }
  }
};

module.exports = RequireEnsureDependency;
