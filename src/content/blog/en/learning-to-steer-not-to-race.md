---
title: "Learning to Steer, Not to Race"
description: "A pull request full of code that works but nobody understood, where a simple ref would have done. AI hands you speed, but speed without direction drags you around: growing isn't producing more code, it's getting to the core of problems."
pubDate: 2026-07-24
translationKey: "learning-to-steer-not-to-race"
focus: ["human", "ai"]
authors: ["marco-mariotti"]
tags: ["ai", "generated-code", "professional-growth", "mentoring"]
cover: "../../../assets/covers/learning-to-steer-not-to-race.png"
coverAlt: "The First Draft cover: three overlapping circles (tech, human and AI) meeting at a bright point, with the title 'Learning to Steer, Not to Race' underlined by hand like a proofreading mark."
draft: false
---

There's one thing that, since AI entered my daily work, I find harder to hold back: the urge to do more. The extra feature nobody asked for, the refactor we've been putting off for months and that "while I'm at it" I could fix now, the piece of architecture I could make more elegant. It isn't laziness, it's the opposite: it's the urge to build, to leave things better than I found them. A good drive, and that's exactly why it's hard to govern: I don't want to switch it off, I want to give it a direction.

The risk, for me, isn't writing bad code. It's working without structure: chasing every good idea the instant it comes to me, opening three fronts while I was closing one, and ending the day faster but without having actually decided where I was going. That's how you waste the very momentum the AI had given you.

The image that comes to mind is a dog sled. Five dogs in formation carry you to your destination at a speed you couldn't dream of on foot. The problem is never the dogs: they're strong, fast, eager to run. The problem is if nobody, behind, decides where to go. Then each one pulls where it wants, and all that power takes you nowhere: it drags you around. The speed is there, the direction isn't.

AI has hitched five dogs to my sled. I don't have to slow them down, and I don't want to: that would waste them. The problem, now, is no longer running. It's deciding where, and keeping every nose pointed there.

And if I feel the pull, with a few years of the craft behind me, in younger colleagues I see something more insidious.

In a review, a while back, I find myself facing a lot of new code for a component. A hydration pattern had been introduced, handled as follows: on every update, the child component handed its data back to the parent through a callback, and the parent rehydrated it. It worked. It stood up. And it was completely useless: to get the same result, all you had to do was pass a simple ref from parent to child and use that. Three lines instead of a pattern.

Why so much code for such a small problem? Because the solution had been proposed by the AI, and proposed well: coherent, plausible, working. The colleague had tried it, it ran, the tests were green. What he hadn't done was stop to ask what the simplest thing that solved the problem was. Had he done that, the ref would have surfaced on its own. But the machine had already given him a complete answer, and a complete answer kills the urge to look for a simpler one. It had been accepted because it looked right, not because it had been understood.

I called him. I asked him two things: to explain the pattern to me, and then to explain why he had chosen it. On the first question he was ready, he could tell the pattern well. On the second he stopped. It turned out he hadn't chosen it: the AI had proposed it, and he had taken it. "It works, fine," I told him, "but here it's useless. With a ref we drop about twenty lines across five components, and we no longer have to touch all five every time something upstream changes. Less code to read, less to maintain." It wasn't a style fix. It was going back, together, to the core of the problem that the complete answer had covered.

This is where I notice that the very way people grow is changing. The colleague wasn't incompetent: he had stopped at the surface. And stopping at the surface, today, seems to cost nothing. The AI gives you an answer that works, you take it, you move on. But every time I hand the machine not the writing, which is fine, but the understanding, I lose a piece of ownership over the code that carries my name.

And lost understanding doesn't come back on its own. A component I don't grasp fully calls another one I don't grasp, which in turn calls another. Boxes inside boxes, a matryoshka of black boxes. As long as everything works nobody opens it, and it even looks like an advantage: look how fast we're going. The bill comes later, all at once. The day something breaks you find that nobody, along the whole chain, knows what's inside anymore: not the colleague who accepted it, not me who let it through, not the machine, which doesn't know it answered. And you don't get out of that with another question to the AI: you get out only by going back to understand, that is, by redoing all at once and under pressure the work you had skipped a piece at a time.

Faced with this, I changed what I ask, especially of the younger ones. Before, the measure was the code: how much you produce, how fast. Now the measure is the problem: how deeply you understand it. The question I've learned to ask isn't "what does this code do?", the machine already answers that, but "why this, and not something simpler?". It's the same one I'd asked the colleague on the phone, just moved earlier: not in review, when the code is already there, but while it's still being thought.

In concrete terms, this means not starting from the code. I ask a junior to start from the analysis: to note down all the parts involved, to identify the domain the story touches, to draw a flow, and only then to start writing. It looks much slower, and it probably is. But it's the only way you truly learn, and it's what will let them, one day, handle far more complex stories without drowning in a glass of water. The slowness of the analysis isn't wasted time: it's the map that will keep them from going in circles later.

What I try to teach is simple to say and hard to do: our craft isn't avoiding complexity, it's living with it. Accepting it, first of all. Then knowing it, going deep: the why of a thing, the how, the purpose it actually serves. And finally managing it. Getting to the core of a problem means knowing it, and knowing it is the only way to solve it instead of circling around it. That ref in place of the hydration pattern wasn't a shortcut: it was the core of the problem, and only someone who had reached the core could see it.

Back to the sled. The dogs are the power, and AI hitches up five of them. But the sled needs someone standing behind it to decide the direction, and that someone doesn't run: they design. They look at the map, choose the route, keep the dogs aligned. Growing, in the era of generated code, doesn't mean learning to run harder. The dogs already run. It means learning to steer.

Because speed, in the end, isn't the point of AI. It's the byproduct of good design and good planning. It comes on its own, once you've understood where you're going.

---

*The opinions and experiences shared in this article are my own and do not represent official positions of my employer. The cases described are intentionally generic and anonymized, for educational purposes.*
