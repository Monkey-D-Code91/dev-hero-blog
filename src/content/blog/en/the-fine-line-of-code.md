---
title: "The Fine Line of Code"
description: "A migrated module, all tests green, and at the end of the month the notifications stop renewing. Where the line runs between generated code under control and out of control, and how to keep your balance on it."
pubDate: 2026-07-24
translationKey: "the-fine-line-of-code"
authors: ["marco-mariotti"]
tags: ["ai", "generated-code", "software-engineering", "critical-thinking"]
cover: "../../../assets/covers/the-fine-line-of-code.png"
coverAlt: "The First Draft cover: three overlapping circles (tech, human and AI) meeting at a bright point, with the title 'The Fine Line of Code' underlined by hand like a proofreading mark."
draft: true
---

We had built a new module: a system of notifications and automated actions triggered when certain thresholds are reached. The most complex part we generated from scratch, starting from the Product Owner's specs, refined in brainstorming, turned into documentation and stories, implemented with the help of AI and covered by automated and QA tests. All green.

What was left seemed trivial: bringing into the new module a part that had already existed for years in an old module. We didn't want to move the existing tables, to avoid redoing the reporting and the automated actions tied to the thresholds. We just had to hook the old notifications to the new groups table instead of the old one.

That code was very old and undocumented, so I asked the AI to analyze it, explained the result I wanted, and had it generate a plan to get there. I reviewed it: clear, direct, nothing suspicious. I implemented it, tested it locally, and BAM, it worked. Off to the test environment, free as the air, happy to have saved hours of work.

Then, during what was turning into a long testing phase, the first end-of-month expiry arrived. The notifications expired and did not renew. We had not seen it coming.

The old module didn't just evaluate the thresholds: it was also in charge of renewing the notifications at expiry. That, during analysis, had slipped through. The renewal function kept looking for the expired notifications in the old groups table, the one we had stopped populating. It found nothing. It renewed nothing. We caught it and fixed it right there, in testing, before the production release. And the AI had done exactly what I had asked: the gap wasn't in its answer, it was in my question.

For a long time I believed that controlling generated code meant reading it. Opening the diff, scanning the lines, checking that they did what they claimed. But that code, I had read it. The plan, I had reviewed line by line. It was clear, it was correct, and it did exactly what it said. The problem is that it did exactly what it said, and nothing more. If we now read more than we write, this is the other side of reading: the one where mistaking understanding a piece of code for controlling it costs you dearly.

Reading code tells you what it does. It doesn't tell you what it is responsible for. And the difference between the two is the fine line.

A piece of code is under your control when you can answer not only "what does this line do", but "what happens if I remove it", "who else depends on this", "what was the thing I am replacing actually in charge of". When you could rewrite it from scratch even without the AI, and you take responsibility for how it will behave in production six months from now, once you have forgotten the details. Out of control is the opposite: it is when you accept something that looks right and responsibility evaporates in the very act of accepting it.

The AI does not move this line. It only makes it easier to cross without noticing, because it produces code that already looks controlled: clean, coherent, plausible. The old copy and paste from Stack Overflow at least had a foreign air, it forced you to adapt it to make it fit. Generated code arrives already dressed like yours. It looks like yours before it is.

If generated code looks like mine before it is, how do I notice I am crossing the line? The signals are there. The problem is that, while you cross it, they all look like good news. In hindsight, that day they were there, plainly visible. In the moment I read them as confirmations.

The first was the plan itself. It was clear, linear, it covered all the cases I had specified. I expected to see certain things and I saw them all, and that reassured me. But I was checking that the AI had done well what I had asked, not that I had asked for everything necessary. I was verifying the answer, not the question. Who watches the watcher, when the watcher is my own expectations?

The second was the absence of friction. Minutes passed between reviewing the plan and implementing it. Not a doubt, not a "let me check this more carefully". When a delicate operation, moving something that has been running in production for years, meets no resistance, the absence of resistance is itself the signal. Code that is out of control does not brake: that is exactly why it is out of control.

The third was the enthusiasm. I was happy to be saving hours, because I wanted to get to something I cared about: a skill that automatically generates documentation and context for the AI from the code, to cover, piece by piece, the undocumented parts of the project. Here is the irony I missed in the moment. I was rushing past a documentation gap to go build the very tool that closes those gaps. The hurry to cure the problem in general made me ignore its concrete instance, right there, under my hands. That push forward, toward the reward, is exactly what takes attention away from the present. It was not skill I lacked to notice: what I lacked, in that moment, was the friction that skill usually carries with it. It is competence itself, when it stops doubting, that makes you go fast precisely where you should slow down.

Underneath all this there was a background condition that made the three signals more dangerous: we had no documentation for the old module. It is a normal problem, and in fact I use AI precisely to document what no one still has in their head. But that day it meant one specific thing: I was asking a machine to explain to me code that, on the team, no one was the keeper of anymore. There was no human truth to lean on. Only my question, and its answer.

The three signals share a common root: they all point away from the code and toward me. My expectations, my hurry, my enthusiasm. That is why they are hard to see: the source of the noise is me. And if the danger is me, the rules I drew from that day serve one purpose only: to put friction back where competence removes it. They are not a checklist, they are four ways of looking.

The first. A feature is a mathematical object: it has a domain, and that domain has precise boundaries. My mistake was not reading the code badly, it was settling for a part of the domain. Notifications do not just fire when a threshold is crossed: they are born, they get evaluated, they expire, they renew. Renewal was a point in that domain, and I had mapped everything except that point. It is there, in the discontinuity I had not explored, that I fell in with both feet. The countermeasure is not to read more, it is to ask first: what is the complete domain of this thing, all its states and all its events, not just the path I have in mind? It is the same difference as between checking the answer and checking the question. If I ask the AI for a plan for the path I imagine, I will get a perfect plan for an incomplete domain.

The second. Analyze the feature as if it were an unknown object, even when it looks familiar. It is the direct defense against the confidence trap. Generated code arrives dressed like mine, and precisely for that reason it has to be treated as a stranger until I have verified that it has truly become mine. Making strange again what looks obvious is an act of discipline, not of distrust: it is the way to put back the beginner's eye without giving up the senior's craft.

The third. Undocumented code is no man's land, and in no man's land common sense is not enough. Where there is no longer any keeper, the conventions you take for granted may not hold: that old module renewed itself, an implicit rule no document stated and no one remembered. In no man's land you do not deduce, you verify.

The fourth. When you change the domain, the tests have to change with it, or they will keep certifying the world from before. Renewal, I knew about. What I had not connected is that it leaned on the old groups table, the one I had stopped using. And the automated tests did not reveal it for an almost mocking reason: they themselves, during setup, still populated that old table. So renewal, under test, always found its data and passed. In the test environment, where no one filled that table anymore, the first end-of-month renewal found nothing. The illusion of the green tests lasted until that first expiry. The green was not a confirmation: it was the echo of a world I had just switched off. If you change the domain and the tests stay identical, that green light should be looked at with suspicion, not relief.

Back to the uncomfortable question: the AI analyzed, documented, planned and generated, and it did all of it well. The failure is still mine. It is not a contradiction, it is the exact shape of our relationship. The machine and I answer for different things.

The AI has, by its nature, a narrow focus. It is extraordinary inside the context you give it, blind outside of it. It does brilliantly what you frame for it and knows nothing of what you have not framed. Renewal did not slip past the AI: it slipped past the context I handed it. That is why the work that stays human is not writing the code, it is building the context: defining the functional domain, giving it boundaries, building the tools to navigate it. Less time on the fingers, more responsibility on the head.

It is a shift that already existed before AI. For a good engineer, design and domain definition were maybe seventy percent of the work, and the code the rest. AI compresses exactly that rest. The proportion tilts further, and it brings me to a question I would not have dared to ask a year ago: if the machine writes the code, does domain definition not risk becoming, one day, not seventy percent of the work, but *the* work?

And here is the uncomfortable thing to say. AI was introduced to remove friction, and that is exactly what it does. But friction was also what kept me awake. By removing it, it did not just help me: it changed the kind of error I make. It is not a neutral tool that leaves the engineer identical to before, only faster. It makes me faster and smoother, and smoothness is precisely what makes you fall.

That is why AI must not become the excuse to delegate complexity. It has to become the second pair of eyes on contexts that will keep getting wider, and it has to be used against the grain of instinct: not to confirm, but to doubt, to question everything that looks trivial. Because this, in the end, is the lesson of that day. The work looked trivial. And if something looks trivial, often it is not: it is just poorly defined. Triviality was the symptom, not the reality.

What the AI will not be able to take on in my place is exactly this: the critical eye toward code that might not be aligned with its purpose. The machine can verify that the code does what it says. Only I can doubt that what it says is what is needed.

I have no illusion that the line will get easier. On the contrary: the more AI removes friction, the more slippery the line becomes, and this story is only the first of many times I will lose my balance. And that is fine. It is not a flaw to eliminate, it is the condition of the craft now.

Walking a fine line is not an emergency, it is the normal state. The point is not to never wobble. It is to develop, with every great change, an even greater awareness: it is the only thing that can grow as fast as the slipperiness. This time I crossed the line without noticing. Next time I will feel it under my feet.

And one day, from crossing it over and over, we will be perfect tightrope walkers.

---

*The opinions and experiences shared in this article are my own and do not represent official positions of my employer. The cases described are intentionally generic and anonymized, for educational purposes.*
