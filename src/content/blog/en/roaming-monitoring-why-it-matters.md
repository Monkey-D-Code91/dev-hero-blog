---
title: "Roaming monitoring: why a software engineer should care"
description: "Roaming data traffic can generate enormous costs in very little time. I explain why this problem is more technical than it looks and what makes it interesting to solve."
pubDate: 2026-04-22
translationKey: "roaming-monitoring-why-it-matters"
tags: ["telecommunications", "architecture", "product"]
draft: false
---

When you hear "telecommunications monitoring", you probably think of something far removed from your everyday work as a software engineer. In reality it is a domain full of interesting technical problems — with an immediate and measurable economic impact.

## The problem: roaming costs explode silently

Companies with employees or connected devices abroad often face a nasty surprise: the phone bill. An IoT device sending data continuously, a corporate phone used heavily in a non-EU country, a fleet of vehicles crossing borders — all of these are scenarios where roaming data costs can grow exponentially before anyone notices.

The problem is not the individual transaction. It is the **volume over time**, multiplied by the number of users or devices. And the moment you notice is often already too late: the cost has already accrued.

## Why monitoring is technically hard

Building a system that detects these patterns in real time presents genuine challenges:

**Data latency.** Traffic events do not arrive from partner operators immediately. Delays can range from minutes to hours, sometimes days. A monitoring system must account for this uncertainty without generating false alarms or missing real events.

**Volume and variety.** We are not talking about a few records per day. We are talking about continuous streams of CDRs (Call Detail Records) from heterogeneous sources, with different formats, variable data quality, and identifiers that don't always map cleanly to the entities in your system.

**Dynamic thresholds.** A fixed alert ("notify me when you exceed X GB") doesn't work because normal behaviour varies by user, by period, by country. You need to model the expected behaviour in order to distinguish a real anomaly from a legitimate spike.

## What I learned building it

The telecommunications domain has its own terminology, its own regulations (roaming in Europe follows different rules from the rest of the world) and its own operational culture — all of which you need to absorb before you can design something useful.

But once you are inside, you discover that the fundamental problems are the same as always: handling uncertainty in data, building abstractions that hold up, designing interfaces that help people make better decisions. The domain changes; the principles remain.

This is what I find interesting about working on vertical products: it forces you out of your technical comfort zone and makes you genuinely understand the problem you are trying to solve.
