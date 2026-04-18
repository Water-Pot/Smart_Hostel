import React from "react";

export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {subtitle ? <p className="mb-4 mt-1 text-sm text-slate-300">{subtitle}</p> : null}
      {children}
    </article>
  );
}

export function Input({
  value,
  onChange,
  className = "",
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      {...props}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-300 ${className}`.trim()}
    />
  );
}

export function PrimaryButton({
  children,
  type = "submit",
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      {children}
    </button>
  );
}
