"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Input,
  Tabs,
  Tab,
  Divider,
} from "@heroui/react";
import {
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
          <div className="flex flex-wrap gap-4">
            <Tabs
              aria-label="Tabs colors"
              color={"warning"}
              selectedKey={filter}
              onSelectionChange={(key) =>
                setFilter(key as "text" | "audio" | "video" | "all")
              }
              radius="full"
            >
              {(["all", "text", "audio", "video"] as const).map((type) => (
                <Tab
                  key={type}
                  title={
                    <div className="flex items-center space-x-2">
                      {type !== "all" && getTypeIcon(type)}
                      <span>{type.toLocaleUpperCase()}</span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </div>

          {/* View mode toggle */}
          <div className="flex flex-wrap gap-4">
            <Tabs
              aria-label="Tabs colors"
              color={"warning"}
              selectedKey={viewMode}
              onSelectionChange={(key) => setViewMode(key as "grid" | "list")}
              radius="full"
            >
              <Tab
                key={"grid"}
                title={
                  <div className="flex items-center space-x-2">
                    <FaThLarge className="w-4 h-4" />
                    <span>Grid</span>
                  </div>
                }
              />
              <Tab
                key={"list"}
                title={
                  <div className="flex items-center space-x-2">
                    <FaList className="w-4 h-4" />
                    <span>List</span>
                  </div>
                }
              />
            </Tabs>
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
            <Card
              key={testimonial.id}
              className="bg-white shadow-lg hover:shadow-xl border border-gray-100 rounded-2xl h-full transition-all duration-300"
            >
              <CardHeader className="flex flex-col justify-between items-center gap-3 p-3 rounded-t-2xl w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    <Avatar
                      showFallback
                      name={testimonial.name ?? "Unknown User"}
                      src={testimonial.user?.image ?? ""}
                      radius="full"
                      size="lg"
                      isBordered
                      className=""
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {testimonial.name}
                      </p>
                      <span className="text-gray-500 text-xs">
                        {formatDate(testimonial.date)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-primary/10 px-3 py-1.5 rounded-full font-medium text-primary text-xs capitalize"
                  >
                    {getTypeIcon(testimonial.type)} {testimonial.type}
                  </Button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="p-3">
                <div className="text-gray-700 text-sm leading-relaxed">
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
                      className="border rounded-lg w-full"
                    />
                  )}
                </div>

                <div className="pt-4 text-gray-500 text-sm">
                  📘 <span className="font-medium text-gray-700">Course:</span>{" "}
                  {testimonial.course}
                </div>
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
