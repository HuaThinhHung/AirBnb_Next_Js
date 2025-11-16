"use client";

import {
  AdminToastProvider,
  useAdminToast,
} from "@/components/admin/AdminToastProvider";

export const AppToastProvider = AdminToastProvider;
export const useToast = useAdminToast;


