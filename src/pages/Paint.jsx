import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

const ModalWindow = ({ closeModal, save }) => {
  const [paint, setPaint] = useState("");
  return (
    <div className="bg-gray-300 text-center w-1/2 mx-auto py-12 rounded  tex-lg shadow-lg absolute left-1/4 top-1/4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(paint);
          setPaint("");
          closeModal();
        }}
      >
        <label>Enter Paint Name</label>
        <input
          autoFocus
          onChange={(e) => setPaint(e.target.value)}
          value={paint}
          className=" border-2 border-blue-800 p-1 rounded ml-2"
          type="text"
        />

        <button
          onClick={() => closeModal()}
          className="ml-5 mr-2 rounded-sm border-2 border-orange-500 py-1 px-2"
        >
          Cancel
        </button>
        <button className=" bg-green-500 py-2 px-2 mt-2 text-white font-bold rounded">
          Save
        </button>
      </form>
    </div>
  );
};

const Menu = ({
  setLineColor,
  setLineWidth,
  setLineOpacity,
  clearAll,
  save,
}) => {
  const [modal, setModal] = useState(false);
  const [width, setWidth] = useState(5);

  const closeModal = () => setModal(false);

  const saveHandler = (name) => {
    save(name);
  };
  return (
    <>
      {modal && (
        <ModalWindow
          closeModal={closeModal}
          save={(name) => saveHandler(name)}
        />
      )}

      <div
        className="Menu"
        style={{
          width: "750px",
          height: "50px",
          display: "flex",
          justifyContent: "space-evenly",
          borderRadius: "5px",
          alignItems: "center",
          backgroundColor: "#a3a3a32d",
          margin: "auto",
          marginTop: "10px",
        }}
      >
        <label>Brush Color </label>
        <input
          type="color"
          onChange={(e) => {
            setLineColor(e.target.value);
          }}
        />
        <label>Brush Width </label>
        <input
          type="range"
          min="3"
          max="20"
          value={width}
          onChange={(e) => {
            setLineWidth(e.target.value);
            setWidth(e.target.value);
          }}
        />
        <label>Brush Opacity</label>
        <input
          type="range"
          min="1"
          max="100"
          onChange={(e) => {
            setLineOpacity(e.target.value / 100);
          }}
        />
        <button
          className=" bg-red-500 text-white text-lg p-2 rounded-lg"
          onClick={clearAll}
        >
          &times;
        </button>
        <button
          className=" bg-green-500 text-white text-lg p-2 rounded-lg"
          onClick={() => setModal(true)}
        >
          Save
        </button>
      </div>
    </>
  );
};

function Paint({ login, user, isAuthenticate }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);

  // Function for starting the drawing
  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    ctxRef.current.stroke();
  };

  const save = async (name) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const src = canvasRef.current.toDataURL("image/png");
    try {
      setLoading(true);
      await axios.post(
        "https://project28-8085b-default-rtdb.firebaseio.com/paints.json?auth=" +
          token,
        { user: user.email, paintName: name, src, createdAt: Date.now() }
      );
      setLoading(false);
      toast.success("Paint saved!");
      clearAll();
    } catch (error) {
      console.log(error);
      toast.error("You are not authorized!");
    }
  };

  const clearAll = () => {
    // ctxRef.current.clearRect(0,0, canvas.width, canvas.height)
    ctxRef.current.clearRect(0, 0, 1280, 720);
  };

  return (
    <Layout login={login} user={user} isAuthenticate={isAuthenticate}>
      <div className=" flex justify-center items-center mt-16">
        <div
          className="draw-area"
          style={{
            width: "1280px",
            height: "720px",
            border: "2px solid #808080",
            position: "relative",
            backgroundColor: "white",
          }}
        >
          <Menu
            setLineColor={setLineColor}
            setLineWidth={setLineWidth}
            setLineOpacity={setLineOpacity}
            clearAll={clearAll}
            save={(name) => save(name)}
          />
          {loading && (
            <p className=" text-green-500 text-lg font-bold mt-4 text-center">
              {" "}
              Saving ...
            </p>
          )}
          <canvas
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
            ref={canvasRef}
            width={`1280px`}
            height={`720px`}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Paint;
