import ArticleCard, { ArticleCardProps } from './ArticleCard';

interface HeroGridProps {
  leadArticle: ArticleCardProps['article'];
  secondaryArticles: ArticleCardProps['article'][];
}

export default function HeroGrid({ leadArticle, secondaryArticles }: HeroGridProps) {
  if (!leadArticle) return null;

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Lead Story (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <ArticleCard article={leadArticle} layout="lead" />
        </div>

        {/* Supporting Front-Page Dispatches (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="border-b-2 border-gold-500 pb-2 mb-2 flex items-center justify-between">
            <h3 className="text-xs uppercase font-mono tracking-widest text-gray-900 dark:text-white font-bold">
              Latest Posts
            </h3>
            <span className="text-[10px] uppercase font-mono text-gold-600 dark:text-gold-400">
              Recent Stories
            </span>
          </div>

          <div className="flex-1 flex flex-col divide-y divide-gray-100 dark:divide-editorial-cardDarkBorder">
            {secondaryArticles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} layout="horizontal" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
