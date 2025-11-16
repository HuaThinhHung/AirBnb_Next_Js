"use client";

import Link from "next/link";

type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
};

export default function AdminPageHeader({
  title,
  subtitle,
  meta,
  primaryAction,
  secondaryAction,
}: AdminPageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 break-words">{subtitle}</p>
          )}
          {meta && (
            <p className="text-xs text-gray-400 mt-0.5 break-words">{meta}</p>
          )}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center gap-3">
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="px-5 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction &&
              (primaryAction.href ? (
                <Link
                  href={primaryAction.href}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  {primaryAction.icon}
                  <span>{primaryAction.label}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  {primaryAction.icon}
                  <span>{primaryAction.label}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}


