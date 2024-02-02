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

  static START_TIME = "start_time";
  static NAME = "name";

  element;
  edge;
  sample;
  beamline;
  date;

  constructor(element, edge, sample, beamline, date) {
    this.element = element;
    this.edge = edge;
    this.sample = sample;
    this.beamline = beamline;
    this.date = date;
  }

  //   Facility, Beamline, Mono, Detector, Sample, Scan, Element, Column

  static parseFile(xditext: string) {
    const lines = xditext.split("\n");

    const sample = {};
    let beamline = null;
    let element = null;
    let edge = null;
    let date = null;

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (i == 0) {
        this.checkHeaderLine(l);
      } else if (l.startsWith(XDIFile.COMMENT_TOKEN)) {
        if (l.slice(1).trim().startsWith("/")) {
          break;
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
        }
      }
    }

    return new XDIFile(element, edge, sample, beamline, date);
  }

  static checkHeaderLine(line: string) {
    const cleaned_line = line.slice(1).trim();
    if (cleaned_line.slice(0, 3) != "XDI") {
      throw new Error("XDI header not matched by: " + cleaned_line);
    }
  }

  static parseMetadataLine(line: string): XDIMetaEntry {
    const cleaned_line = line.slice(1).trim();
    const idx = cleaned_line.indexOf(XDIFile.HEADER_SPLIT_TOKEN);
    const key = cleaned_line.slice(0, idx).trim();
    const val = cleaned_line.slice(idx + 1).trim();
    const nsidx = key.indexOf(".");
    const ns = key.slice(0, nsidx);
    const tag = key.slice(nsidx + 1);
    return new XDIMetaEntry(ns, tag, val, null);
  }
}

export default XDIFile;
