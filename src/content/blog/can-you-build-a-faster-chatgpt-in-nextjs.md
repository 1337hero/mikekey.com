---
title: "Can You Build a Faster ChatGPT in Next.js? Answer: Yes."
date: "2025-11-20"
description: "How frustration with Open WebUI and a T3 Chat speed challenge turned into FasterChat, a self-hostable AI chat app with 150+ stars on GitHub."
heroImage: '../../assets/images/blog/blog-placeholder-1.jpg'
---

Theo Browne made a video about building T3 Chat in 5 days. It's 29 minutes long and it got 137K views. I watched it and had a question: *can you build an AI chat interface faster than ChatGPT with Next.js?*

Yeah. You can. But that question turned into something else entirely.

<iframe width="100%" height="400" src="https://www.youtube.com/embed/QLvIoi2s1zY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The T3 Chat Challenge

Theo (of T3.gg) built T3 Chat. Ridiculously fast AI chat interface. When he launched it, I wanted to know *how* he got it so fast. So I started poking at the client-side code.

It wasn't magic. The big win was markdown chunking - split the markdown by block, memoize each block, and only re-render the block that gets new text. Most of the other stuff was React performance fundamentals and a local-first approach using IndexedDB. That's it.

![Tweet from Jan 17, 2025: "Really surprised more haven't figured out how T3 chat is so fast. Once you understand it. It's pretty basic performance stuff."](/blog/tweet-jan17-t3-chat-speed.png)

I'm a 9th grade dropout who's been shipping production code for 20 years. When I see something interesting, I don't just admire it. I try to build it. So I did.

The original README literally said: *this is a clone of T3 Chat to figure out the streaming aspect.* No shame. Theo put something cool into the world and I wanted to understand it. That's how learning works.

## The Streaming Breakthrough

First commit was January 17, 2025. Six days later, I had the streaming figured out.

The key insight was what I'd call "local-first." Conversations stored in IndexedDB, not waiting on a server round-trip to render. You click between chats, the switch is instant because the data is already on your device. The streaming uses chunked transfer encoding with compressed payloads. Theo got his response time down to 20ms with average payloads around 15 bytes. I wasn't that aggressive, but the principle was the same: get bytes to the screen as fast as possible.

After the streaming breakthrough on January 23rd, I had a working chat interface that was genuinely fast. Open-sourced it. Shared it on Reddit under my old username, alphatrad. People started watching. Someone named Gino (onigetoc on GitHub) found it and started contributing - added Groq models, DeepSeek, and Qwen support in February.

![Tweet from Jan 23, 2025: "Can you build a AI Chat interface that is faster than ChatGPT with Next JS? Answer: YES"](/blog/tweet-jan23-fasterchat-launch.png)

<blockquote class="twitter-tweet" data-dnt="true"><p lang="en" dir="ltr">Can you build a AI Chat interface that is faster than ChatGPT with Next JS? <br><br>Answer: YES<br><br><a href="https://t.co/NUDFqlwJOF">https://t.co/NUDFqlwJOF</a> <a href="https://t.co/cWwaZdLin8">pic.twitter.com/cWwaZdLin8</a></p>&mdash; Mike Key (@1337hero) <a href="https://twitter.com/1337hero/status/1882551882016751821?ref_src=twsrc%5Etfw">January 23, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Then I stopped. I'd figured out the puzzle I wanted to solve. The repo sat there for months.

## The Real Problem: Open WebUI Isn't Very Open

Here's what happened while the repo sat dormant. I was running local LLMs on my rig and using Open WebUI as my chat interface. And I kept getting frustrated.

Open WebUI bills itself as open source, but it's not very open. It's complex, bloated, and difficult to use with anything other than Ollama and ChatGPT. Those are the only two defaults. You want Anthropic, or Groq, or xAI, or any of the other providers that exist? You're fighting the tool instead of using it. I had to build my own wrapper just to get Anthropic working - a "pipe" that proxies the API calls ([github.com/1337hero/open-webui-anthropic-api-pipe](https://github.com/1337hero/open-webui-anthropic-api-pipe)). Annoying that pipes have to be made for every integration. The "open" in the name feels like a marketing label, not a philosophy.

And it's not just the provider stuff. Open WebUI is a memory hog. Its Docker container is huge. I wanted a secure, private way to host local models and API models from OpenRouter for my family on our local network. My wife and I both work with sensitive client information. We don't want that uploaded to someone else's cloud. Open WebUI could do that, technically, but the overhead was ridiculous for what we actually needed.

That T3 Chat inspiration was still rattling around in my head. Theo proved you could dial it back - make it fast, make it easy to use, strip the bloat. So the idea was: take that speed-first approach, make it actually open, and point it at local-first models.

And it's not just a feeling about the "open" part. Open WebUI's license is not an open source license. It looks BSD-style, but clause 4 says you cannot remove or alter their branding - name, logo, any visual identifier - unless you have fewer than 50 users in a 30-day window, get prior written permission, or buy an enterprise license. That's a restriction on modification. The OSI's definition of open source requires that licenses allow modification and derived works without restriction. Open WebUI's license doesn't. It's source available, not open source. The name is doing a lot of heavy lifting.

FasterChat uses the MIT license. Fork it, rebrand it, white-label it for your org, do whatever you want. No 50-user cap, no permission slip, no enterprise upsell.

The itch wouldn't go away. So I did a rewrite.

## Nuking Next.js

The original FasterChat was built in Next.js because that's what Theo used and I was trying to replicate his approach. But Next.js is bloated. Server-side rendering overhead for a chat app that doesn't need SSR. The TypeScript added type safety but also added build complexity. Every time I wanted to add a feature, I was fighting the framework.

I'd been working with Preact and Hono on client projects. I knew the stack. So in September 2025, I did the rewrite. Next.js was out. TypeScript was out. Rebuilt from zero with Preact, Hono, TanStack Router and Query, Tailwind 4.1, SQLite for server-side storage, the Vercel AI SDK for streaming, and Bun for the build. Preact's runtime is 3KB. No SSR overhead. The whole thing is lighter than the Next.js framework alone.

It's like Open WebUI but actually open.

## What FasterChat Does Today

152 stars on GitHub. Here's what actually matters to me.

**Model management in the UI.** This was the big one. No more `.env` edits. Pull Ollama models directly from the admin panel with progress streaming. Auto-discover models with models.dev integration. I built this because I was sick of SSHing into my server every time I wanted to swap a model. Turns out other people were sick of it too.

**Cross-conversation memory.** FasterChat remembers your preferences, projects, and context across chats. It extracts memories after each response in the background, so there's no latency hit. You can view, delete, or clear them. Privacy is per-user. No admin can see your memories.

**Works with anything.** Cloud providers like OpenAI, Anthropic, Google, and xAI. Or run completely offline with Ollama, LM Studio, or llama.cpp. I run mine offline on dual RX 7900 XTX's. No API keys required if you don't want them.

**Import from ChatGPT.** Bring your existing conversations with you.

It also has web search with citations, file attachments, image generation, voice input/output, multi-user auth with role-based access, and one-command Docker deployment. 15+ themes including Catppuccin, because I'm a Catppuccin maximalist.

## Where It Stands Now

The project has mostly achieved what I set out to do. It's fast, it's private, it's truly open, and it works with any provider. It runs offline on my GPU rig. People use it on their homelabs.

FasterChat is moving into maintenance mode. Not because I lost interest - because it does what it's supposed to do. The repo is at [github.com/1337hero/faster-chat](https://github.com/1337hero/faster-chat). If you're running local LLMs and want a chat interface that's fast, private, and doesn't phone home, give it a try.

I write about this stuff on X [@1337hero](https://x.com/1337hero).
