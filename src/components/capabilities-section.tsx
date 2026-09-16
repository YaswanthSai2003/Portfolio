const shell =
  "mx-auto w-[min(1420px,calc(100%_-_64px))] max-sm:w-[calc(100%_-_32px)]";

const kicker =
  "font-[var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-black/42 dark:text-white/42";

const capabilities = [
  {
    number: "01",

    title:
      "Backend systems",

    description:
      "APIs, authentication, validation and service boundaries designed around real application behaviour.",

    stack: [
      "Python",
      "FastAPI",
      "Node.js",
      "Express",
      "REST",
      "JWT",
      "RBAC",
    ],

    applied:
      "Authentication · Validation · Rate Limiting · Testing",
  },

  {
    number: "02",

    title:
      "Product interfaces",

    description:
      "Responsive product surfaces connected closely to the workflows, APIs and data behind them.",

    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Zustand",
    ],

    applied:
      "Responsive UI · API Integration · State Management",
  },

  {
    number: "03",

    title:
      "Data & infrastructure",

    description:
      "Structured data, caching and application infrastructure shaped around how the product actually operates.",

    stack: [
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "Pandas",
      "Docker",
      "Alembic",
    ],

    applied:
      "Data Modelling · Caching · Migrations · Analytics · Ingestion",
  },

  {
    number: "04",

    title:
      "AI & applied ML",

    description:
      "AI-assisted features and applied machine learning with validation and engineering checks around model output.",

    stack: [
      "LLM APIs",
      "Agents",
      "PyTorch",
      "Faster R-CNN",
      "Evaluation",
    ],

    applied:
      "Structured Outputs · Validation · Evaluation · Computer Vision",
  },
];

const workflow = [
  {
    number: "01",

    title:
      "Understand",

    description:
      "Clarify the problem, users and failure cases.",
  },

  {
    number: "02",

    title:
      "Design",

    description:
      "Choose boundaries, data flow and trade-offs.",
  },

  {
    number: "03",

    title:
      "Build",

    description:
      "Implement the smallest reliable surface.",
  },

  {
    number: "04",

    title:
      "Verify",

    description:
      "Test assumptions, behaviour and edge cases.",
  },

  {
    number: "05",

    title:
      "Ship",

    description:
      "Observe the result and improve from evidence.",
  },
];

function CapabilityCard({
  capability,
}: {
  capability:
    (typeof capabilities)[number];
}) {
  return (
    <article
      className="
        min-h-[360px]

        border
        border-black/10

        p-7

        dark:border-white/[0.09]

        sm:p-9

        lg:min-h-[410px]
        lg:p-10
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-6
        "
      >
        <span
          className="
            font-[var(--font-mono)]
            text-[8px]
            tracking-[0.1em]
            text-[#d96d45]
          "
        >
          {capability.number}
        </span>

        <span
          className="
            font-[var(--font-mono)]
            text-[8px]
            uppercase
            tracking-[0.14em]
            text-black/24

            dark:text-white/24
          "
        >
          Capability
        </span>
      </div>

      <div className="mt-12">
        <h3
          className="
            font-[var(--font-display)]
            text-[clamp(32px,3vw,46px)]
            font-semibold
            leading-[0.94]
            tracking-[-0.058em]
          "
        >
          {capability.title}
        </h3>

        <p
          className="
            mt-5
            max-w-[650px]

            text-[11px]
            leading-7
            text-black/46

            dark:text-white/46
          "
        >
          {capability.description}
        </p>

        <div
          className="
            mt-7
            flex
            flex-wrap
            gap-2
          "
        >
          {capability.stack.map(
            (item) => (
              <span
                key={item}
                className="
                  rounded-full

                  border
                  border-black/[0.09]

                  bg-white/40

                  px-3
                  py-1.5

                  font-[var(--font-mono)]
                  text-[7px]
                  uppercase
                  tracking-[0.07em]
                  text-black/42

                  dark:border-white/[0.09]
                  dark:bg-white/[0.035]
                  dark:text-white/42
                "
              >
                {item}
              </span>
            ),
          )}
        </div>
      </div>

      <div
        className="
          mt-8

          border-t
          border-black/10

          pt-5

          dark:border-white/[0.09]
        "
      >
        <p
          className="
            font-[var(--font-mono)]
            text-[8px]
            uppercase
            tracking-[0.14em]
            text-black/24

            dark:text-white/24
          "
        >
          Applied through
        </p>

        <p
          className="
            mt-4

            text-[9.5px]
            leading-6
            text-black/42

            dark:text-white/42
          "
        >
          {capability.applied}
        </p>
      </div>
    </article>
  );
}

export function CapabilitiesSection() {
  return (
    <section
      id="about"
      className="
        scroll-mt-24

        border-y
        border-black/10

        bg-[#e6e9eb]

        dark:border-white/[0.09]
        dark:bg-[#171b21]
      "
    >
      <div
        className={`
          ${shell}
          py-20
          lg:py-24
        `}
      >
        {/* HEADER */}

        <div
          className="
            grid
            gap-8

            pb-12

            lg:grid-cols-[.34fr_1.66fr]
            lg:gap-16
            lg:pb-14
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  font-[var(--font-mono)]
                  text-[8px]
                  uppercase
                  tracking-[0.14em]
                  text-[#d96d45]
                "
              >
                04 / Capabilities
              </span>

              <span
                className="
                  h-px
                  w-8

                  bg-black/10

                  dark:bg-white/[0.09]
                "
              />
            </div>

            <p
              className="
                mt-6
                max-w-[300px]

                text-[10.5px]
                leading-7
                text-black/38

                dark:text-white/38
              "
            >
              A practical engineering
              toolkit built through
              products, backend systems
              and applied AI work.
            </p>
          </div>

          <div>
            <h2
              className="
                font-[var(--font-display)]
                text-[clamp(50px,5.5vw,82px)]
                font-semibold
                leading-[0.9]
                tracking-[-0.068em]
              "
            >
              What I work with.
            </h2>

            <p
              className="
                mt-6
                max-w-[850px]

                text-[12px]
                leading-8
                text-black/48

                dark:text-white/48
              "
            >
              My work spans backend
              systems, product interfaces,
              data and AI, with each layer
              designed to work together as
              part of one complete product.
            </p>
          </div>
        </div>

        {/* CAPABILITY GRID */}

        <div
          className="
            grid

            border-l
            border-t
            border-black/10

            dark:border-white/[0.09]

            lg:grid-cols-2
          "
        >
          {capabilities.map(
            (capability) => (
              <CapabilityCard
                key={
                  capability.title
                }
                capability={
                  capability
                }
              />
            ),
          )}
        </div>

        {/* HOW I BUILD */}

        <div
          className="
            mt-12

            border-y
            border-black/10

            py-9

            dark:border-white/[0.09]

            lg:mt-14
          "
        >
          <div
            className="
              grid
              gap-10

              lg:grid-cols-[.32fr_1.68fr]
              lg:gap-14
            "
          >
            <div>
              <p className={kicker}>
                HOW I BUILD
              </p>

              <h3
                className="
                  mt-4
                  max-w-[320px]

                  font-[var(--font-display)]
                  text-[clamp(32px,3.2vw,46px)]
                  font-semibold
                  leading-[0.96]
                  tracking-[-0.055em]
                "
              >
                Fast iteration.
                <br />

                Clear reasoning.
              </h3>
            </div>

            <div
              className="
                grid
                gap-7

                sm:grid-cols-2

                lg:grid-cols-5
                lg:gap-0
              "
            >
              {workflow.map(
                (
                  step,
                  index,
                ) => (
                  <div
                    key={
                      step.title
                    }
                    className={`
                      ${
                        index > 0
                          ? "lg:border-l lg:border-black/10 lg:pl-5 dark:lg:border-white/[0.09]"
                          : ""
                      }

                      ${
                        index <
                        workflow.length -
                          1
                          ? "lg:pr-5"
                          : ""
                      }
                    `}
                  >
                    <span
                      className="
                        font-[var(--font-mono)]
                        text-[7px]
                        text-[#d96d45]
                      "
                    >
                      {step.number}
                    </span>

                    <strong
                      className="
                        mt-5
                        block

                        text-[11px]
                        font-semibold
                        text-black/76

                        dark:text-white/76
                      "
                    >
                      {step.title}
                    </strong>

                    <p
                      className="
                        mt-3
                        max-w-[180px]

                        text-[8.5px]
                        leading-5
                        text-black/38

                        dark:text-white/38
                      "
                    >
                      {
                        step.description
                      }
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}