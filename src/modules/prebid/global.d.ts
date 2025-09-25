import type { Pbjs } from "./pbjs.types";

declare global {
  interface Window {
    pbjs?: Pbjs;
  }
}
