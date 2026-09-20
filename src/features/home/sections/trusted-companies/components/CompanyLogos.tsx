export function CompanyLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-14 opacity-70 dark:opacity-60 transition-all">
      {/* Google */}
      <span className="font-semibold text-lg tracking-tight hover:text-foreground transition-colors">
        Google
      </span>

      {/* Microsoft */}
      <div className="flex items-center gap-2 hover:text-foreground transition-colors">
        <div className="grid grid-cols-2 gap-0.5">
          <span className="size-2 bg-current opacity-90" />
          <span className="size-2 bg-current opacity-90" />
          <span className="size-2 bg-current opacity-90" />
          <span className="size-2 bg-current opacity-90" />
        </div>
        <span className="font-semibold text-base tracking-tight">Microsoft</span>
      </div>

      {/* Amazon */}
      <div className="flex items-baseline gap-1 hover:text-foreground transition-colors">
        <span className="font-bold text-lg tracking-tight">amazon</span>
      </div>

      {/* IBM */}
      <span className="font-black text-lg tracking-widest hover:text-foreground transition-colors">
        IBM
      </span>

      {/* Meta */}
      <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 7.2c-2.4 0-4.3 1.6-5.3 3.6-1-2-2.9-3.6-5.3-3.6-3.3 0-5.4 2.8-5.4 6.8 0 4.6 2.6 7.6 6 7.6 2.2 0 4-1.2 5.1-3 1.1 1.8 2.9 3 5.1 3 3.4 0 6-3 6-7.6 0-4-2.1-6.8-5.4-6.8zm-7.6 12c-2.1 0-3.6-2-3.6-5.2 0-3 1.3-4.8 3.3-4.8 1.8 0 3.3 1.6 3.9 3.8-.5 3.5-1.9 6.2-3.6 6.2zm8 0c-1.7 0-3.1-2.7-3.6-6.2.6-2.2 2.1-3.8 3.9-3.8 2 0 3.3 1.8 3.3 4.8 0 3.2-1.5 5.2-3.6 5.2z"/>
        </svg>
        <span className="font-semibold text-base tracking-tight">Meta</span>
      </div>

      {/* Spotify */}
      <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
        <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" stroke="none" fill="currentColor" />
          <path d="M7 9c3-1 7-1 10 1M7.5 12c2.5-.8 6-.8 8.5.8M8 15c2-.5 4.5-.5 6.5.5" stroke="var(--background)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
        <span className="font-semibold text-base tracking-tight">Spotify</span>
      </div>

      {/* Adobe */}
      <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
        <span className="font-black text-sm px-1.5 py-0.5 bg-foreground text-background rounded-xs">A</span>
        <span className="font-semibold text-base tracking-tight">Adobe</span>
      </div>

      {/* Tesla */}
      <span className="font-mono font-bold text-base tracking-widest hover:text-foreground transition-colors">
        TESLA
      </span>

      {/* Samsung */}
      <span className="font-extrabold text-sm tracking-[0.2em] px-2.5 py-0.5 border border-current rounded-full hover:text-foreground transition-colors">
        SAMSUNG
      </span>
    </div>
  );
}
