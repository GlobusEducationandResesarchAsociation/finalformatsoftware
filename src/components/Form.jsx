import React, { useState } from "react";
export default function Form() {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const backendURL = "https://publication-api.onrender.com/process";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDownloadUrl(null);
    const formData = new FormData(e.target);
    const doiNum = formData.get("doiNumber");
    if (!/^[0-9]{9}$/.test(doiNum)) {
      alert("DOI must be 9 digits");
      setLoading(false);
      return;
    }
    formData.set("doi", `doi:10.46360/cosmos.ahe.${doiNum}`);
    try {
      const response = await fetch(backendURL, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Backend error");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch {
      alert("Error processing document");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "formatted_publication.docx";
    link.click();
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2">Header</h2>
        <label className="block text-gray-700 font-medium">Journal Name</label>
        <input type="text" name="journal_name" className="w-full p-2 border rounded-lg" required />
        <label className="block text-gray-700 font-medium">Volume Details</label>
        <input type="text" name="volume_details" className="w-full p-2 border rounded-lg" required />
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2">General Details</h2>
        {["paper_received","paper_accepted","paper_published"].map((f)=>(
          <div key={f}>
            <label className="block text-gray-700 font-medium capitalize">{f.replace("_"," ")}</label>
            <input type="date" name={f} className="w-full p-2 border rounded-lg" required />
          </div>
        ))}
        {["author_name","corresponding_author","email"].map((f)=>(
          <div key={f}>
            <label className="block text-gray-700 font-medium capitalize">{f.replace("_"," ")}</label>
            <input type={f==="email"?"email":"text"} name={f} className="w-full p-2 border rounded-lg" required />
          </div>
        ))}
        <label className="block text-gray-700 font-medium">DOI Number</label>
        <div className="flex">
          <span className="bg-gray-200 p-2 rounded-l-lg text-sm border border-r-0">doi:10.46360/cosmos.ahe.</span>
          <input type="number" name="doiNumber" className="flex-1 p-2 border rounded-r-lg" required />
        </div>
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2">Footer</h2>
        <label className="block text-gray-700 font-medium">Footer Text</label>
        <input type="text" name="footer_text" className="w-full p-2 border rounded-lg" required />
        <label className="block text-gray-700 font-medium">Upload Document</label>
        <input type="file" name="file" accept=".docx" required />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white w-full py-2 rounded-lg mt-4 hover:bg-blue-700">
          {loading ? "Processing..." : "Generate Formatted Document"}
        </button>
      </form>
      {downloadUrl && (
        <div className="text-center mt-6">
          <button onClick={handleDownload} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Download Document
          </button>
        </div>
      )}
    </div>
  );
}
