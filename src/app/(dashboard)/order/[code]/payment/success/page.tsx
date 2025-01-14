"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <span className="text-xl text-center font-bold ">
        Bạn đã mua khoá học thành công, vui lòng kiểm tra email để xem thông tin
        chi tiết 
      </span>
      <span className="text-xl text-center font-bold hover:text-purple-500">
        Chúc bạn học tập hiệu quả
      </span>
      <Button  onClick={() => router.push("/")}>Quay lại trang chủ</Button>
    </div>
  );
};

export default page;
