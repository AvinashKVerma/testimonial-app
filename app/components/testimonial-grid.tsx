"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Input,
} from "@heroui/react";
import {
  FaQuoteLeft,
  FaVideo,
  FaHeadphones,
  FaFileAlt,
  FaSearch,
  FaList,
  FaThLarge,
} from "react-icons/fa";
import { formatDate } from "@/lib/utils";

type TestimonialWithUser = {
  name: string;
  id: string;
  course: string;
  type: "text" | "audio" | "video";
  content: string;
  date: Date;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
};

export default function TestimonialGrid({
  testimonials,
}: {
  testimonials: TestimonialWithUser[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "text" | "audio" | "video">(
    "all"
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <FaVideo className="w-4 h-4" />;
      case "audio":
        return <FaHeadphones className="w-4 h-4" />;
      default:
        return <FaFileAlt className="w-4 h-4" />;
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (testimonial.type === "text" &&
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filter === "all" || testimonial.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex sm:flex-row flex-col justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            startContent={<FaSearch />}
            variant="bordered"
            placeholder="Search testimonials..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {/* Filter buttons */}
          <div className="flex border rounded-md overflow-hidden">
            {(["all", "text", "audio", "video"] as const).map((type) => (
              <Button
                key={type}
                variant={filter === type ? "solid" : "ghost"}
                size="sm"
                className="rounded-none capitalize"
                onPress={() => setFilter(type)}
              >
                {type !== "all" && getTypeIcon(type)}
                {type}
              </Button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "solid" : "ghost"}
              size="sm"
              onPress={() => setViewMode("grid")}
              className="rounded-none"
            >
              <FaThLarge className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "solid" : "ghost"}
              size="sm"
              onPress={() => setViewMode("list")}
              className="rounded-none"
            >
              <FaList className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      {filteredTestimonials.length === 0 ? (
        <div className="py-12 text-muted-foreground text-center">
          No testimonials found matching your search.
        </div>
      ) : viewMode === "grid" ? (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardHeader className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar
                    showFallback
                    name={testimonial.user.name ?? "Unknown User"} // Use name directly from outer object
                    src={testimonial.user?.image ?? ""} // Fallback for image
                    radius="full"
                    size="md"
                    isBordered
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <span className="text-default-400 text-xs">
                      {formatDate(testimonial.date)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="bordered"
                  className="flex items-center gap-1 rounded-full h-6 capitalize"
                >
                  {getTypeIcon(testimonial.type)}
                  {testimonial.type}
                </Button>
              </CardHeader>
              <CardBody className="pt-0">
                <FaQuoteLeft className="opacity-10 mb-2 w-6 h-6 text-primary" />
                {testimonial.type === "text" ? (
                  <p className="italic">{testimonial.content}</p>
                ) : testimonial.type === "audio" ? (
                  <audio
                    src={testimonial.content}
                    controls
                    className="mt-2 w-full"
                  />
                ) : (
                  <video
                    src={testimonial.content}
                    controls
                    className="mt-2 rounded-md w-full"
                  />
                )}
                <p className="mt-4 font-medium text-default-500 text-sm">
                  Course: {testimonial.course}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardBody>
                <div className="flex md:flex-row flex-col gap-4">
                  <Avatar
                    showFallback
                    name={testimonial.user.name ?? ""}
                    src={testimonial.user.image ?? ""}
                    radius="full"
                    size="md"
                    isBordered
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{testimonial.user.name}</p>
                        <p className="text-default-400 text-xs">
                          {formatDate(testimonial.date)}
                        </p>
                      </div>
                      <Button
                        variant="flat"
                        className="flex items-center gap-1 rounded-full h-6 capitalize"
                      >
                        {getTypeIcon(testimonial.type)}
                        {testimonial.type}
                      </Button>
                    </div>
                    <div className="mt-3">
                      {testimonial.type === "text" ? (
                        <p className="italic">{testimonial.content}</p>
                      ) : testimonial.type === "audio" ? (
                        <audio
                          src={testimonial.content}
                          controls
                          className="w-full"
                        />
                      ) : (
                        <video
                          src={testimonial.content}
                          controls
                          className="rounded-md w-full"
                        />
                      )}
                    </div>
                    <p className="mt-3 font-medium text-default-500 text-sm">
                      Course: {testimonial.course}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
