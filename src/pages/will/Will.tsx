import {DiviWillInput} from "@/pages/will/components/DiviWillInput";
import {BaguaDukiDAO} from "@/pages/divi/components/BaguaDukiDao.tsx";
import {animated, config, useSpring} from "@react-spring/web";
import DivinationTabs from "@/pages/will/DivinationTabs";
import {usePageWillData} from "@/i18n/DataProvider";

const Will = () => {
  const willPageData = usePageWillData();
  const fadeInUpSpring = useSpring({
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: {
      transform: 'translateY(0px)',
      opacity: 1
    },
    config: config.gentle
  });

  const containerSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.gentle
  });

  return (
    <animated.div
      style={containerSpring}
      className="relative flex flex-col items-center justify-start px-4 py-6"
    >
      <div className="relative z-10 text-center w-full max-w-7xl mx-auto">
        <animated.div style={fadeInUpSpring}>
          <div className="mt-4 inset-0 overflow-hidden w-20 h-20 sm:w-24 sm:h-24 mx-auto animate-[spin_64s_linear_infinite]">
            <BaguaDukiDAO />
          </div>
        </animated.div>

        <animated.h1
          style={fadeInUpSpring}
          className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-cinzel font-bold text-glow mb-4 sm:mb-6 px-2"
        >
          {willPageData.diviAlgo}
        </animated.h1>

        <animated.p
          style={fadeInUpSpring}
          className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto font-inter px-4"
        >
          {willPageData.diviAlgoDescription}
        </animated.p>

        <animated.div style={fadeInUpSpring} className="flex justify-center px-4">
          <DiviWillInput />
        </animated.div>

        <animated.div style={fadeInUpSpring} className="mt-6 mb-6 flex justify-center">
          <div className="w-full max-w-2xl px-4">
            <div className="h-px bg-gradient-to-r from-white/0 via-white/50 to-white/0"></div>
          </div>
        </animated.div>

        <animated.div style={fadeInUpSpring} className="mt-6 sm:mt-8 max-w-6xl mx-auto px-2 sm:px-4">
          <DivinationTabs />
        </animated.div>

        {/* Steps Guide */}
        <animated.div style={fadeInUpSpring} className="mt-16 sm:mt-20 md:mt-24 max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-center text-purple-200 mb-8 sm:mb-12 md:mb-16">
            {willPageData.diviAlgoStepsTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 md:gap-8 relative">

            <div className="hidden md:block absolute top-24 left-[0%] right-[0%] h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0" />

            {willPageData.diviAlgoSteps.map((step, index) => (
              <animated.div
                key={index}
                style={fadeInUpSpring}
                className="relative text-center px-4 sm:px-2 md:px-4 mb-8 sm:mb-4 md:mb-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-cinzel font-bold text-purple-300 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-white/70">
                  {step.description}
                </p>
              </animated.div>
            ))}
          </div>
        </animated.div>

        {/* Fancy Slogan */}
        <animated.div style={fadeInUpSpring} className="mt-12 sm:mt-16 mb-8 text-center relative px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 blur-3xl" />
          <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cinzel font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 text-transparent bg-clip-text px-2">
            {willPageData.diviAlgoSlogan}
          </h2>
          <p className="relative mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/70 font-inter">
            {willPageData.diviAlgoSloganDescription}
          </p>
        </animated.div>
      </div>
    </animated.div>
  );
};

export default Will;
