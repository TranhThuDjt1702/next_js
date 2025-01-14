"use client";
import React from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Iorder } from "@/database/order.model";
// import { getOrderDetail } from "@/lib/actions/order.action";

const OrderDetail = ({code, orderDetail} : {
    code : string,
    orderDetail : Iorder
}) => {

  return (
    <div>
     sex gay
    </div>
  );
};

export default OrderDetail;
