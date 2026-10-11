-- =====================================================================
-- EduWay · Seed: course details data
--
-- Fills, for the existing courses:
--   1. description        (the 20 courses from 02_more_courses had none)
--   2. learning_outcomes  ("What you'll learn")   — all 23 courses
--   3. requirements       (text list)             — all 23 courses
--   4. tags + course_tags                          — the 20 courses
--
-- Run AFTER migration 20261011000000_course_details_fields.sql.
-- Safe to run more than once.
-- =====================================================================

drop table if exists seed_details;
create temp table seed_details (
  slug              text primary key,
  description       text,
  learning_outcomes text[],
  requirements      text[],
  tags              text[]   -- tag slugs (created below if missing)
);

insert into seed_details values
  -- ---------- the 3 first courses (already have description + tags) ----------
  ('complete-web-development-bootcamp', null,
    array['Build responsive websites with HTML and CSS', 'Write modern JavaScript and work with the DOM', 'Create interactive UIs with React components and hooks', 'Deploy a portfolio project online'],
    array['A computer with internet access', 'No programming experience needed'],
    null),
  ('ui-ux-design-masterclass', null,
    array['Run user interviews and turn them into personas', 'Design wireframes and high-fidelity screens in Figma', 'Build interactive prototypes and test them with users', 'Apply visual design principles: spacing, color and typography'],
    array['A free Figma account', 'No design experience needed'],
    null),
  ('data-science-with-python', null,
    array['Write Python code for data analysis', 'Clean and transform datasets with Pandas', 'Visualize data to find insights', 'Train and evaluate your first machine learning model'],
    array['Basic computer skills', 'High-school level math'],
    null),

  -- ---------- Web Development ----------
  ('javascript-fundamentals',
    'Start your programming journey with JavaScript, the language of the web. You will learn the core concepts step by step and practice them by building small interactive projects in the browser.',
    array['Understand variables, data types and functions', 'Work with arrays, objects and loops', 'Select and update page elements with the DOM', 'Handle user events like clicks and form submits'],
    array['Basic HTML knowledge is helpful', 'A code editor like VS Code'],
    array['javascript', 'html']),
  ('advanced-react-nextjs-patterns',
    'Go beyond the basics and learn how professional teams structure React and Next.js applications. We cover server components, data fetching, caching, streaming and the patterns that keep large apps fast and maintainable.',
    array['Use Server and Client Components the right way', 'Fetch, cache and stream data in the App Router', 'Structure a large Next.js codebase by feature', 'Avoid common performance and hydration problems'],
    array['Solid React experience (components, props, hooks)', 'Basic TypeScript knowledge'],
    array['react', 'nextjs', 'typescript']),
  ('typescript-for-react-developers',
    'Add type safety to your React projects. Learn how to type components, props, hooks and API responses so you catch bugs before your users do.',
    array['Type React components and their props', 'Type useState, useReducer and custom hooks', 'Model API data with interfaces and unions', 'Use generics to write reusable typed code'],
    array['Basic React knowledge', 'JavaScript fundamentals'],
    array['typescript', 'react']),
  ('nodejs-express-rest-apis',
    'Build a complete REST API from scratch with Node.js and Express. You will connect it to PostgreSQL, add authentication and protect your routes like a real backend developer.',
    array['Design RESTful routes and status codes', 'Connect Express to a PostgreSQL database', 'Add authentication with JWT', 'Validate input and handle errors properly'],
    array['JavaScript fundamentals', 'Basic command line usage'],
    array['nodejs', 'javascript', 'sql']),
  ('html-css-crash-course',
    'The fastest way to build your first web page. In one weekend you will learn the building blocks of every website and finish with a responsive landing page.',
    array['Structure a page with semantic HTML', 'Style layouts with Flexbox and Grid', 'Make pages responsive for mobile', 'Publish your first landing page'],
    array['No experience needed', 'A computer with a web browser'],
    array['html', 'css']),

  -- ---------- Data Science & AI ----------
  ('machine-learning-fundamentals',
    'Understand how machine learning really works. You will train regression and classification models with scikit-learn and learn how to measure whether a model is actually good.',
    array['Explain supervised vs unsupervised learning', 'Train regression and classification models', 'Evaluate models with the right metrics', 'Avoid overfitting with validation and tuning'],
    array['Python basics', 'Basic statistics'],
    array['python', 'machine-learning']),
  ('sql-for-data-analysis',
    'SQL is the most requested skill for data analysts. Learn to query real datasets, combine tables and summarize data to answer business questions.',
    array['Write SELECT queries with filters and sorting', 'Combine tables with JOINs', 'Summarize data with GROUP BY and aggregates', 'Answer real business questions with SQL'],
    array['No experience needed'],
    array['sql']),
  ('deep-learning-with-pytorch',
    'Build neural networks from first principles with PyTorch. From simple networks to CNNs and transformers, you will understand what happens inside every layer.',
    array['Build and train neural networks in PyTorch', 'Use CNNs for image classification', 'Understand attention and transformers', 'Train models efficiently on a GPU'],
    array['Comfortable with Python', 'Machine learning fundamentals', 'Basic linear algebra'],
    array['python', 'machine-learning']),
  ('data-visualization-with-python',
    'Turn numbers into clear stories. Learn to build charts that explain your data with Matplotlib, Seaborn and interactive Plotly dashboards.',
    array['Choose the right chart for your data', 'Build charts with Matplotlib and Seaborn', 'Create interactive charts with Plotly', 'Design clean, readable visualizations'],
    array['Python basics'],
    array['python', 'pandas']),

  -- ---------- Design & Creative ----------
  ('figma-for-product-designers',
    'Master the tool used by product teams everywhere. Learn components, variants, auto layout and how to keep a design file organized as it grows.',
    array['Build responsive layouts with auto layout', 'Create components and variants', 'Organize files with styles and libraries', 'Hand off designs to developers'],
    array['A free Figma account'],
    array['figma']),
  ('design-systems-from-scratch',
    'Create a design system that scales across products and teams. You will define tokens, build components and document them so designers and developers speak the same language.',
    array['Define color, spacing and typography tokens', 'Build a consistent component library', 'Document components for designers and developers', 'Plan versioning and adoption across teams'],
    array['Figma experience', 'Basic UI design knowledge'],
    array['figma', 'ux-research']),
  ('ux-research-basics',
    'Learn how to understand your users before you design. This short course covers the research methods every designer and product person should know.',
    array['Plan and run user interviews', 'Create personas and user journeys', 'Run simple usability tests', 'Turn research into design decisions'],
    array['No experience needed'],
    array['ux-research']),
  ('mobile-app-ui-design',
    'Design mobile screens that feel native and easy to use. Learn iOS and Android patterns, navigation, gestures and how to design for small screens.',
    array['Apply iOS and Android design guidelines', 'Design navigation and common mobile screens', 'Design for touch, gestures and small screens', 'Prototype a complete mobile app flow'],
    array['Basic Figma knowledge'],
    array['figma']),

  -- ---------- Digital Marketing ----------
  ('seo-content-marketing',
    'Get found on Google and turn visitors into customers. Learn keyword research, on-page SEO and how to write content that ranks and converts.',
    array['Find keywords your customers search for', 'Optimize pages for search engines', 'Write content that ranks and converts', 'Measure results with Google Search Console'],
    array['No experience needed'],
    array['seo']),
  ('social-media-marketing-strategy',
    'Plan social media campaigns that actually grow a brand. From content calendars to analytics, learn to build a strategy for every major platform.',
    array['Build a social media content strategy', 'Create a content calendar', 'Run paid campaigns on social platforms', 'Measure and improve results with analytics'],
    array['No experience needed'],
    array['social-media']),
  ('google-ads-mastery',
    'Run profitable Google Ads campaigns. You will set up search, display and shopping campaigns, write ads that convert and optimize your budget.',
    array['Set up search, display and shopping campaigns', 'Write ads that get clicks', 'Track conversions correctly', 'Optimize bids and budget for profit'],
    array['A Google account', 'Basic marketing knowledge'],
    array['google-ads']),
  ('email-marketing-for-beginners',
    'Email is still the channel with the best return. Learn how to grow a mailing list and write emails that people open, read and click.',
    array['Grow an email list from zero', 'Write subject lines that get opened', 'Build simple automated email flows', 'Read open and click reports'],
    array['No experience needed'],
    array['email-marketing']),

  -- ---------- Business & Productivity ----------
  ('productivity-systems',
    'Take control of your time. Build a personal productivity system to plan your week, focus on what matters and stop procrastinating.',
    array['Plan your week and set priorities', 'Beat procrastination with simple habits', 'Protect time for deep work', 'Build a system you can keep using'],
    array['No experience needed'],
    array['productivity']),
  ('project-management-fundamentals',
    'Learn how to plan and deliver projects on time. This course covers scope, schedules, risks and the Agile and Scrum methods used by modern teams.',
    array['Define project scope and goals', 'Plan schedules and manage risks', 'Run projects with Agile and Scrum', 'Communicate progress to stakeholders'],
    array['No experience needed'],
    array['project-management', 'agile']),
  ('startup-finance-101',
    'Understand the numbers behind a startup. Learn budgeting, unit economics, financial forecasting and how fundraising really works.',
    array['Build a simple startup budget', 'Calculate unit economics and runway', 'Create a basic financial forecast', 'Understand how fundraising rounds work'],
    array['Basic spreadsheet skills'],
    array['finance', 'startups']);


-- 1. description: only where it is still empty (never overwrite a real one)
update public.courses c
set description = s.description
from seed_details s
where c.slug = s.slug
  and s.description is not null
  and c.description is null;

-- 2 + 3. learning outcomes + requirements: only where still empty
update public.courses c
set learning_outcomes = s.learning_outcomes
from seed_details s
where c.slug = s.slug and c.learning_outcomes = '{}';

update public.courses c
set requirements = s.requirements
from seed_details s
where c.slug = s.slug and c.requirements = '{}';


-- 4. tags: create the new ones, then link them to the courses
insert into public.tags (name, slug) values
  ('Next.js',            'nextjs'),
  ('TypeScript',         'typescript'),
  ('Node.js',            'nodejs'),
  ('SQL',                'sql'),
  ('SEO',                'seo'),
  ('Social Media',       'social-media'),
  ('Google Ads',         'google-ads'),
  ('Email Marketing',    'email-marketing'),
  ('Productivity',       'productivity'),
  ('Project Management', 'project-management'),
  ('Agile',              'agile'),
  ('Finance',            'finance'),
  ('Startups',           'startups')
on conflict (slug) do nothing;

insert into public.course_tags (course_id, tag_id)
select c.id, t.id
from seed_details s
cross join unnest(s.tags) as tag_slug
join public.courses c on c.slug = s.slug
join public.tags    t on t.slug = tag_slug
where s.tags is not null
on conflict do nothing;

drop table if exists seed_details;
