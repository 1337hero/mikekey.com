---
title: "ScaffoldBench: An Opinionated Local LLM Benchmark"
date: "2026-04-17"
description: "I got tired of hot takes about local models from people who don't run them. So I built a benchmark that tests what I actually do - surgical edits in real codebases, on my own hardware, graded deterministically."
heroImage: '../../assets/images/blog/scaffoldbench-hero.png'
---

Someone told me these models suck. Their experience wasn't mine. That confused me for a while.

How were people getting such different results from the same models? I'd run a local model on my rig and it would do exactly what I needed. Someone else would run the same model and call it garbage. Same weights, totally different outcomes.

It took me a while to figure out what was happening. The difference wasn't the model. It was the prompt. More specifically, it was the gap between what people asked for and what they actually needed.

## The prompting problem

People tell me local models can't write quality code. They can. Where they fall down is when they have to problem-solve for the code. If you hand a local model a tight spec - the kind a senior engineer would write, or the kind you get from a model like Opus - it does extremely well. Clean implementation, follows patterns, lands the change.

But ask it to figure out what to build AND build it? That's where small models choke. I think I know why. SOTA models with massive parameter counts can do more thinking in the forward pass. They hold more context, reason through more steps. A local model runs out of VRAM. Context bloats. The model loses the thread.

So the real question isn't "is this model smart enough." It's "what does this model need from me to produce senior-level work?" Nobody was answering that.

## Why the benchmarks didn't help

I don't care if a model is PhD smart. I don't care if it can solve competitive Python problems. I want to know: can it write a proper React component? Can it do auth properly? Can it follow conventions in a codebase it's never seen? How well does it handle my actual day-to-day work - inherited client codebases, small inline refactors, surgical edits inside existing code?

That's not what most benchmarks test.

SWE-bench scores against a repo's Python test suite. Make the failing tests pass and you win. But Berkeley researchers found models copying answers from git history in 24% of trajectories. OpenAI dropped SWE-bench Verified after finding flawed tests in 59% of audited problems. A green test says nothing about what happened around it - a model can bulldoze surrounding code, hard-code the expected value, and score identically to one that landed a clean patch.

Vibe Code Bench is more recent. Models build complete web apps from scratch, graded by a browser agent. Better. But it's greenfield work, run on frontier models, graded by an LLM. Day-to-day engineering is mostly the other thing: surgical changes inside code that already exists, where the cost of a wrong edit is borne by whoever reviews the PR.

Nobody was testing what I actually do. Brownfield surgical work, on local models, graded on how the change landed - not just whether a test went green.

## The real motivation: money

Let me show you something. Here's what I've spent on cloud AI:

- Claude Max subscription: $2,688 (23 months, ramped from $20/mo to $200/mo)
- Anthropic API credits: $536
- ChatGPT subscription: $900 (37 months, Plus then Pro)
- OpenAI API: $396
- OpenRouter API: $146 (465 million tokens in 2026 alone)

That's $4,667. My GPU setup - 3x AMD AI Pro R9700s, 96GB VRAM - cost $3,998. I've spent more on cloud AI than the cards themselves. And the prices only go up. They never stay the same.

Here's the part nobody talks about: the hardware holds value. I started with two used RX 7900 XTX's off eBay - $720 and $760, 48GB VRAM. When I upgraded to the R9700s, I resold those cards and put that money toward the new ones. Try reselling used API credits. You can't. Once that money is spent, it's gone. Hardware is more like a car - it depreciates, but you can always recoup something if you sell while it still has value left. Cloud credits depreciate to zero the second you use them.

People say "just get a plan." I've been on plans. The plans are the problem. I canceled my OpenAI subscription, then signed back up. Same story with a few of these. You cancel, you feel the gap, you come back. The hook is real.

The real goal of ScaffoldBench wasn't academic. I wanted to know which local models I could actually use for my day-to-day work - to offload real engineering and stop bleeding money on API access. Every task I can push to a local model is money back in my pocket. But I needed to know which ones could actually do the work, not which ones scored well on a benchmark that tests something I don't do.

## Getting torn apart on Reddit

An earlier version of this benchmark - I posted it on Reddit and people tore me apart. Legitimately. Problems with the testing methodology, the task design, the grading. It was bad enough that I deleted the post.

But the criticism was right. It made me stop and ask: what does a proper test even look like? How should the tests be conducted? What am I actually measuring, and am I measuring it in a way that holds up?

That's when the design started getting serious. Not because I wanted to impress Reddit. Because the criticism exposed something real - if your benchmark can be picked apart by a few smart commenters in an hour, it's not measuring what you think it's measuring. So I went back to the drawing board. The result was deterministic grading, separate solve and discipline scores, and tasks designed around real engineering work instead of toy problems.

Wish I hadn't deleted the post though. Can't find those comments now, and some of that criticism was probably still useful.

## Small models, matched right

Here's something that surprised me. Devstral - a 24B parameter model from Mistral and All Hands AI, trained specifically for surgical code edits - does really well when you use it the way it was trained. Lightweight, works well in older codebases, applies patches cleanly.

And what surprised me more: the LocalLLM community on Reddit insists it's garbage.

That's when it clicked. There's something else going on. People use smaller models the same way they'd talk to Claude or Opus - assuming the same kind of thinking, the same kind of behavior. They give a 24B model a vague prompt, it produces a worse result than a 200B model, and they conclude the 24B is trash. But that's not what happened. You asked a scalpel to be a hammer.

This is a big part of why I built the benchmark. Devstral isn't garbage. It's a specialized tool. If you give it a surgical edit task with a tight spec, it punches way above its weight class. If you ask it to architect your system from a one-line prompt, it falls on its face. Same model, different inputs, completely different conclusion.

The benchmark that would catch this is one that tests models on the tasks they're built for, with the kind of guidance a real engineer would provide. That's what ScaffoldBench does.

## What I built

ScaffoldBench: fifty tasks in real codebases, five tools, twenty turns, on your own hardware. Deterministic grading - no LLM judge, no evaluator variance. The same transcript always produces the same score. Solve % and Discipline % tracked separately, because a model that bulldozes code to pass a test hasn't done the same work as one that lands a clean patch.

The full methodology is on [scaffoldbenchmark.com/why](https://scaffoldbenchmark.com/why).

## What the data said

One thing that surprised me: the self-testing hypothesis didn't hold up. Vibe Code Bench found that models who tested their apps in the browser scored higher, correlation of r=0.72. I tested that with 2,511 runs across 10 local models. It doesn't replicate. Raw self-testing volume vs solve rate gave r=+0.13. The top solver tests less than average.

My read: in greenfield work, there's no source of truth except your own tests. In brownfield work, the codebase is the source of truth. Careful reading beats repeated re-running. Different problems reward different behaviors. That's itself an argument for benchmarking them separately.

## Where this goes

The real experiment is the prompt tier test. Take the same tasks, write each prompt at three levels: a one-line vibe prompt, a decent PRD, and a fully engineered spec with constraints and acceptance criteria. Run every tier across the model ladder and look at the interaction.

If spec quality substitutes for parameters, a well-briefed 30B model catches an under-briefed frontier model. If it doesn't, the gap that remains marks where genuine model capability starts and prompt engineering stops. My prior: guidance buys correctness but not judgment. Either result would be worth knowing.

Nobody has measured that. Every benchmark I've seen either freezes the prompt or inherits whatever the original issue said. Varying input quality deliberately, at constant task difficulty - that's the experiment this benchmark was built to run.

The leaderboard is live at [scaffoldbenchmark.com](https://scaffoldbenchmark.com). I write about this stuff on X [@1337hero](https://x.com/1337hero).
