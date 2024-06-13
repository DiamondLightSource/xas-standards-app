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

  http.post('/api/standards', () => {
    console.log('Captured a "POST /api/standards" request')
    const standard1: XASStandard = {
      beamline: { facility: { name: "SSRL" }, name: "4-1", id:1 },
      citation:
        "Pickering, I. J., George, G. N., & Hedman, B. (1994). SSRL workshops on x-ray absorption spectroscopy. Synchrotron Radiation News, 7(1), 17.",
      doi: "10.1080/08940889408261246",
      edge: { id: 1, name: "K" },
      element: { symbol: "As", z: 33 },
      id: 1,
      collection_date: "2024-03-13T09:02:23.686549",
      facility: "SSRL",
      sample_comp: "As2 O3",
      sample_name: "As2O3 arsenious oxide",
      sample_prep: "powder, mixed 1:60 with B(OH)3 by wt",
    };
    return HttpResponse.json(standard1);
  }),

  // Intercept "GET https://example.com/user" requests...
  http.get("/api/user", () => {
    // ...and respond to them using this JSON response.
    // return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({
      user: "abc12345",
      admin: true
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
      id:3
    };

    const edge1: Edge = {
      id: 1,
      name: "K",
    };
    const edge2: Edge = {
      id: 2,
      name: "L",
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

  http.get("/api/standards", ({ request }) => {
    // ...and respond to them using this JSON response.

    const url = new URL(request.url);
    const element = url.searchParams.get("element");

    const standard1: XASStandard = {
      beamline: { facility: { name: "SSRL" }, name: "4-1", id:1 },
      citation:
        "Pickering, I. J., George, G. N., & Hedman, B. (1994). SSRL workshops on x-ray absorption spectroscopy. Synchrotron Radiation News, 7(1), 17.",
      doi: "10.1080/08940889408261246",
      edge: { id: 1, name: "K" },
      element: { symbol: "As", z: 33 },
      id: 1,
      collection_date: "2024-03-13T09:02:23.686549",
      facility: "SSRL",
      sample_comp: "As2 O3",
      sample_name: "As2O3 arsenious oxide",
      sample_prep: "powder, mixed 1:60 with B(OH)3 by wt",
    };

    const standard2: XASStandard = {
      beamline: { facility: { name: "dls" }, name: "b01", id: 2 },
      citation:
        "Pickering, I. J., George, G. N., & Hedman, B. (1994). SSRL workshops on x-ray absorption spectroscopy. Synchrotron Radiation News, 7(1), 17.",
      doi: "10.1080/08940889408261246",
      edge: { id: 1, name: "K" },
      element: { symbol: "He", z: 2 },
      id: 2,
      collection_date: "2024-03-13T09:02:23.686549",
      facility: "dls",
      sample_comp: "He",
      sample_name: "Helium",
      sample_prep: "Gas",
    };

    let items = [standard1, standard2];
    if (element != null) {
      items = items.filter((e) => {
        return e.element.symbol === element;
      });
    }

    return HttpResponse.json({
      items: items,
      current_page: "H",
      current_page_backwards: "H",
    });
  }),

  http.get("/api/data/*", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json(response);
  }),

  http.get('/login', () => {
    return new HttpResponse('<div>Hello</div>', {
      headers: {
        'Content-Type': 'application/html'
      }
    })
  })

  // http.get("/login", () => {
  //   // ...and respond to them using this JSON response.
  //   return new HttpResponse(null, { status: 302, Location: "/" });
  // }),
];
