import { http, HttpResponse } from "msw";

import {
  AppMetadata,
  Facility,
  Beamline,
  Edge,
  Element,
  XASStandard,
} from "../models";

import { response } from "./data_response";

//api/user

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get("/api/user", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      user: "abc12345",
    });
  }),

  http.get("/api/metadata", () => {
    // ...and respond to them using this JSON response.

    const facility1: Facility = {
      name: "dls",
    };

    const beamline1: Beamline = {
      facility: facility1,
      name: "b01",
    };

    const edge1: Edge = {
      id: 1,
      name: "Ka",
    };
    const edge2: Edge = {
      id: 1,
      name: "Kb",
    };

    const e1: Element = {
      symbol: "H",
      z: 1,
    };

    const e2: Element = {
      symbol: "He",
      z: 2,
    };

    const metadata: AppMetadata = {
      beamlines: [beamline1],
      licences: ["CC"],
      edges: [edge1, edge2],
      elements: [e1, e2],
    };

    return HttpResponse.json(metadata);
  }),

  http.get("/api/standards", () => {
    // ...and respond to them using this JSON response.

    const standard1: XASStandard = {
      beamline: { facility: { name: "dls" }, name: "b01" },
      citation: "citation",
      doi: "doi",
      edge: { id: 1, name: "Ka" },
      element: { symbol: "H", z: 1 },
      id: 1,
      collection_date: "2024-03-13T09:02:23.686549",
      facility: "dls",
      sample_comp: "H2",
      sample_name: "Hydrogen",
      sample_prep: "Gas",
    };

    const standard2: XASStandard = {
      beamline: { facility: { name: "dls" }, name: "b01" },
      citation: "citation",
      doi: "doi",
      edge: { id: 1, name: "Ka" },
      element: { symbol: "He", z: 2 },
      id: 2,
      collection_date: "2024-03-13T09:02:23.686549",
      facility: "dls",
      sample_comp: "He",
      sample_name: "Helium",
      sample_prep: "Gas",
    };
    return HttpResponse.json({
      items: [standard1, standard2],
      current_page: "H",
      current_page_backwards: "H",
    });
  }),

  http.get("/api/data/*", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(response);
  }),
];
