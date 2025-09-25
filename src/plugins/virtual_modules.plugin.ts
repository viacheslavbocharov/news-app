type Options = {
  enableAds?: boolean;
  enableGads?: boolean;
};

export default function virtualModules(opts: Options = {}) {
  const VIRTUAL_ID = "virtual:plugins";

  return {
    name: "virtual-modules",
    resolveId(id: string) {
      if (id === VIRTUAL_ID) return VIRTUAL_ID;
      return null;
    },
    load(id: string) {
      if (id !== VIRTUAL_ID) return null;

      const modules: string[] = [];
      if (opts.enableAds) modules.push("prebid");
      if (opts.enableGads) modules.push("gads");

      const banner = `console.log("[virtual] loaded: ${modules.join(", ") || "none"}");\n`;

      if (modules.length === 0) {
        return banner;
      }

      const imports = modules.map((m) => `import "/src/modules/prebid/${m}.ts";`).join("\n");
      return `${banner}${imports}\n`;
    },
  };
}
