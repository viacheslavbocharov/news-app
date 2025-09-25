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
      if (opts.enableAds)  modules.push("prebid"); // /src/modules/prebid.ts
      if (opts.enableGads) modules.push("gads");   // /src/modules/gads.ts (позже)

      // Чтобы было видно в консоли браузера, что виртуальный модуль сработал:
      const banner = `console.log("[virtual] loaded: ${modules.join(", ") || "none"}");\n`;

      if (modules.length === 0) {
        // Пустой модуль, но с видимым логом
        return banner;
      }

      const imports = modules.map((m) => `import "/src/modules/${m}.ts";`).join("\n");
      return banner + imports + "\n";
    },
  };
}
