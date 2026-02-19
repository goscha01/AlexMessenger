// ===== Skeleton Block Factory =====
// Creates valid placeholder blocks for any block type.
// Used by blueprint enforcement (autofix.ts) and QA patches (patch.ts).

export function createSkeletonBlock(
  type: string,
  variant: string,
): Record<string, unknown> | null {
  switch (type) {
    case 'HeroSplit':
      return {
        type: 'HeroSplit',
        variant: variant || 'split-left',
        headline: 'Welcome',
        subheadline: 'Discover what we offer',
        ctaText: 'Get Started',
        ctaHref: '#',
      };

    case 'HeroTerminal':
      return {
        type: 'HeroTerminal',
        variant: variant || 'dark',
        headline: 'Build faster',
        subheadline: 'Developer tools for modern teams',
        ctaText: 'Get Started',
        ctaHref: '#',
        commandLines: ['$ npm install', '$ npm run dev', '> Ready on localhost:3000'],
      };

    case 'HeroChart':
      return {
        type: 'HeroChart',
        variant: variant || 'line-chart',
        headline: 'Data-driven growth',
        subheadline: 'See your metrics improve',
        ctaText: 'Get Started',
        ctaHref: '#',
        chartData: [
          { label: 'Jan', value: 100 },
          { label: 'Feb', value: 250 },
          { label: 'Mar', value: 400 },
          { label: 'Apr', value: 600 },
        ],
      };

    case 'ValueProps3':
      return {
        type: 'ValueProps3',
        variant: variant || 'cards',
        sectionTitle: 'Why Choose Us',
        items: [
          { icon: 'star', title: 'Quality', description: 'Best in class quality' },
          { icon: 'shield', title: 'Security', description: 'Enterprise-grade security' },
          { icon: 'zap', title: 'Speed', description: 'Lightning fast performance' },
        ],
      };

    case 'ServicesGrid':
      return {
        type: 'ServicesGrid',
        variant: variant || 'cards',
        sectionTitle: 'Our Services',
        services: [
          { title: 'Service 1', description: 'Description of service 1' },
          { title: 'Service 2', description: 'Description of service 2' },
          { title: 'Service 3', description: 'Description of service 3' },
        ],
      };

    case 'SocialProofRow':
      return {
        type: 'SocialProofRow',
        variant: variant || 'logo-bar',
        label: 'Trusted by',
        items: [
          { name: 'Company A' },
          { name: 'Company B' },
          { name: 'Company C' },
          { name: 'Company D' },
        ],
      };

    case 'TestimonialsCards':
      return {
        type: 'TestimonialsCards',
        variant: variant || 'cards',
        sectionTitle: 'What Our Clients Say',
        testimonials: [
          { quote: 'Exceptional service and results.', author: 'Jane Doe', role: 'CEO' },
          { quote: 'Transformed our workflow completely.', author: 'John Smith', role: 'CTO' },
        ],
      };

    case 'FAQAccordion':
      return {
        type: 'FAQAccordion',
        variant: variant || 'classic',
        sectionTitle: 'Frequently Asked Questions',
        items: [
          { question: 'How do I get started?', answer: 'Sign up for a free account to begin.' },
          { question: 'What support is available?', answer: 'We offer 24/7 email and chat support.' },
        ],
      };

    case 'CTASection':
      return {
        type: 'CTASection',
        variant: variant || 'gradient-bg',
        headline: 'Ready to get started?',
        subtext: 'Join thousands of satisfied customers',
        ctaText: 'Start Free Trial',
        ctaHref: '#',
      };

    case 'FooterSimple':
      return {
        type: 'FooterSimple',
        variant: variant || 'minimal',
        brandName: 'Brand',
        links: [
          { text: 'Privacy', href: '#' },
          { text: 'Terms', href: '#' },
        ],
        copyright: '2024 Brand. All rights reserved.',
      };

    case 'BentoGrid':
      return {
        type: 'BentoGrid',
        variant: variant || 'mixed',
        sectionTitle: 'Key Features',
        items: [
          { title: 'Feature 1', description: 'Description of feature 1', span: 'wide' },
          { title: 'Feature 2', description: 'Description of feature 2', span: 'normal' },
          { title: 'Feature 3', description: 'Description of feature 3', span: 'normal' },
        ],
      };

    case 'FeatureZigzag':
      return {
        type: 'FeatureZigzag',
        variant: variant || 'standard',
        sectionTitle: 'How It Works',
        items: [
          { title: 'Step 1', description: 'First step description' },
          { title: 'Step 2', description: 'Second step description' },
        ],
      };

    case 'StatsBand':
      return {
        type: 'StatsBand',
        variant: variant || 'accent',
        items: [
          { value: '500+', label: 'Clients' },
          { value: '99%', label: 'Satisfaction' },
          { value: '24/7', label: 'Support' },
        ],
      };

    case 'ProcessTimeline':
      return {
        type: 'ProcessTimeline',
        variant: variant || 'vertical',
        sectionTitle: 'Our Process',
        steps: [
          { title: 'Start', description: 'Begin the process' },
          { title: 'Execute', description: 'Carry out the plan' },
          { title: 'Deliver', description: 'See the results' },
        ],
      };

    case 'DataVizBand':
      return {
        type: 'DataVizBand',
        variant: variant || 'sparklines',
        items: [
          { label: 'Revenue', value: '+24%', trend: 'up' },
          { label: 'Users', value: '12.5K', trend: 'up' },
          { label: 'Uptime', value: '99.9%', trend: 'flat' },
        ],
      };

    case 'DataTable':
      return {
        type: 'DataTable',
        variant: variant || 'striped',
        sectionTitle: 'Performance Metrics',
        columns: ['Metric', 'Value', 'Change'],
        rows: [
          ['Response Time', '45ms', '-12%'],
          ['Throughput', '1.2K rps', '+18%'],
          ['Error Rate', '0.01%', '-5%'],
        ],
      };

    case 'ComparisonTable':
      return {
        type: 'ComparisonTable',
        variant: variant || 'vs',
        sectionTitle: 'How We Compare',
        columns: [{ name: 'Us', highlighted: true }, { name: 'Others' }],
        rows: [
          { feature: 'Speed', values: ['Fast', 'Slow'] },
          { feature: 'Support', values: ['24/7', 'Business hours'] },
          { feature: 'Price', values: ['Affordable', 'Expensive'] },
        ],
      };

    case 'SectionKicker':
      return {
        type: 'SectionKicker',
        variant: variant || 'label-line',
        label: 'Features',
      };

    default:
      return null;
  }
}
