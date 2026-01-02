---
layout: default
title: Actualités
permalink: /actualites/
---

# Actualités
<ul>
{% raw %}{% for post in site.posts %}{% endraw %}
  <li>
    {% raw %}{{ post.date | date: "%d.%m.%Y" }} — <a href="{{ post.url }}">{{ post.title }}</a>{% endraw %}
  </li>
{% raw %}{% endfor %}{% endraw %}
</ul>
