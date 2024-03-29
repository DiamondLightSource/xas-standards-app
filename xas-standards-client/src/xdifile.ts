class XDIMetaEntry {
  namespace: string;
  tag: string;
  value: string;
  unit: string | null;

  constructor(
    namespace: string,
    tag: string,
    value: string,
    unit: string | null
  ) {
    this.namespace = namespace;
    this.tag = tag;
    this.value = value;
    this.unit = unit;
  }
}

class XDIFile {
  static COMMENT_TOKEN = "#";
  static HEADER_SPLIT_TOKEN = ":";
  static NAMESPACE_SEPARATOR = ".";

  static SAMPLE = "Sample";
  static ELEMENT = "Element";
  static BEAMLINE = "Beamline";
  static SCAN = "Scan";
  static SYMBOL = "symbol";
  static EDGE = "edge";
  static PREP = "prep";
  static STOICHIOMETRY = "stoichiometry";
  static COLUMN = "Column";

  static START_TIME = "start_time";
  static NAME = "name";

  static ENERGY = "energy";
  static IREFER = "irefer";
  static MUREFER = "murefer";

  static TRANS = "trans";
  static FLUOR = "fluor";
  static MU = "mu";
  static I = "i";
  static I0 = "i0";

  static MUSPEC = [XDIFile.MU + XDIFile.TRANS, XDIFile.MU + XDIFile.FLUOR];
  static ISPEC = [XDIFile.I + XDIFile.TRANS, XDIFile.I + XDIFile.FLUOR];

  element: string | null;
  edge: string | null;
  sample: { [key: string]: string } | null;
  beamline: string | null;
  date: string | null;
  columns: string[];
  comments: string | null;

  constructor(
    element: string | null,
    edge: string | null,
    sample: { [key: string]: string } | null,
    beamline: string | null,
    date: string | null,
    columns: string[],
    comments: string
  ) {
    this.element = element;
    this.edge = edge;
    this.sample = sample;
    this.beamline = beamline;
    this.date = date;
    this.columns = columns;
    this.comments = comments;
  }

  //   Facility, Beamline, Mono, Detector, Sample, Scan, Element, Column

  static parseFile(xditext: string) {
    const lines = xditext.split("\n");

    const sample: { [key: string]: string } = {};
    const columns = [];
    let beamline = null;
    let element = null;
    let edge = null;
    let date = null;

    let inComment = false;
    let comment = "";

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];

      if (inComment) {
        if (l.slice(1).trim().startsWith("-")) {
          break;
        }

        comment = comment + l.slice(1).trim() + "\n";
      }

      if (i == 0) {
        this.checkHeaderLine(l);
      } else if (l.startsWith(XDIFile.COMMENT_TOKEN)) {
        if (l.slice(1).trim().startsWith("/")) {
          inComment = true;
        }
        const md = XDIFile.parseMetadataLine(l);

        if (md.namespace === XDIFile.SAMPLE) {
          sample[md.tag] = md.value;
        } else if (
          md.namespace === XDIFile.BEAMLINE &&
          md.tag == XDIFile.NAME
        ) {
          beamline = md.value;
        } else if (
          md.namespace === XDIFile.ELEMENT &&
          md.tag == XDIFile.SYMBOL
        ) {
          element = md.value;
        } else if (md.namespace === XDIFile.ELEMENT && md.tag == XDIFile.EDGE) {
          edge = md.value;
        } else if (
          md.namespace === XDIFile.SCAN &&
          md.tag == XDIFile.START_TIME
        ) {
          date = md.value;
        } else if (md.namespace === XDIFile.COLUMN) {
          columns.push(md.value);
        }
      }
    }

    return new XDIFile(element, edge, sample, beamline, date, columns, comment);
  }

  static checkHeaderLine(line: string) {
    const cleaned_line = line.slice(1).trim();
    if (cleaned_line.slice(0, 3) != "XDI") {
      throw new Error("XDI header not matched by: " + cleaned_line);
    }
  }

  checkValid() {
    if (!this.columns.includes(XDIFile.ENERGY)) {
      throw new Error("Required column energy is missing!");
    }

    const hasI0 = this.columns.includes(XDIFile.I0);

    if (
      !(this.columns.includes(XDIFile.IREFER) && hasI0) ||
      !this.columns.includes(XDIFile.MUREFER)
    ) {
      throw new Error("Required reference data is missing!");
    }

    const includes = (reference: string[], values: string[]) =>
      values.some((v) => reference.includes(v));

    const hasMu = includes(this.columns, XDIFile.MUSPEC);

    if (hasMu) {
      return true;
    }

    const hasI = includes(this.columns, XDIFile.ISPEC);

    if (hasI && hasI0) {
      return true;
    }

    return false;
  }

  static parseMetadataLine(line: string): XDIMetaEntry {
    const cleaned_line = line.slice(1).trim();
    const idx = cleaned_line.indexOf(XDIFile.HEADER_SPLIT_TOKEN);
    const key = cleaned_line.slice(0, idx).trim();
    const val_unit = cleaned_line.slice(idx + 1).trim();
    const nsidx = key.indexOf(".");
    const ns = key.slice(0, nsidx);
    const tag = key.slice(nsidx + 1).toLowerCase();

    const checkUnit = ns === XDIFile.COLUMN;

    let val = val_unit;
    let unit = null;

    if (checkUnit) {
      const vals = val_unit.split(" ");
      val = vals[0].trim();
      unit = checkUnit && vals.length > 1 ? vals[1].trim() : null;
    }

    return new XDIMetaEntry(ns, tag, val, unit);
  }
}

export default XDIFile;
