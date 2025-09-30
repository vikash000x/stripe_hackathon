// src/components/ResumeUploadForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import { parseResume, ParsedResume } from "../utils/parseResume";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResumeForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ParsedResume>({
    name: "",
    email: "",
    phone: "",
  });

    const navigate = useNavigate();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    console.log("Selected file:");
    if (selectedFile.type !== "application/pdf") {
      return alert("Please upload a PDF file.");
    }
    const parsed = await parseResume(selectedFile);
    console.log("Parsed Resume Data:");
    setFormData(parsed); // allow user to edit later
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file.");

    const backendForm = new FormData();
    backendForm.append("resume", file);
    backendForm.append("name", formData.name);
    backendForm.append("email", formData.email);
    backendForm.append("phone", formData.phone);

    const res = await fetch("http://localhost:5000/api/upload-resume", {
      method: "POST",
      body: backendForm,
    });

    if (!res.ok) {
      alert("Failed to upload resume");
      return;
    }

    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Redirect to home
    navigate("/home");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ResumeForm;
