import { CopyButton } from "./CopyButton";
import { MARKS } from "../lib/unicode";

export default function Home() {
  return (
    <div>
      <div className="mt-32 text-6xl" style={{ marginBottom: "800px" }}>
        {[..."potato"].map((char, i) => (
          <span key={i}>
            {char +
              (i % 2 === 0
                ? MARKS.below.seen.repeat(20)
                : MARKS.below.lowMeem.repeat(20))}
          </span>
        ))}
      </div>

      <div
        className="mt-32"
        style={{
          marginBottom: "800px",
          fontFamily: "Google Sans, Roboto, Arial, sans-serif",
          fontSize: "20px",
          fontWeight: 400,
        }}
      >
        {[..."eeeeee"].map((char, i) => (
          <span key={i}>
            {char +
              (i % 2 === 0
                ? (MARKS.below.seen + MARKS.below.lowMeem).repeat(10)
                : (MARKS.below.lowMeem + MARKS.below.seen).repeat(10))}
          </span>
        ))}
      </div>

      <div
        className="mt-32"
        style={{
          marginBottom: "800px",
          fontFamily: "Google Sans, Roboto, Arial, sans-serif",
          fontSize: "20px",
          fontWeight: 400,
        }}
      >
        {[..."gggggggggggggggggggg"].map((char, i) => (
          <span key={i}>
            {char +
              (i % 2 === 0
                ? (MARKS.above.seen + MARKS.above.meemIsolated).repeat(20)
                : (MARKS.above.meemIsolated + MARKS.above.seen).repeat(20)) +
              (i % 2 === 0
                ? (MARKS.below.seen + MARKS.below.lowMeem).repeat(20)
                : (MARKS.below.lowMeem + MARKS.below.seen).repeat(20))}
          </span>
        ))}
      </div>

      {/* <div className="mt-32" style={{ marginBottom: "800px" }}>
        <h2 className="text-2xl font-bold mb-2">imageToMarks() Test</h2>
        <p className="text-zinc-500 mb-8">
          12 columns, 40 height (20 above + 20 below), alternating checkerboard
          pattern
        </p>
        <div
          style={{
            fontFamily: "Google Sans, Roboto, Arial, sans-serif",
            fontSize: "20px",
            fontWeight: 400,
          }}
        >
          {imageToMarks(testImageData, "g")}
        </div>
      </div> */}

      {/* <div className="mt-32" style={{ marginBottom: "800px" }}>
        <h2 className="text-2xl font-bold mb-2">Image Data</h2>
        <p className="text-zinc-500 mb-8">
          {imageData.width} columns, {imageData.height} height (
          {imageData.aboveHeight} above + {imageData.belowHeight} below)
        </p>
        <div
          style={{
            fontFamily: "Google Sans, Roboto, Arial, sans-serif",
            fontSize: "20px",
            fontWeight: 400,
          }}
        >
          {pageTitle}
        </div>
        <p className="text-zinc-500 mt-4">
          Character count (.length): {pageTitle.length}
        </p>
        <CopyButton text={pageTitle} />
      </div> */}

      <div className="mt-32" style={{ marginBottom: "800px" }}>
        <h2 className="text-2xl font-bold mb-2">Equal H</h2>
        <div
          style={{
            fontFamily: "Google Sans, Roboto, Arial, sans-serif",
            fontSize: "20px",
            fontWeight: 400,
          }}
        >
          {"g" +
            MARKS.above.meemIsolated.repeat(38) +
            MARKS.below.lowMeem.repeat(44) +
            "g" +
            MARKS.above.seen.repeat(50) +
            MARKS.below.seen.repeat(50)}
        </div>
      </div>
    </div>
  );
}
