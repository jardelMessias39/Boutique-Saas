import { getFileUrl } from "@/lib/storage";

export function Logo({
  storeName,
  logoUrl,
  version,
}: {
  storeName: string;
  logoUrl?: string;
  version?: string | number;
}) {
  if (logoUrl) {
    return (
      <div className="flex items-center gap-2 select-none">
        <img src={getFileUrl(logoUrl, version)} alt={storeName} className="h-10 w-10 rounded-full object-cover" />
        <div className="flex flex-col leading-none">
          <span className="font-script text-2xl md:text-3xl text-rose-700 whitespace-nowrap">{storeName}</span>
          <span className="label-caps text-ink-soft whitespace-nowrap">Boutique Infantil</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start leading-none select-none">
      <div className="flex items-center gap-1.5">
        <CrownMark className="w-4 h-4 text-gold-500 -mb-1 shrink-0" />
        <span className="font-script text-2xl md:text-3xl text-rose-700 whitespace-nowrap">
          {storeName}
        </span>
      </div>
      <span className="label-caps text-ink-soft pl-6 whitespace-nowrap">Boutique Infantil</span>
    </div>
  );
}

function CrownMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M2 14.5 0 4l5.2 3.4L12 1l6.8 6.4L24 4l-2 10.5c-.15.8-.85 1.5-1.7 1.5H3.7c-.85 0-1.55-.7-1.7-1.5Z" />
    </svg>
  );
}
