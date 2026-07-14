---
title: "In the AI Era, We Read More Than We Write"
description: "A two-line story lands in review as fifty changed files. AI made writing almost free, so the real craft now is reading and judging: fifteen minutes of work, four hours of review."
pubDate: 2026-07-14
translationKey: "we-read-more-than-we-write"
authors: ["marco-mariotti"]
tags: ["ai", "code-review", "generated-code", "software-engineering"]
cover: "../../../assets/covers/we-read-more-than-we-write.png"
coverAlt: "The First Draft cover: three overlapping circles (tech, human and AI) meeting at a bright point, with the title 'In the AI Era, We Read More Than We Write' underlined by hand like a proofreading mark."
draft: false
---

There was a simple story: swap the payload of two endpoints, that is, make two services exchange the data they receive. Two lines of description, half a day of work if it ran long. I open the pull request for review and find fifty changed files. What is going on?

The first job wasn't reading the code. It was figuring out why a two-line story had exploded into fifty files.

The story was one line: swap A with B. In the pull request, that line was there. Around it a whole slice of the system had formed: a new validation endpoint nobody had asked for, and behind it its types, its errors, its translations, its wiring to the page. A "while I'm at it" had become a dozen files. Further along, a refactor that made the calls cleaner had opened another one: by changing the way data was sent, certain mandatory fields could now be missing, and new code was needed to handle them. Nobody had asked for it, and that refactor had manufactured a brand new problem for itself to solve.

None of this is laziness, and the colleague is anything but incompetent: he's good, he just got carried away. It's the rational response to a cost that has collapsed. When adding something cost half an hour, you asked yourself "is it worth it?" on your own. When it costs the time it takes to write a sentence to the AI, that question stops firing, and every "while I'm at it" seems justified. Under the economics there's something more human: the urge to do, to be fast and productive in front of everyone, which at almost zero cost no longer meets any check. And it's exactly that drive, good in itself, that sometimes makes us lose sight of what really matters.

The friction the colleague didn't meet while writing hasn't disappeared. It has only changed rooms. Every file he added without asking himself, I had to ask myself in review: is it needed? does it belong to the story? what does it break? Doing what the story actually asked for was fifteen minutes of work. Reviewing that pull request cost me four hours. Not four hours writing: reading, reconstructing, deciding what was story and what was noise.

This is where you see the truth behind a phrase that sounds like a slogan: today we read more than we write. Not because reading has become a noble act. Because writing has become free, and what is free to produce is expensive to verify. The work hasn't shrunk, and it hasn't even just moved from the fingers to the eyes: it has multiplied along the way. Fifteen minutes on one side, four hours on the other.

Reading, now, resembles the work of the medieval scribe: to read, to catalog, and to hand down the meaning of a text so it isn't lost or misread. With a twist. The scribe was slow because he copied by hand, and that slowness was fidelity. Today the machine writes in a flash, and slowness has moved back to where you need to understand, not where you need to produce. My job wasn't to recopy that code: it was to find, under fifty files, what the text actually was, and to save its meaning.

In practice that means separating what is intentional from what merely happened: the story that was wanted on one side, the buildup of enthusiasm on the other. And it means weighing the hidden risk. Those five hundred extra lines are not neutral: they're five hundred lines nobody asked for, and any of them can break, each a small exposure to a bug the story never anticipated. Reading is no longer asking whether a line does what it says, because the linter, the tests, the AI itself verify that. It's asking which lines carry an intention and which carry an accident, and how much the accident costs us.

And the accident, here, had a bill. Not just time: a real delay against what the story had been estimated at, and something quieter, a bit of control over the code slipping away, five hundred lines entering a new module without anyone having truly wanted them. How much all of this weighs when it repeats and piles up is another story. For now the first one is enough: reading has gone back to being the slow work, and the slow work has gone back to being the craft.

The tests were there, and they passed. But they covered the easy part, the comfortable one, and left out several changes and some new parts entirely. The green, here, is a subtle lie: it doesn't certify a wrong world, it stays silent about what it never looked at. It covers the comfortable subset, and about everything else it says nothing. And a partial green, on the screen, reads exactly like a full green.

Under that green there was no map. No list of what should be tested and how: just a wall of code held together by promises, promises that if they crumble can bring everything down. Those promises were the implicit assumptions that the untested parts worked. What was missing was the thing that mattered more than any test: the declaration of what that code actually touched.

Because a test list is first of all the declaration of a domain. Whoever writes it says: here's what I touched, here are the boundaries of what changes, here's how you verify it. Without that boundary I, in review, cannot check coverage against intent, because intent was never written down anywhere.

The responsibility, here, is shared, but it has an order. First it belongs to whoever develops: to identify the domain, make it explicit, give indications of it, so that whoever reviews and whoever does QA can verify and test it properly. Then it belongs to whoever reviews: to check that the declared domain really is the domain, and that there are no cracks or distortions. The first responsibility draws the map, the second compares it against the territory.

So the review stopped being the last check before the merge and became something else: the point where I put back the friction the AI had removed. I didn't fix commas. I cataloged the changes to know what touched what. I called the colleague, not to scold him but to have him help me flag the risky areas, because that code was in his head. And I reorganized that single block into separate stories, each with its own domain, each testable one at a time.

What I did, in the end, was give development back the friction that generation had spared it: putting back the brake of "does this belong to the story? what risk does this carry? how is this tested?", one question at a time.

And this is what really changed. Friction, before, was a property of the medium: writing cost something, and because it cost, you limited yourself on your own, line by line. Now writing costs nothing, and that brake is no longer in the medium. If we want it, it has to become someone's job. The reviewer is no longer the one who takes the last look: they are the person who puts back, by hand, the friction the machine has removed. Code review is no longer an end of line check, it's the place where scope gets redefined.

One honest thing remains to be said: putting friction back downstream, in review, costs more than having it upstream. My four hours against the fifteen minutes of a piece of work kept within its bounds. The reviewer as friction is a patch, not the ideal state. The real remedy is to bring friction back where it belongs, into whoever writes: declaring the domain, staying inside the story, limiting oneself. But for it to come back there, a tool isn't enough, you need a way of working. And that is taught.

Reading and judging, now, are our guardrails. At best they accompany us along the road, at the edge of our field of vision, and we barely notice them. At worst, they save us from a bad crash. But our responsibility is to act on the driver. Because acting on the driver means one thing only: that judging stops being the craft of whoever reviews downstream, and becomes the way anyone writes, from the very first line. Guardrails will always be needed, and they must be kept solid. The point is to make the choices of whoever is driving reduce to the minimum the times they have to kick in.

---

*The opinions and experiences shared in this article are my own and do not represent official positions of my employer. The cases described are intentionally generic and anonymized, for educational purposes.*
