import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Testimonial from "@/app/models/Testimonial";
import User from "@/app/models/User";
import cloudinary from "@/lib/cloudinary"; // Import Cloudinary config
import { v4 as uuidv4 } from "uuid"; // For generating unique file names

// Define the Cloudinary upload result type
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  // Add other properties you might need
}

// API config to disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const formData = await req.formData();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const fields: Record<string, string> = {};
    const file = formData.get("media");

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        fields[key] = value;
      }
    });

    let contentPath: string | null = null;

    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const buffer = Buffer.from(await (file as Blob).arrayBuffer());

      // Generate a unique file name using UUID or timestamp
      const filename = `${uuidv4()}-${Date.now()}-${
        (file as Blob & { name?: string }).name || "upload"
      }`;

      // Upload file to Cloudinary
      const uploadedFile = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              { resource_type: "auto", public_id: filename }, // Cloudinary auto detects file type
              (error, result) => {
                if (error) reject(error);
                else resolve(result as CloudinaryUploadResult); // Typecast the result
              }
            )
            .end(buffer);
        }
      );

      contentPath = uploadedFile?.secure_url || null; // Get the secure URL of the uploaded file
    }

    const testimonial = await Testimonial.create({
      name: fields.name,
      course: fields.course,
      type: fields.type,
      content: contentPath || fields.content,
      message: fields.content || "",
      date: new Date(fields.date),
      userId: user._id,
    });

    return NextResponse.json({
      message: "Testimonial submitted successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Error handling testimonial:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
