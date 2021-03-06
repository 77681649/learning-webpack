/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const DllEntryDependency = require("./dependencies/DllEntryDependency");
const SingleEntryDependency = require("./dependencies/SingleEntryDependency");
const DllModuleFactory = require("./DllModuleFactory");

class DllEntryPlugin {
  constructor(context, entries, name) {
    this.context = context; // 上下文
    this.entries = entries; // 入口文件
    this.name = name;       // 名称
  }

  apply(compiler) {
    compiler.plugin("compilation", (compilation, params) => {
      const dllModuleFactory = new DllModuleFactory();
      const normalModuleFactory = params.normalModuleFactory;

      compilation.dependencyFactories.set(DllEntryDependency, dllModuleFactory);
      compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
    });

    compiler.plugin("make", (compilation, callback) => {
      compilation.addEntry(
        this.context,
        new DllEntryDependency(
          this.entries.map((e, idx) => {
            const dep = new SingleEntryDependency(e);
            dep.loc = `${this.name}:${idx}`;
            return dep;
          }),
          this.name
        ),
        this.name,
        callback);
    });
  }
}

module.exports = DllEntryPlugin;
