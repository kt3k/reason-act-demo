# reason-act-demo

This demo implements ReAct (Reason+Act) pattern in TypeScript. The demo uses
OpenAI SDK for LLM call, but it can be replaced with any LLM.

This demo doesn't use framework for implementing ReAct, but only uses TypeScript
and custom prompt.

You can run it with Node.js, Deno, or Bun. You need to set `OPENAI_API_KEY` in
`.env` to run this demo.

```
OPENAI_API_KEY=sk-.....
```

Example runs:

```shellsession
$ deno --env -NE main.ts best web framework
Package requirement: best web framework
Thought: I should clarify the main candidates for “best web framework” by searching the npm registry for web frameworks, then I can inspect the top options for maintenance, downloads, TypeScript support, and licenses.
Act: { tool: "search", arg: "web framework" }
Observation:  [{"downloads":96246348,"dependents":"101499","name":"express"},{"downloads":35812002,"dependents":"2...
Thought: I’ve identified the most relevant candidates by adoption: Express, Hono, Fastify, and NestJS. To recommend the best one, I need package metadata for the top contenders to compare maintenance, license, and TypeScript support.
Act: { tool: "get_info", arg: "hono" }
Observation:  {"name":"hono","description":"Web framework built on Web Standards","license":"MIT","readme":"<div a...
Answer: {
  recommended: "hono",
  latestVersion: "4.12.9",
  license: "MIT",
  alternatives: [ "fastify", "express", "@nestjs/core" ],
  reasons: [
    "Hono is actively maintained and explicitly позициониed as a modern web framework built on Web Standards.",
    "It has very strong adoption for a newer framework and a large community footprint.",
    "It has first-class TypeScript support and a very clean API.",
    "It is runtime-flexible: works across Node.js, Bun, Deno, Cloudflare Workers, Lambda, and more.",
    "It is lightweight and fast, which makes it a strong default recommendation for new projects."
  ],
  tradeoffs: [
    "Express has far higher adoption and a much larger ecosystem, but it is older, less opinionated, and not as modern in TypeScript/runtime support.",
    "Fastify is a great choice if you want a Node-focused framework with strong performance and mature plugin support, but I did not see enough metadata here to prefer it over Hono.",
    "NestJS is best if you want an opinionated, enterprise-style architecture, but it is heavier and more framework-like than a general-purpose web framework.",
    "If your project is strictly Node.js and you need the broadest legacy middleware compatibility, Express may still be the safer compatibility pick."
  ]
}
```

```shellsession
$ node --env-file=.env main.ts date time library for frontend
Package requirement: date time library for frontend
Thought: I should search for npm packages related to date/time libraries that are suitable for frontend use, then inspect the most relevant candidates for maintenance, adoption, TypeScript support, and latest versions.
Act: { tool: 'search', arg: 'date time' }
Observation:  [{"downloads":186884,"dependents":"11","name":"@fluentui/date-time-utilities"},{"downloads":58355,"d...
Thought: The search results show very popular general-purpose date libraries like Day.js, plus some picker components that are framework-specific. For a frontend date/time library, I should inspect the leading candidates to verify maintenance, TypeScript support, and latest versions before recommending one.
Act: { tool: 'get_info', arg: 'dayjs' }
Observation:  {"name":"dayjs","description":"2KB immutable date time library alternative to Moment.js with the sam...
Answer: {
  recommended: 'dayjs',
  latestVersion: '1.11.20',
  license: 'MIT',
  alternatives: [ 'date-fns', 'Luxon', 'rc-picker' ],
  reasons: [
    'Very high adoption: it has by far one of the largest download counts in the search results.',
    'Actively maintained and widely used in frontend apps.',
    'Small bundle footprint and good fit for browser usage.',
    'Clear TypeScript support and a modern API.',
    "Moment-like chaining makes it easy to adopt if you're coming from Moment.js."
  ],
  tradeoffs: [
    'Plugin-based functionality means some features require extra setup.',
    'It is not the most feature-complete option for timezone/locale-heavy work compared with Luxon.',
    'If you need immutable utility-style date helpers with the strongest TypeScript ergonomics, date-fns may be a better fit.',
    'If you need a date picker UI component rather than a date library, rc-picker is more appropriate than Day.js.'
  ]
}
```

## License

MIT
