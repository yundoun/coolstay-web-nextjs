export interface GuideStep {
  step: number
  title: string
  description: string
}

export interface GuideItem {
  id: string
  title: string
  summary: string
  icon: string
  steps: GuideStep[]
}
