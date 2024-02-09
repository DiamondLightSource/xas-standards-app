export interface Element {
  symbol: string;
  z: number;
}

export interface Edge {
  name: string;
  id: number;
}

export interface XASData {
  energy: Array<number>;
  mutrans: Array<number>;
  murefer: Array<number>;
}

export interface Beamline {
  name: string;
}

export interface XASStandard {
  id: number;
  element: Element;
  edge: Edge;
  sample_name: string;
  sample_prep: string;
  facility: string;
  beamline: Beamline;
}

export interface XASStandardInput {
  file1: File;
  licence: string;
}
