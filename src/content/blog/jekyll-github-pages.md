---
title: "Jekyll + Github Pages > WordPress"
date: 2014-12-21
---


 Just recently I migrated this website from Wordpress to [Github pages](1) using [Jekyll](2). To date I am pleased with the transition. 

##So why ditch WordPress?

Over time, I began to distain how bloated Wordpress had become. The WYSIWYG editor seems to vomit random HTML onto your page with no control over its syntax. The plugin environment is a whole story unto itself and the source of huge security concerns.

<!--more-->

Needing to install security updates every other week just became one more annoyance to deal with. Backing up WordPress is itself a pain, that always left me wondering and guessing. The performance issues with WordPress are well documented. The bigger your site gets, the worse it suffers without taking the proper steps to optimize things. At the end of the day, WordPress just required a ton of overhead.

A point of contention for myself; WordPress seems to inspire developer/creator laziness. The answer to every WordPress related question is always 'Install XYZ plugin'. Expect a detailed rant posting about this in the future.

##Enter Jekyll

In the past I had tried other static site generators, such as Kirby & Statamic. [@Joshtronic](3) first peeked my interest in using Jekyll with Github pages. After a hard look I dove right in. 

Jekyll is a static site generator.  You write your posts in Markdown, which is fast and efficient. And your templates in Liquid. It takes these plain text files and complies it into a website ready for deployment.

Its simplicity avoids all the common security concerns caused by running dynamic websites. And backups are as simple as a Git Repo and keeping your project in Dropbox.

The icing on the cake is that Github offers [free hosting for Jekyll blogs](http://pages.github.com/).


[1](https://github.com/devbymike/mk3y.com)
[2](http://jekyllrb.com)
[3](http://joshtronic.com)
