import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // Force Next.js to re-render

export async function POST(request: Request) {
  try {
    let componentString = await request.text();

    if (!componentString) {
      console.error("❌ No component string provided!");
      return new Response(
        JSON.stringify({ error: "No component string provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // console.log("📄 Received componentString:", componentString);

    // Ensure the component starts with `"use client"`
    if (!componentString.includes('"use client"')) {
      return new Response(
        JSON.stringify({ error: "Component must start with 'use client'" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Remove unwanted characters
    componentString = componentString.replace(/\r/g, "").trim();

    // Ensure valid JavaScript syntax (add trailing newline)
    componentString += "\n";

    // Define the file path
    const filePathComponent = path.join(
      process.cwd(),
      "components",
      "grid-systems",
      "monacoContainer.tsx"
    );

    // Write the new component to the file
    await fs.writeFile(filePathComponent, componentString, "utf8");

    console.log("✅ Component successfully updated!");

    return new Response(
      JSON.stringify({ message: "Component updated successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error writing component file:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update component" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
