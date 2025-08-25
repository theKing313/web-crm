import { useEffect, useState, useRef } from "react";
import AuthForm from "../components/AuthForm";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [fp, setFp] = useState(null);
  const shareButtonRef = useRef(null);

  return (
    <>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
          boxShadow: "0 0 15px rgba(0,170,85,0.3)",
          position: "relative",
          background: "white",
          color: "#0a5",
        }}
      >
        <AuthForm onAuth={() => window.location.reload()} />
      </div>
    </>
  );
}
