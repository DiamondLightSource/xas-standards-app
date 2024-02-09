import { it, expect, describe } from "vitest";

import fs from "fs";
import XDIFile from "./xdifile";

describe("Parse info from xdi file", () =>
  new Promise((done) => {
    fs.readFile("test.xdi", "utf8", (err, data) => {
      if (err) throw err;
      const xdi = XDIFile.parseFile(data);

      it("Check element", () => {
        expect(xdi.element).toBe("Cu");
      });

      it("Check edge", () => {
        expect(xdi.edge).toBe("K");
      });

      it("Check sample", () => {
        expect(xdi.sample?.name).toBe("Cu Formate");
        expect(xdi.sample?.prep).toBe("Pressed pellet");
        expect(xdi.sample?.stoichiometry).toBe("C2 H2 Cu O4q");
      });

      it("Check columns valid", () => {
        expect(xdi.checkValid()).toBe(true);
      });

      done();
    });
  }));
