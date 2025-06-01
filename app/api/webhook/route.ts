import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import _ from "lodash";

// Xử lý webhook
export async function POST(req: NextRequest) {
  try {
    // Đọc dữ liệu từ request
    const data = await req.json();
    // console.log("Received webhook data", data);

    const mainNameJson = _.get(data, "data.uid");

    // UPDATE JSON LAYOUT
    const filePathJSON = path.join(
      process.cwd(),
      "public",
      "mocks",
      "layouts",
      `${mainNameJson}.json`
    );
    const dirPath = path.dirname(filePathJSON);
    try {
      await fs.access(dirPath); // Kiểm tra xem thư mục có tồn tại không
    } catch {
      await fs.mkdir(dirPath, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
    }
    // Ghi dữ liệu vào file JSON (tạo mới nếu chưa có, thay thế nội dung nếu đã tồn tại)
    await fs.writeFile(
      filePathJSON,
      JSON.stringify(data.data.layout, null, 2),
      "utf8"
    );

    // UPDATE JSON COMPONENT
    const filePathComponentJSON = path.join(
      process.cwd(),
      "public",
      "mocks",
      "components",
      `${mainNameJson}-component.json`
    );
    await fs.writeFile(
      filePathComponentJSON,
      JSON.stringify({ components: data.data.component }, null, 2),
      "utf8"
    );

    // UPDATE MONACO COMPONENT
    const filePathComponent = path.join(
      process.cwd(),
      "components",
      "grid-systems",
      `monacoContainer.tsx`
    );
    await fs.writeFile(filePathComponent, data.data.component, "utf8");

    // Đường dẫn đến tệp lastModified.json
    const lastModifiedPath = path.join(
      process.cwd(),
      "public",
      "mocks",
      "lastModified.json"
    );

    // Đọc nội dung hiện tại của lastModified.json
    let lastModifiedData: any = {};
    try {
      const fileContent = await fs.readFile(lastModifiedPath, "utf8");
      lastModifiedData = JSON.parse(fileContent);
    } catch (error: any) {
      // Nếu tệp không tồn tại, khởi tạo đối tượng trống
      if (error.code !== "ENOENT") throw error;
    }

    // Cập nhật thời gian chỉnh sửa cho trang hiện tại
    lastModifiedData[mainNameJson] = new Date().toISOString();

    // Ghi lại tệp lastModified.json với thông tin mới
    await fs.writeFile(
      lastModifiedPath,
      JSON.stringify(lastModifiedData, null, 2),
      "utf8"
    );

    console.log("Đã cập nhật lastModified");

    return NextResponse.json({
      message: "Webhook received and file updated successfully",
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
