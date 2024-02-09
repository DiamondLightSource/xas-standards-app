import { XASStandard } from "../models";

function StandardMetadataTable(props: { standard: XASStandard }) {
  const standard = props.standard;

  console.log(standard);

  if (!standard) {
    return <div></div>;
  }

  return (
    <table id="standards">
      <tbody>
        <tr>
          <th>Sample Name</th>
          <td> {standard.sample_name} </td>
        </tr>
        <tr>
          <th>Sample Prep</th>
          <td> {standard.sample_prep}</td>
        </tr>
        <tr>
          <th>Sample Comp</th>
          <td> {standard.sample_comp}</td>
        </tr>
        <tr>
          <th>DOI</th>
          <td> {standard.doi}</td>
        </tr>
        <tr>
          <th>Citation</th>
          <td> {standard.citation} </td>
        </tr>
        <tr>
          <th>Beamline</th>
          <td> {standard.beamline.name} </td>
        </tr>
        <tr>
          <th>Facility</th>
          <td> {standard.beamline.facility.name}</td>
        </tr>
        <tr>
          <th>Collection Date</th>
          <td> {standard.collection_date}</td>
        </tr>
        <tr>
          <th>Download</th>
          <td> link </td>
        </tr>
      </tbody>
    </table>
  );
}

export default StandardMetadataTable;
