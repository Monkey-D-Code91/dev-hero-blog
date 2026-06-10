---
title: "Why Most Teams Do Code Review the Wrong Way"
description: "How engineering teams get code review wrong, and three concrete practices to do it right."
pubDate: 2026-06-09
translationKey: "code-review-the-wrong-way"
authors: ["marco-mariotti"]
tags: ["code-review", "engineering", "team", "code quality", "collaboration"]
draft: false
---

Code review is a practice that nearly every team claims to follow — but very few actually do well. The result: reviews that miss the real bugs, friction between teammates, and PRs left open for days with no feedback.

I've seen this pattern repeat itself across every team I've worked on. It's not a competence issue — these are often skilled engineers. It's a question of how you think about the review in the first place.

## The Automatic "LGTM" Problem

The most common pattern: you open the PR, skim through the diff, leave a comment on something minor like a poorly named variable, and approve. Done.

That's not a review. It's a signature on a document you haven't read.

A useful review takes time and focus. You need to understand what the code is trying to do, not just what it does. That means reading the ticket, understanding the context, and testing locally when it matters.

## Feedback That Divides Instead of Builds

The second recurring problem is personal feedback instead of technical feedback. "This code is terrible" helps nobody. "This approach is O(n²) — using a map here brings it down to O(n)" is precise and isn't a personal attack.

The distinction seems obvious, but in practice many teams never get there. Written tone is inherently ambiguous, people feel judged, and over time the team stops giving honest reviews to avoid conflict.

## How to Do Reviews That Actually Work

**First: give context in the PR.** A good PR description works like a good commit message — it explains the why, not just the what.

**Second: separate blocking comments from optional ones.** "This must change before merge" is different from "this would be worth addressing someday." The distinction makes prioritization straightforward.

**Third: respond within 24 hours.** PRs left open for days create blockers, frustration, and merge conflicts. If you can't complete a full review, a comment saying when you will is already a valuable contribution.
