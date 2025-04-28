"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { FaFileAlt, FaHeadphones, FaVideo } from "react-icons/fa";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  Button,
  DatePicker,
  Input,
  Radio,
  RadioGroup,
  Textarea,
  Form,
  addToast,
  SelectItem,
  Select,
  Switch,
} from "@heroui/react";
import { FaPlay, FaStopCircle } from "react-icons/fa";
import type { User } from "next-auth";

const courses = [
  "Web Development Fundamentals",
  "Advanced React",
  "Full-Stack JavaScript",
  "Node.js Masterclass",
  "TypeScript Essentials",
  "Next.js for Production",
];

export default function SubmitForm({ user }: { user: User }) {
  const router = useRouter();
  const formatter = useDateFormatter({ dateStyle: "full" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user?.name || "",
    course: "",
    type: "video",
    content: "",
    date: new Date(),
    file: null as File | null, // added file input state
    isRecording: false, // Track whether recording or uploading
  });
  const [isClient, setIsClient] = useState(false); // To check if we are in the browser

  useEffect(() => {
    setIsClient(true); // Only set once the component has mounted in the browser
  }, []);

  const testimonialType = formValues.type;

  // MediaRecorder setup for video or audio
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    clearBlobUrl,
  } = useReactMediaRecorder({
    video: testimonialType === "video",
    audio: testimonialType !== "text",
    blobPropertyBag: {
      type: testimonialType === "video" ? "video/webm" : "audio/webm",
    },
  });

  if (typeof window === "undefined") return null; // extra safety

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormValues((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleFileSubmit = async () => {
    const blob = await fetch(mediaBlobUrl!).then((res) => res.blob());
    const file = new File([blob], `recording.${testimonialType}.webm`, {
      type: blob.type,
    });
    return file;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // If recording is ongoing, stop it first
    if (formValues.isRecording && status === "recording") {
      addToast({
        title: "Warning",
        description: "Please stop recording",
        color: "warning",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("course", formValues.course);
      formData.append("type", formValues.type);
      formData.append("date", formValues.date.toISOString());

      if (
        (mediaBlobUrl &&
          (testimonialType === "audio" || testimonialType === "video")) ||
        formValues.file // check if file is uploaded
      ) {
        const recordedFile = formValues.file
          ? formValues.file
          : await handleFileSubmit();
        formData.append("media", recordedFile);
        formData.append("content", recordedFile.name);
      } else {
        formData.append("content", formValues.content);
      }

      const res = await fetch("/api/testimonials", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit testimonial");

      addToast({
        title: "Success!",
        description: "Your testimonial has been submitted.",
        color: "success",
      });

      router.push("/testimonials");
      router.refresh();
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      addToast({
        title: "Error",
        description: "Failed to submit your testimonial.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
      clearBlobUrl();
    }
  };

  // Handle toggling between recording and file upload
  const toggleRecording = () => {
    setFormValues((prev) => ({
      ...prev,
      isRecording: !prev.isRecording,
      file: null, // clear file when toggling between recording and upload
    }));
  };

  if (!isClient) {
    return null; // Prevent rendering SSR
  }

  return (
    <Form className="space-y-8 w-full" onSubmit={onSubmit}>
      <Input
        isRequired
        label="Name"
        name="name"
        value={formValues.name}
        labelPlacement="outside"
        variant="bordered"
        placeholder="Enter your name"
        description="We'll use your name from your profile."
        isDisabled
      />

      <Select
        description="Select the course you want to provide feedback for."
        label="Course"
        variant="bordered"
        labelPlacement="outside"
        placeholder="Select a course"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setFormValues((prev) => ({ ...prev, course: e.target.value }))
        }
        isRequired
      >
        {courses.map((course) => (
          <SelectItem key={course}>{course}</SelectItem>
        ))}
      </Select>

      <RadioGroup
        label="Testimonial Type"
        value={formValues.type}
        onChange={(e) =>
          setFormValues((prev) => ({ ...prev, type: e.target.value }))
        }
        className="flex"
        orientation="horizontal"
        classNames={{ label: "text-black" }}
      >
        <Radio value="text">
          <div className="flex justify-center items-center gap-2">
            <FaFileAlt className="w-4 h-4" />
            Text
          </div>
        </Radio>
        <Radio value="audio">
          <div className="flex justify-center items-center gap-2">
            <FaHeadphones className="w-4 h-4" />
            Audio
          </div>
        </Radio>
        <Radio value="video">
          <div className="flex justify-center items-center gap-2">
            <FaVideo className="w-4 h-4" />
            Video
          </div>
        </Radio>
      </RadioGroup>

      {testimonialType === "text" ? (
        <Textarea
          placeholder="Share your experience with the course..."
          className="min-h-[120px]"
          variant="bordered"
          value={formValues.content}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, content: e.target.value }))
          }
        />
      ) : (
        <div>
          <div className="flex justify-center items-center gap-2">
            {/* Toggle between file upload and recording */}
            <Switch
              isSelected={formValues.isRecording}
              onChange={toggleRecording}
            >
              {`Switch to ${formValues.isRecording ? "Upload" : "Recording"}`}
            </Switch>

            {formValues.isRecording ? (
              <div className="flex gap-4">
                <Button
                  onPress={() => {
                    clearBlobUrl();
                    startRecording();
                  }}
                  isDisabled={status === "recording"}
                  endContent={<FaPlay />}
                  className="bg-success-400"
                >
                  Start Recording
                </Button>
                <Button
                  onPress={stopRecording}
                  isDisabled={status !== "recording"}
                  className="bg-danger-400"
                  endContent={<FaStopCircle />}
                >
                  Stop Recording
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept={testimonialType === "audio" ? "audio/*" : "video/*"}
                  onChange={handleFileChange}
                  variant="bordered"
                  labelPlacement="outside"
                  label={`Upload ${
                    testimonialType === "audio" ? "Audio" : "Video"
                  } File`}
                />
              </div>
            )}
          </div>

          {previewStream &&
            testimonialType === "video" &&
            status === "recording" && (
              <div className="mt-4">
                <p className="mb-2 font-medium text-sm">
                  Live Preview:
                  {status === "recording" && (
                    <span className="text-yellow-600">Recording…</span>
                  )}
                </p>
                <video
                  ref={(videoElement) => {
                    if (videoElement) {
                      videoElement.srcObject = previewStream;
                    }
                  }}
                  autoPlay
                  muted
                  className="rounded-md w-full"
                />
              </div>
            )}

          {mediaBlobUrl && (
            <div className="mt-4">
              <p className="mb-2 font-medium text-sm">Preview:</p>
              {testimonialType === "audio" ? (
                <audio src={mediaBlobUrl} controls className="w-full" />
              ) : (
                <video
                  src={mediaBlobUrl}
                  controls
                  className="rounded-md w-full"
                />
              )}
            </div>
          )}
        </div>
      )}
      <DatePicker
        classNames={{ base: "w-full" }}
        aria-label="Pick a date"
        labelPlacement="outside"
        label="Course Completion Date"
        variant="bordered"
        value={parseDate(format(formValues.date, "yyyy-MM-dd"))}
        onChange={(val) => {
          if (val) {
            const date = val.toDate(getLocalTimeZone());
            setFormValues((prev) => ({ ...prev, date }));
          }
        }}
        description={
          <p className="text-muted-foreground text-sm">
            Selected date:{" "}
            {formValues.date ? formatter.format(formValues.date) : "--"}
          </p>
        }
      />

      <Button
        type="submit"
        className="bg-black w-full text-white"
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Testimonial"}
      </Button>
    </Form>
  );
}
