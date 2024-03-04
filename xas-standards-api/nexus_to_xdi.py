import h5py
import numpy as np

# Example

# XDI/1.0 GSE/1.0
# Column.1: energy eV
# Column.2: i0
# Column.3: itrans
# Column.4: mutrans
# Element.edge: K
# Element.symbol: Cu
# Scan.edge_energy: 8980.0
# Mono.name: Si 111
# Mono.d_spacing: 3.13553
# Beamline.name: 13ID
# Beamline.collimation: none
# Beamline.focusing: yes
# Beamline.harmonic_rejection: rhodium-coated mirror
# Facility.name: APS
# Facility.energy: 7.00 GeV
# Facility.xray_source: APS Undulator A
# Scan.start_time: 2001-06-26T22:27:31
# Detector.I0: 10cm  N2
# Detector.I1: 10cm  N2
# Sample.name: Cu
# Sample.prep: Cu metal foil
# GSE.EXTRA:  config 1
# ///
# Cu foil Room Temperature
# measured at beamline 13-ID
# ----


def main():

    ep = "/entry1/qexafs_counterTimer01/qexafs_energy"
    mup = "/entry1/qexafs_counterTimer01/lnI0It"
    mur = "/entry1/qexafs_counterTimer01/lnItIref"
    i0p = "/entry1/qexafs_counterTimer01/I0"
    irp = "/entry1/qexafs_counterTimer01/Iref"
    itp = "/entry1/qexafs_counterTimer01/It"
    lf = "\n"

    header_symbol = "# "
    field_end = "/////////////"
    header_end = "-------------"

    version = "XDI/1.0 TEST/1.0"
    edge = "Element.edge: K"
    element = "Element.symbol: Cu"
    beamline = "Beamline.name: B18"
    facility = "Facility.name: DLS"
    xray = "Facility.xray_source: DLS Bending Magnet B18"
    start = "Scan.start_time: 2001-06-26T22:27:31"
    name = "Sample.name: Cu Formate"
    prep = "Sample.prep: Pressed pellet"
    stoich = "Sample.stoichiometry: C2 H2 Cu O4"

    comment1 = "Test file for unit tests"
    comment2 = "line two"

    column1 = "Column.1: energy eV"
    column2 = "Column.2: mutrans"
    column3 = "Column.3: murefer"
    column4 = "Column.4: itrans"
    column5 = "Column.5: i0"
    column6 = "Column.6: irefer"

    with h5py.File("163245_Cu_formate_1.nxs") as fh, open("test.xdi", "w") as xdi:
        xdi.write(header_symbol + version + lf)

        xdi.write(header_symbol + column1 + lf)
        xdi.write(header_symbol + column2 + lf)
        xdi.write(header_symbol + column3 + lf)
        xdi.write(header_symbol + column4 + lf)
        xdi.write(header_symbol + column5 + lf)
        xdi.write(header_symbol + column6 + lf)

        xdi.write(header_symbol + edge + lf)
        xdi.write(header_symbol + element + lf)
        xdi.write(header_symbol + beamline + lf)
        xdi.write(header_symbol + facility + lf)
        xdi.write(header_symbol + xray + lf)

        xdi.write(header_symbol + start + lf)
        xdi.write(header_symbol + name + lf)
        xdi.write(header_symbol + prep + lf)
        xdi.write(header_symbol + stoich + lf)

        xdi.write(header_symbol + field_end + lf)
        xdi.write(header_symbol + comment1 + lf)
        xdi.write(header_symbol + comment2 + lf)
        xdi.write(header_symbol + header_end + lf)
        xdi.write(header_symbol + "energy mutrans murefer itrans i0 irefer" + lf)

        datasets = []

        datasets.append(fh[ep][...])
        datasets.append(fh[mup][...])
        datasets.append(fh[mur][...])
        datasets.append(fh[itp][...])
        datasets.append(fh[i0p][...])
        datasets.append(fh[irp][...])

        all = np.vstack(datasets)
        np.savetxt(xdi, all.T)


if __name__ == "__main__":
    main()
