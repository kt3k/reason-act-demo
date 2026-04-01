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
$ node --env-file=.env main.ts date time package for frontend
Package requirement: date time package for frontend
Thought: Need identify best frontend date time package, likely lightweight and TS-friendly. Search broad date/time packages first.
Act: { tool: 'search', arg: 'date time' }
Observation:  [{"downloads":186884,"dependents":"11","name":"@fluentui/date-time-utilities"},{"downloads":58355,"d...
Thought: Top general packages are dayjs and rc-picker. Since user needs a frontend date-time package, likely a UI picker plus date utilities. Need inspect a couple likely candidates for TS support/maintenance. Start with dayjs.
Act: { tool: 'get_info', arg: 'dayjs' }
Observation:  {"name":"dayjs","description":"2KB immutable date time library alternative to Moment.js with the sam...
Answer: {
  recommended: 'rc-picker',
  latestVersion: '4.11.3',
  license: 'MIT',
  alternatives: [
    'dayjs',
    '@vaadin/date-time-picker',
    '@fluentui/date-time-utilities'
  ],
  reasons: [
    'Best fit for a frontend date/time picker: it is a UI component library rather than just a date utility.',
    'Very healthy adoption from npm downloads and dependents, suggesting strong real-world usage.',
    'Actively maintained and widely used in React ecosystems.',
    'Supports modern date libraries through adapters, making it flexible for TypeScript-based frontend apps.',
    'MIT licensed and suitable for commercial and open-source projects.'
  ],
  tradeoffs: [
    'It is primarily a picker/component library, not a full date math library; you may still want Day.js for parsing/formatting and manipulation.',
    'It is most natural in React projects; if you are using Vue or Angular, a framework-specific picker may be a better ergonomic choice.',
    'Compared with Day.js, it is heavier because it solves UI concerns, not just date handling.'
  ]
}
```

## License

MIT
