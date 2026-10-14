// src/admin/pages/CreateLessonPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createLesson } from "../../api/admin";

export default function CreateLessonPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("video"); // required: video | document

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !type) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      // course_id GÖNDERMİYORUZ, URL'den gelecek
      formData.append("name", name);
      formData.append("description", description);
      formData.append("type", type); // backend validate: required|in:video,document

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Hem video hem document opsiyonel, varsa ikisini de gönderiyoruz
      if (videoFile) {
        formData.append("video_path", videoFile);
      }

      if (documentFile) {
        formData.append("document_path", documentFile);
      }

      const result = await createLesson(courseId, formData);
      console.log("CREATE LESSON RESPONSE:", result);

      setSuccess("Lesson created successfully.");

      // reset
      setName("");
      setDescription("");
      setType("video");
      setImageFile(null);
      setVideoFile(null);
      setDocumentFile(null);
    } catch (err) {
      console.error(
        "CREATE LESSON ERROR RAW:",
        err.response?.status,
        err.response?.data
      );

      const apiMessage = err.response?.data?.message;
      const firstError =
        err.response?.data?.errors &&
        Object.values(err.response.data.errors)[0][0];

      setError(
        firstError ||
          apiMessage ||
          "Failed to create lesson. Please check your data and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Create Lesson</h1>
          <p className="text-sm text-slate-600">
            Create a new lesson for course ID: {courseId}.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/admin/lessons/${courseId}`)}
          className="text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
        >
          Back to Lesson Management
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 max-w-xl space-y-4"
      >
        {/* Lesson name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Lesson Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter lesson name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Describe the lesson content"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Main Content Type<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="video"
                checked={type === "video"}
                onChange={() => setType("video")}
              />
              <span>Video</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="document"
                checked={type === "document"}
                onChange={() => setType("document")}
              />
              <span>Document</span>
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            This is the main type for the lesson. You can still upload both
            video and document files.
          </p>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
          <p className="text-xs text-slate-500 mt-1">
            Optional thumbnail image for this lesson.
          </p>
        </div>

        {/* Video upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Video File</label>
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/ogg"
            className="w-full text-sm"
            onChange={(e) => setVideoFile(e.target.files[0] || null)}
          />
          <p className="text-xs text-slate-500 mt-1">
            Allowed formats: mp4, mov, ogg, qt. Max 50MB.
          </p>
        </div>

        {/* Document upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Document File
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            className="w-full text-sm"
            onChange={(e) => setDocumentFile(e.target.files[0] || null)}
          />
          <p className="text-xs text-slate-500 mt-1">
            Allowed formats: PDF, Word, Excel, PowerPoint. Max 10MB.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}
