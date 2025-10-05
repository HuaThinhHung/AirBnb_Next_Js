import React from "react";
import Link from "next/link";

export default function ListBlog() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Link href={"/blog/1"} className="bg-white text-black p-4 rounde shadow ">
        Bài viết 1
      </Link>
      <Link href={"/blog/2"} className="bg-white text-black p-4 rounde shadow ">
        Bài viết 2
      </Link>
      <Link href={"/blog/3"} className="bg-white text-black p-4 rounde shadow ">
        Bài viết 3
      </Link>
      <Link href={"/blog/4"} className="bg-white text-black p-4 rounde shadow ">
        Bài viết 4
      </Link>
    </div>
  );
}
