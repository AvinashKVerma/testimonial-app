"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Chip,
} from "@heroui/react";
import { FaQuoteLeft, FaVideo, FaHeadphones, FaFileAlt } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

type TestimonialWithUser = {
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

export default function RecentTestimonials({
  testimonials,
}: {
  testimonials: TestimonialWithUser[];
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <FaVideo className="w-3 h-3" />;
      case "audio":
        return <FaHeadphones className="w-3 h-3" />;
      default:
        return <FaFileAlt className="w-3 h-3" />;
    }
  };

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="p-2 max-w-full">
          <CardHeader className="justify-between pb-2">
            <div className="flex items-center gap-4">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={testimonial.user.image || ""}
                fallback={
                  testimonial.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"
                }
              />
              <div className="flex flex-col justify-center items-start">
                <h4 className="font-semibold text-default-600 text-sm">
                  {testimonial.user.name}
                </h4>
                <p className="text-default-400 text-xs">
                  {formatDate(testimonial.date)}
                </p>
              </div>
            </div>
            <Chip
              variant="faded"
              className="h-6 text-xs capitalize"
              startContent={getTypeIcon(testimonial.type)}
            >
              {testimonial.type}
            </Chip>
          </CardHeader>

          <CardBody className="relative text-default-500 text-sm">
            <FaQuoteLeft className="top-0 left-0 absolute opacity-20 w-6 h-6 text-primary" />
            {testimonial.type === "text" ? (
              <p className="pt-2 pl-5 italic">{testimonial.content}</p>
            ) : testimonial.type === "audio" ? (
              <div className="pt-4">
                <audio
                  src={testimonial.content}
                  controls
                  className="rounded-md w-full"
                />
              </div>
            ) : (
              <div className="pt-4">
                <video
                  src={testimonial.content}
                  controls
                  className="rounded-md w-full"
                />
              </div>
            )}
          </CardBody>

          <CardFooter className="flex justify-between items-center pt-2">
            <span className="font-medium text-default-400 text-xs">
              Course: {testimonial.course}
            </span>
            <Button variant="light" size="sm" className="text-primary text-xs">
              View Profile
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
