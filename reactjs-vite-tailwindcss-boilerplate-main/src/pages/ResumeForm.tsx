// src/components/ResumeUploadForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { parseResume, ParsedResume } from "../utils/parseResume";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCandidate  } from "../store/slices/candidateSlice";
import { resetAssessment } from "@/store/slices/interviewSlices";
const ResumeForm = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ParsedResume>({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      return alert("Please upload a PDF file.");
    }

    setFile(selectedFile);
    const parsed = await parseResume(selectedFile);
    setFormData(parsed);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file.");

    setLoading(true);
    try {
      const backendForm = new FormData();
      backendForm.append("resume", file);
      backendForm.append("name", formData.name);
      backendForm.append("email", formData.email);
      backendForm.append("phone", formData.phone);

      const res = await fetch("https://stripe-hackathon.onrender.com/api/upload-resume", {
        method: "POST",
        body: backendForm,
      });

      if (!res.ok) throw new Error("Failed to upload resume");

      const data = await res.json();
      dispatch(
        setCandidate({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          resumeUrl: data.user.resumeUrl,
        })
      );
      dispatch(resetAssessment()); 
      navigate("/home");
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
     <Card className="w-full max-w-lg backdrop-blur-lg bg-white/80 border border-amber-300 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl hover:border-amber-500 hover:scale-[1.01]">
  <CardHeader className="text-center">
    <CardTitle className="text-3xl font-bold text-amber-800 flex items-center justify-center gap-2">
      <FileText className="w-7 h-7 text-amber-700 animate-pulse" />
      Upload Your Resume
    </CardTitle>
    <p className="text-gray-600 text-sm mt-1">
      We’ll extract your details automatically.
    </p>
  </CardHeader>

  <CardContent>
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File Upload Box */}
      <div>
        <Label htmlFor="resume" className="mb-2 block text-amber-800 font-medium">
          Resume (PDF only)
        </Label>
        <div className="relative group">
          <label
            htmlFor="resume"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gradient-to-b from-amber-50 to-amber-100 
                       border-amber-400 transition-all duration-300 ease-in-out
                       group-hover:border-amber-600 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] group-hover:scale-[1.02]"
          >
            <div className="absolute inset-0 rounded-xl border-2 border-dashed border-amber-400 opacity-40 animate-[dash_4s_linear_infinite] pointer-events-none"></div>

            <Upload className="w-8 h-8 text-amber-600 mb-1 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm text-gray-700">
              {file ? file.name : "Click to upload or drag & drop"}
            </span>
            <Input
              id="resume"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-amber-800 font-medium">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          className="transition-all focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-amber-800 font-medium">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          className="transition-all focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="text-amber-800 font-medium">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
          required
          className="transition-all focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-amber-700 hover:bg-amber-800 transition-all duration-300 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02]"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin w-5 h-5" /> Uploading...
          </span>
        ) : (
          "Submit"
        )}
      </Button>
    </form>
  </CardContent>
</Card>

    </div>
  );
};

export default ResumeForm;
