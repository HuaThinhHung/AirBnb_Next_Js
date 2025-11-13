export async function getRooms() {
  const res = await fetch("https://airbnbnew.cybersoft.edu.vn/api/phong-thue", {
    headers: {
      "Content-Type": "application/json",
      "tokenCybersoft": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjIyLzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2OTA0MDAwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY5MTkxMjAwfQ.kBKKhbMMH6Pqm5TdwA9DOp9z6srHiyc9KnYL_084PPo" // sẽ nói ở bước 3
    },
    cache: "no-store" // để fetch mới mỗi lần render
  })

  if (!res.ok) throw new Error("Lỗi khi gọi API")
  return res.json()
}
