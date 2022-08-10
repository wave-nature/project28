import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const ModalWindow = ({ src }) => {
  const [close, setClose] = useState(false);
  return (
    <>
      {!close && (
        <div className=" absolute w-1/2 bg-white z-10">
          <button
            onClick={() => {
              setClose(true);
            }}
            className=" absolute right-0 p-2 bg-red-500 text-white rounded"
          >
            &times;
          </button>
          <img src={src} alt="paint" className="w-92 h-92" />
        </div>
      )}
    </>
  );
};

const MyPaints = ({ login, user, isAuthenticate }) => {
  const [paints, setPaints] = useState([]);
  const [modal, setModal] = useState(false);
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPaints();
  }, []);

  async function fetchPaints() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      setLoading(true);
      const response = await axios.get(
        "https://project28-8085b-default-rtdb.firebaseio.com/paints.json?auth=" +
          token
      );

      setLoading(false);
      const data = !!response.data ? Object.entries(response.data) : [];
      const filterData = data.filter(
        ([id, paint]) => paint.user === user.email
      );
      setPaints(filterData);
    } catch (error) {}
  }

  const deleteHandler = async (id) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      await axios.delete(
        `https://project28-8085b-default-rtdb.firebaseio.com/paints/${id}.json?auth=${token}`
      );
      setLoading(false);

      await fetchPaints();

      toast.success("Paint deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = (src) => {
    setModal((prev) => !prev);
    setSrc(src);
  };

  return (
    <Layout login={login} user={user} isAuthenticate={isAuthenticate}>
      {loading && (
        <p className=" text-green-500 text-lg font-bold mt-4 text-center">
          Please wait ...
        </p>
      )}
      {paints.length === 0 && (
        <p className=" font-bold text-lg text-center mt-24">
          No paint found, please add one.
        </p>
      )}

      {modal && <ModalWindow close={toggleModal} src={src} />}

      {paints.map(([id, paint]) => (
        <div
          key={id}
          className="  text-lg font-bold flex gap-4 w-1/2 items-center rounded bg-white p-2 mb-2 relative"
        >
          <div
            onClick={toggleModal.bind(this, paint.src)}
            className="flex gap-4 items-center cursor-pointer"
          >
            <p>{paint.paintName}</p>
            <p className=" text-gray-400 text-sm">
              {new Date(paint.createdAt).toLocaleDateString("en-in", {
                month: "short",
                day: "2-digit",
              })}
            </p>
            <img
              src={paint.src}
              alt="paint"
              className="h-12 w-12 bg-gray-200"
            />
          </div>
          <button
            onClick={deleteHandler.bind(this, id)}
            className="ml-auto bg-red-500 py-1 px-4 text-white rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </Layout>
  );
};

export default MyPaints;
