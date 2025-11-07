/**
 * Content Blocks Demo Page
 * Demonstrates all content block types with test data
 */

import ContentRenderer from '@/components/content/ContentRenderer';
import {
  accordionBlockTests,
  calloutBlockTests,
  chartBlockTests,
  tableBlockTests,
  tabsBlockTests,
} from '@/lib/content-test';

export default function ContentDemo() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Content Blocks Demo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Testing all content block implementations
          </p>
        </div>

        {/* Accordion Blocks Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b-2 border-emerald-500">
            Accordion Blocks (Story 3.7)
          </h2>
          <ContentRenderer blocks={accordionBlockTests} />
        </section>

        {/* Callout Blocks Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b-2 border-emerald-500">
            Callout Blocks (Story 3.5)
          </h2>
          <ContentRenderer blocks={calloutBlockTests} />
        </section>

        {/* Table Blocks Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b-2 border-emerald-500">
            Table Blocks (Story 3.6)
          </h2>
          <ContentRenderer blocks={tableBlockTests} />
        </section>

        {/* Tabs Blocks Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b-2 border-emerald-500">
            Tabs Blocks (Story 3.8)
          </h2>
          <ContentRenderer blocks={tabsBlockTests} />
        </section>

        {/* Chart Blocks Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b-2 border-emerald-500">
            Chart Blocks (Story 3.9)
          </h2>
          <ContentRenderer blocks={chartBlockTests} />
        </section>
      </div>
    </div>
  );
}
