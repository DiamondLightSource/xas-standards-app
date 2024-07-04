import { http, HttpResponse } from "msw";

import {
  AppMetadata,
  Facility,
  Beamline,
  Edge,
  Element,
  XASStandard,
  AdminXASStandard,
} from "../models";

import { data_response } from "./data_response";

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
    return HttpResponse.json(data_response);
  }),


  http.get("/api/admin/data/*", ({request}) => {

    const url = new URL(request.url)

    const format = url.searchParams.get('format')

    if (format === "json") {
      return HttpResponse.json(data_response);
    }

    const file_content = "# XDI/1.0\n# Column.1: energy eV\n# Column.2: i0\n# Column.3: itrans\n# Column.4: irefer\n# Beamline.name: SSRL 4-3\n# Detector.I0: N2 15cm\n# Detector.I1: N2 30cm\n# Detector.I2: N2 15cm\n# Element.edge: K\n# Element.symbol: Mn\n# Mono.d_spacing: 1.92009\n# Mono.name: Si(220)\n# Mono.notes: unfocused, detuned 10%\n# Sample.formula: MnO\n# Sample.name: MnO\n# Sample.prep: powder, mixed with B(OH)3\n# Sample.reference: Mn filter\n# Sample.temperature: room temperature\n# Scan.start_time: 1995-06-20 02:43:21\n# ///\n#    Note: mono d_spacing is nominal!\n#     217  E XMU I0\n#-------------\n#   energy   i0   itrans  irefer\n    6520.0030  31260.500000  39559.300308  21748.998701\n    6521.0010  31244.500000  39558.301090  21716.000970\n    6522.0000  31237.500000  39580.299067  21723.999044\n    6523.0000  31219.500000  39528.301127  21592.000515\n    6523.9990  31208.500000  39531.301203  21565.999852\n    6524.9990  31201.500000  39519.300411  21505.000093\n    6525.9990  31194.500000  39532.301500  21492.999925\n    6527.0000  31185.500000  39519.299329  21431.998092\n    6528.0000  31175.500000  39487.301134  21332.000793\n    6529.0020  31166.500000  39494.301671  21298.999505\n    6530.0030  31163.500000  39482.302684  21245.999911\n    6531.0060  31152.500000  39481.302240  21203.000376\n    6532.0080  31148.500000  39485.301549  21151.000091\n    6533.0110  31127.500000  39419.301134  21016.000430\n"
    return HttpResponse.text(file_content)
  }),





  http.get('/login', () => {
    return new HttpResponse('<div>Hello</div>', {
      headers: {
        'Content-Type': 'application/html'
      }
    })
  }),

  http.get("/api/admin/standards", ({ request }) => {
  const admin_standard2: AdminXASStandard = {
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
    submitter: {identifier: "abc12345"}
  };

  return HttpResponse.json({
    items: [admin_standard2],
    current_page: "H",
    current_page_backwards: "H",
  });
  })

  // http.get("/login", () => {
  //   // ...and respond to them using this JSON response.
  //   return new HttpResponse(null, { status: 302, Location: "/" });
  // }),
];
