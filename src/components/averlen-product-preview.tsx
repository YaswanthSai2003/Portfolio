function versioned(src?: string) {
  if (!src) return undefined;

  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  const joiner = src.includes("?") ? "&" : "?";

  return `${src}${joiner}portfolio=v35`;
}

export function AverlenProductPreview({
  overviewImage,
  pricingImage,
}: {
  overviewImage?: string;
  pricingImage?: string;
}) {
  const overview = versioned(overviewImage);
  const pricing = versioned(pricingImage);

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[30px]

        bg-[linear-gradient(
          135deg,
          #f7f8f6_0%,
          #f1f4f1_48%,
          #e8efeb_100%
        )]

        p-5

        dark:bg-[linear-gradient(
          135deg,
          #121416_0%,
          #161b1b_52%,
          #1c2421_100%
        )]

        sm:p-7
        lg:p-8
      "
    >
      {/* Ambient light */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16

          size-72
          rounded-full

          bg-white/70
          blur-[90px]

          dark:bg-white/[0.04]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-16

          size-80
          rounded-full

          bg-[#dce9e2]/60
          blur-[100px]

          dark:bg-[#294039]/25
        "
      />

      {/* Product composition */}
      <div
        className="
          relative
          aspect-[1.25/1]

          min-h-[420px]

          sm:min-h-[500px]
          lg:min-h-[560px]
        "
      >
        {/* OVERVIEW — BACK */}
        {overview ? (
          <div
            className="
              absolute
              left-[3%]
              top-[5%]
              z-10

              w-[76%]

              overflow-hidden
              rounded-[20px]

              bg-white

              shadow-[0_18px_50px_rgba(25,31,28,0.08)]

              dark:bg-white
              dark:shadow-[0_18px_50px_rgba(0,0,0,0.16)]
            "
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={overview}
              alt="Averlen revenue overview dashboard"
              className="
                block
                h-auto
                w-full

                object-cover
                object-top
              "
            />
          </div>
        ) : null}

        {/* PRICING — FRONT */}
        {pricing ? (
          <div
            className="
              absolute
              bottom-[3%]
              right-[2%]
              z-20

              w-[82%]

              overflow-hidden
              rounded-[22px]

              bg-white

              shadow-[0_28px_65px_rgba(25,31,28,0.10)]

              dark:bg-white
              dark:shadow-[0_28px_65px_rgba(0,0,0,0.20)]
            "
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pricing}
              alt="Averlen pricing dashboard"
              className="
                block
                h-auto
                w-full

                object-cover
                object-top
              "
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}