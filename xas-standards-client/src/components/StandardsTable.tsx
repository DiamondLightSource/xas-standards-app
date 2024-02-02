// function StandardMetadata(props:{ xasstandard : XASStandard, updatePlot : any}) {
//     return <tr onClick={() => props.updatePlot(props.xasstandard.id)} key={props.xasstandard.id}>
//         <td> {  props.xasstandard.element.symbol } </td>
//         <td> {  props.xasstandard.edge.name } </td>
//         <td> {  props.xasstandard.sample_name } </td>
//         <td> {  props.xasstandard.sample_prep } </td>
//         <td> {  props.xasstandard.beamline.name } </td>
//         </tr>;
// }

import { JSX } from "react";

import { XASStandard } from "../models";

function StandardMetadata(props: {
  xasstandard: XASStandard;
  updatePlot: React.Dispatch<number>;
}): JSX.Element {
  console.log(typeof props.updatePlot);
  return (
    <tr
      onClick={() => props.updatePlot(props.xasstandard.id)}
      key={props.xasstandard.id}
    >
      <td> {props.xasstandard.element.symbol} </td>
      <td> {props.xasstandard.edge.name} </td>
      <td> {props.xasstandard.sample_name} </td>
      <td> {props.xasstandard.sample_prep} </td>
      <td> {props.xasstandard.beamline.name} </td>
    </tr>
  );
}

function StandardsTable(props: {
  standards: XASStandard[];
  updatePlot: React.Dispatch<number>;
}): JSX.Element {
  console.log(props);
  return (
    <div className="standards-list">
      <table>
        <tbody>
          <tr>
            <th>Element</th>
            <th>Edge</th>
            <th>Name</th>
            <th>Prep</th>
            <th>Beamline</th>
          </tr>
          {props.standards.map((standard) =>
            StandardMetadata({
              xasstandard: standard,
              updatePlot: props.updatePlot,
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StandardsTable;
