import { ExternalLink } from "lucide-react"
import type { AccommodationDetail } from "../types"

interface ExternalLinkSectionProps {
  accommodation: AccommodationDetail
}

export function ExternalLinkSection({ accommodation }: ExternalLinkSectionProps) {
  const activeLinks = accommodation.v2ExternalLinks.filter(
    (link) => link.activate
  )

  if (activeLinks.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">국내 최저가</h2>
      <div className="flex flex-wrap gap-3">
        {activeLinks.map((link, index) => (
          <a
            key={`${link.name}-${index}`}
            href={link.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            {link.icon_url ? (
              <img
                src={link.icon_url}
                alt=""
                className="size-5 rounded object-cover shrink-0"
              />
            ) : (
              <ExternalLink className="size-4 text-muted-foreground shrink-0" />
            )}
            {link.name}
          </a>
        ))}
      </div>
    </div>
  )
}
