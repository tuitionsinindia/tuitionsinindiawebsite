# Blog Post

Publish or edit a blog post on TuitionsInIndia.

## Publishing via Admin Dashboard
1. Log in with an ADMIN account at https://tuitionsinindia.com/login
2. Go to https://tuitionsinindia.com/dashboard/admin
3. Navigate to **Blog** → **New Post**
4. Fill in:
   - **Title** — sentence-case, under 70 characters, SEO-friendly
   - **Slug** — auto-generated from title (e.g., `how-to-find-a-maths-tutor`)
   - **Category** — e.g., Tips for Students, Tips for Tutors, News
   - **Body** — Markdown supported
   - **Meta description** — under 160 characters for SEO
   - **Published** — toggle on when ready
5. Click **Save**

## Writing guidelines
- Write for Indian students, parents, and tutors — simple English, no jargon
- Avoid: "leverage", "synergize", "cutting-edge", "state-of-the-art"
- Use: "find", "help", "improve", "get", "learn"
- Headings in sentence-case (not Title Case)
- Include 1-2 internal links to relevant search pages (`/search?subject=maths`)
- Target 600–1200 words for a good blog post

## Adding posts via code (if admin UI not available)

Create the MDX file:
```
app/blog/posts/your-post-slug.mdx
```

Front matter:
```yaml
---
title: "How to find the right maths tutor in India"
date: "2026-04-17"
category: "Tips for Students"
description: "Looking for a maths tutor? Here's how to choose the right one for your child."
published: true
---
```

Then write the body in Markdown below the front matter.

The blog list page (`app/blog/page.js`) reads all MDX files and renders them automatically.

## SEO checklist
- [ ] Title under 70 chars, includes target keyword
- [ ] Meta description under 160 chars
- [ ] At least one internal link
- [ ] At least one heading (H2)
- [ ] Published toggle is ON

$ARGUMENTS
