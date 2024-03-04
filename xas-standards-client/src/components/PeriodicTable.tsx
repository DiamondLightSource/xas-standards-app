import PeriodicTable, { OnClick } from "@celadora/periodic-table";
import { Context } from "@celadora/periodic-table";
import elements from "@celadora/periodic-table/elements";
import { useContext } from "react";

type Props = {
  atomicNumber: number;
};

function NewElement({ atomicNumber }: Props) {
  const { onClick } = useContext(Context);

  const element = elements[atomicNumber - 1];
  if (!element) {
    return <div></div>;
  }

  return (
    <div
      className="element"
      onClick={(e) => {
        onClick?.apply(null, [e, element]);
      }}
      style={{
        backgroundColor: "var(--diamond-800)",
        textAlign: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        borderRadius: 3,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="symbol"
        style={{
          color: "#fcd021",
          fontSize: "small",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {element.Symbol}
      </div>
      {/* <div className="number" style={{ position: 'absolute', top: 0, left: 1 }}>{atomicNumber}</div> */}
    </div>
  );
}

function SimplePeriodicTable(props: {
  onClickElement: React.Dispatch<number>;
  elementSize: number;
}) {
  const handleClick: OnClick = (e, element) => {
    props.onClickElement(Number(element.Number));
  };

  return (
    <PeriodicTable
      onClick={handleClick}
      Element={NewElement}
      squareSize={props.elementSize}
      margin={0}
    />
  );
}

export default SimplePeriodicTable;
